let tasks = [];

const makeID = () => Date.now()

const inputTask = document.getElementById('inputTask');
const addBtn = document.getElementById('addBtn');
const taskConteiner = document.getElementById('taskConteiner');
const themeToggle = document.getElementById('themeToggle');

function addTask(text) {
  const task = { id: makeID(), text, done: false };
  tasks.push(task);
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  render();
}

//изменение статуса задачи
function toggleDone(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.done = !task.done;
  }
  render();
}

function render() {
  taskConteiner.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      toggleDone(task.id);
    });

    const text = document.createElement('span');
    text.textContent = task.text;
    text.className = task.done ? 'done' : '';

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    li.append(checkbox, text, delBtn);
    taskConteiner.appendChild(li);
  });  
}

addBtn.addEventListener('click', () => {
  const text = inputTask.value.trim();
  if(!text) return;
  addTask(text);
  inputTask.value = '';
  render();
});
inputTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});