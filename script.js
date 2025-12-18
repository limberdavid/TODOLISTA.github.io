let todos = JSON.parse(localStorage.getItem('limberTodos')) || [];
let currentFilter = 'all';

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');

function saveTodos() {
    localStorage.setItem('limberTodos', JSON.stringify(todos));
}

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    todos.push({
        id: Date.now(),
        text,
        completed: false
    });

    todoInput.value = '';
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
}

function renderTodos() {
    let filtered = todos;

    if (currentFilter === 'active') {
        filtered = todos.filter(t => !t.completed);
    }
    if (currentFilter === 'completed') {
        filtered = todos.filter(t => t.completed);
    }

    todoList.innerHTML = '';

    filtered.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">✖</button>
        `;

        li.querySelector('.todo-checkbox')
            .addEventListener('change', () => toggleTodo(todo.id));

        li.querySelector('.delete-btn')
            .addEventListener('click', () => deleteTodo(todo.id));

        todoList.appendChild(li);
    });

    updateCounts();
}

function updateCounts() {
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;

    document.getElementById('allCount').textContent = todos.length;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('itemsLeft').textContent = `${active} pendientes`;
}

/* EVENTS */
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTodo();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

/* INIT */
renderTodos();
