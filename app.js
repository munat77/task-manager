// Task array to store all tasks
let tasks = [];

// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage on startup
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to display tasks
function displayTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = '<li style="color: #999; text-align: center;">No tasks yet. Add one above!</li>';
        return;
    }

    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleComplete(index));
        
        const span = document.createElement('span');
        span.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Function to add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Please enter a task');
        return;
    }
    
    tasks.push({
        text: text,
        completed: false
    });
    
    saveTasks();  // ← Saves after adding
    taskInput.value = '';
    displayTasks();
}

// Function to toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();  // ← Saves after toggle
    displayTasks();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();  // ← Saves after delete
    displayTasks();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Load tasks and display
loadTasks();
displayTasks();