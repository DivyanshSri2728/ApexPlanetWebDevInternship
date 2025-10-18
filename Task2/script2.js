const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

window.addEventListener('load', showTasks);


addBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    addTask(taskText);
    saveTask(taskText);
    taskInput.value = '';
});


function addTask(text, completed = false) {
    const li = document.createElement('li');
    li.textContent = text;

    if (completed) li.classList.add('completed');

   
    li.addEventListener('click', function() {
        li.classList.toggle('completed');
        updateStorage();
    });

    
    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.classList.add('delete-btn');

    delBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        li.remove();
        updateStorage();
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
}


function saveTask(text) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function showTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach(t => addTask(t.text, t.completed));
}


function updateStorage() {
    const allTasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        allTasks.push({
            text: li.firstChild.textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(allTasks));
}
