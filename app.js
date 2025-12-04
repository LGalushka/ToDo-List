let tasks = [];

const makeID = () => Date.now() + Math.random();

const inputTask = document.getElementById('inputTask');
const addBtn = document.getElementById('addBtn');
const taskConteiner = document.getElementById('taskConteiner');
const themeToggle = document.getElementById('themeToggle');

//загрузка задач из localStorage при загрузке страницы
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    tasks = JSON.parse(stored);
    render();
  }
}

//добавление задачи
function addTask(text) {
  const task = { id: makeID(), text, done: false };
  tasks.push(task);
  saveToLocalStorage();
  render();
}

//удаление задачи
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveToLocalStorage();
  render();
}

//изменение статуса задачи
function toggleDone(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.done = !task.done;
  }
  saveToLocalStorage();
  render();
}

function cancelEdit(id) {
  const li = taskConteiner.querySelector(`li[data-id='${id}']`);
  if(li) {
    const editBtn = li.querySelector('.edit-btn');
    if(editBtn) editBtn.textContent = 'Изменить';
    li.classList.remove('editing');    
  }
  render();
}

//начало редактирования задачи
function startEdit(id) {
  const li = taskConteiner.querySelector(`li[data-id='${id}']`);
  if(!li) return;

  const textNode = li.querySelector('.task-text');

  const inputEl = document.createElement('input');
  inputEl.value = textNode.textContent;
  inputEl.className = 'edit-input';

  textNode.replaceWith(inputEl);
  li.classList.add('editing');
  li.querySelector('.edit-btn').textContent = 'Сохранить';

  inputEl.focus();

  //обработчики событий для сохранения или отмены редактирования
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    }
    if(e.key === 'Escape') {
      cancelEdit(id);
    }
  })
  inputEl.addEventListener('blur', () => {
    saveEdit(id);
  })
}


function saveEdit(id) {
  const li = taskConteiner.querySelector(`li[data-id='${id}']`);
  if(!li) return;

  const inputEl = li.querySelector('.edit-input');
  if(!inputEl) return;
  const newText = inputEl.value.trim();
  if(!newText) {
    cancelEdit(id);
    return;
  }
  const task = tasks.find(task => task.id === id);
  if(task) {
    task.text = newText;
  }

  const editBtn = li.querySelector('.edit-btn');
  if(editBtn) editBtn.textContent = 'Изменить';
  li.classList.remove('editing');

  saveToLocalStorage();
  render();
}


//рендер задач
function render() {
  taskConteiner.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = 'task-item';
    li.classList.toggle('done', task.done);


    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      toggleDone(task.id);
    });

    const text = document.createElement('span');
    text.textContent = task.text;
    text.className = "task-text";

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Изменить';
    editBtn.className = 'edit-btn';

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.className = 'del-btn';

    li.append(checkbox, text, editBtn, delBtn);
    taskConteiner.appendChild(li);
  });  
}

//обработчики событий
addBtn.addEventListener('click', () => {
  const text = inputTask.value.trim();
  if(!text) return;
  addTask(text);
  inputTask.value = '';
  inputTask.focus();
  render();
});

//добавление задачи по нажатию Enter
inputTask.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  if(html.getAttribute('data-theme') === 'light') {
    html.removeAttribute('data-theme');
  }else {
    html.setAttribute('data-theme', 'light');
  }
});

//делегирование событий для кнопок изменения и удаления
taskConteiner.addEventListener('click', (e) => {
  const btn = e.target;
  const li = btn.closest('li');
  if (!li) return;
  const id = Number(li.dataset.id);

  if(btn.classList.contains('del-btn')) {
    deleteTask(id);
    return;
  }
  if(btn.classList.contains('edit-btn')) {
    if(li.classList.contains('editing')) {
      saveEdit(id);
    }else {
      startEdit(id);
    }
  }
});

loadFromLocalStorage();
render();