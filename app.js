// Task array
let tasks = [];
let currentFilter = 'all';

// DOM elements
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDate');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Load from localStorage
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;
}

// Check if a due date is overdue
function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
}

// Format priority text
function getPriorityBadge(priority) {
    const badges = {
        high: '<span class="priority-badge priority-high">🔴 High</span>',
        medium: '<span class="priority-badge priority-medium">🟡 Medium</span>',
        low: '<span class="priority-badge priority-low">🟢 Low</span>'
    };
    return badges[priority] || badges.low;
}

// Display tasks
function displayTasks() {
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        let message = '✨ No tasks yet. Add one above!';
        if (currentFilter === 'active') message = '🎉 No active tasks! Great job!';
        if (currentFilter === 'completed') message = '📝 No completed tasks yet';
        taskList.innerHTML = `<li style="color: #999; text-align: center;">${message}</li>`;
        updateStats();
        return;
    }

    taskList.innerHTML = '';
    filteredTasks.forEach((task) => {
        const originalIndex = tasks.findIndex(t => t === task);
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.style.cursor = 'pointer';
        checkbox.addEventListener('change', () => toggleComplete(originalIndex));
        
        // Task text (editable on double-click)
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.innerHTML = `${task.text} ${getPriorityBadge(task.priority)}`;
        taskSpan.ondblclick = () => editTask(originalIndex);
        
        // Due date display
        const dueDateSpan = document.createElement('span');
        dueDateSpan.className = `due-date ${isOverdue(task.dueDate) && !task.completed ? 'overdue' : ''}`;
        if (task.dueDate) {
            dueDateSpan.textContent = `📅 ${task.dueDate}`;
            if (isOverdue(task.dueDate) && !task.completed) {
                dueDateSpan.textContent = `⚠️ Overdue: ${task.dueDate}`;
            }
        }
        
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.className = 'edit-btn';
        editBtn.title = 'Double-click text or click edit';
        editBtn.addEventListener('click', () => editTask(originalIndex));
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(originalIndex));
        
        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(dueDateSpan);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
    
    updateStats();
}

// Edit task
function editTask(index) {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText && newText.trim()) {
        tasks[index].text = newText.trim();
        saveTasks();
        displayTasks();
    }
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Please enter a task');
        return;
    }
    
    tasks.push({
        text: text,
        completed: false,
        dueDate: dueDateInput.value || null,
        priority: prioritySelect.value,
        createdAt: new Date().toISOString()
    });
    
    taskInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'low';
    saveTasks();
    displayTasks();
}

// Toggle complete
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

// Delete task
function deleteTask(index) {
    if (confirm('Delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks();
    }
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    displayTasks();
}

// Dark mode toggle
function initDarkMode() {
    const darkModeBtn = document.getElementById('darkModeToggle');
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeBtn.textContent = '☀️ Light';
    }
    
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeBtn.textContent = '☀️ Light';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeBtn.textContent = '🌙 Dark';
        }
    });
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// Initialize
loadTasks();
displayTasks();
initDarkMode();