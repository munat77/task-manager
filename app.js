// Task array to store all tasks
let tasks = [];
let currentFilter = 'all';  // ← NEW: tracks which filter is active

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

// Function to display tasks (UPDATED with filter support)
function displayTasks() {
    // Filter tasks based on currentFilter
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        let message = 'No tasks yet. Add one above!';
        if (currentFilter === 'active') message = 'No active tasks! 🎉';
        if (currentFilter === 'completed') message = 'No completed tasks yet';
        taskList.innerHTML = `<li style="color: #999; text-align: center;">${message}</li>`;
        return;
    }

    taskList.innerHTML = '';
    filteredTasks.forEach((task) => {
        // Find the original index for operations
        const originalIndex = tasks.findIndex(t => t === task);
        
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleComplete(originalIndex));
        
        const span = document.createElement('span');
        span.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(originalIndex));
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// NEW: Function to set active filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active button styling
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    displayTasks();
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
    
    saveTasks();
    taskInput.value = '';
    displayTasks();
}

// Function to toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();  // Refresh to respect current filter
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// NEW: Add filter button event listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// Load tasks and display
loadTasks();
displayTasks();