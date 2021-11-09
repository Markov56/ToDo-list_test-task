const todoInput = document.querySelector('.todo__input');
const todoBtn = document.querySelector('.todo__btn');
const todoList = document.querySelector('.todo__list');

let todos = [];

const postTodos = (newObj) => {
  fetch('https://my-json-server.typicode.com/markov56/ToDo-list_test-task/todos', {
    method: 'POST',
    body: JSON.stringify(newObj),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
};

if (localStorage.getItem('list')) {
  todos = JSON.parse(localStorage.getItem('list'));
  renderItems();
  postTodos(todos);
}

const countId = () => {
  let lastId = todos[todos.length - 1] || 0;
  console.log(lastId);
};

const onAddClick = () => {
  if (todoInput.value) {
    const newTask = {
      description: todoInput.value,
      done: false,
    };

    if (!todos.find((item) => item.description == newTask.description)) {
      todos.push(newTask);
      localStorage.setItem('list', JSON.stringify(todos));
      renderItems();
      todoInput.value = '';
    } else {
      alert('Вы уже добавили эту задачу');
    }
    postTodos(todos);
  }
};

const onRemoveClick = (event) => {
  let elementForRemove = event.target.parentElement;
  console.dir(elementForRemove.getAttribute('id'));
  let elementIndex = elementForRemove.getAttribute('id');
  todos.splice(elementIndex, 1);
  localStorage.setItem('list', JSON.stringify(todos));
  elementForRemove.remove();
  renderItems();
};

todoBtn.addEventListener('click', onAddClick);
todoInput.addEventListener('keypress', (keyPressed) => {
  if (keyPressed.which == 13) {
    onAddClick();
  }
});

function renderItems() {
  let tasks = '';
  todos.map((item, index) => {
    tasks += `
        <li class="todo__list-item" id=${index}>
            <input type="checkbox" id=${index} ${item.done ? 'checked' : ''}/>
            <label for=${index}>${item.description}</label>
            <button class="todo__list__remove" onclick="onRemoveClick(event)">Удалить</button>
        </li>
        `;
    todoList.innerHTML = tasks;
  });
}

todoList.addEventListener('change', (event) => {
  let id = event.target.getAttribute('id');
  let labelText = todoList.querySelector(`[for="${id}"]`).innerHTML;
  todos.forEach((item) => {
    if (item.description == labelText) {
      item.done = !item.done;
      localStorage.setItem('list', JSON.stringify(todos));
    }
  });
});
