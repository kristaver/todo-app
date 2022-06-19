const getTodos = () => window.history.state.todos;

const saveTodoToState = (title, desc, completed) => {
  const todos = getTodos();
  todos.push({ title, desc, completed });
  window.history.pushState({ todos }, '', '');
  window.dispatchEvent(new Event('statechange'));
};

const saveStateToLocalStorage = () => {
  const todos = getTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
  window.dispatchEvent(new Event('statechange'));
};

const checkAndCreateState = () => {
  const todos = localStorage.getItem('todos');
  if (todos) {
    window.history.pushState({ todos: JSON.parse(todos) }, '', '');
  } else {
    window.history.pushState({ todos: [] }, '', '');
  }
  window.dispatchEvent(new Event('statechange'));
};

const findClickedTodo = (e) => e.currentTarget.querySelector('.todo__item--title').innerText;
const findElementToDelete = (e) => e.target.parentElement.querySelector('.todo__item--title').innerText;

const deleteElement = (e) => {
  const todoIndex = window.history.state.todos.findIndex((t) => t.title === findElementToDelete(e));
  window.history.state.todos.splice(todoIndex, 1);
  saveStateToLocalStorage();
};

const toggleCompleted = (e) => {
  if (e.target.matches('.todo__remove-button')) {
    return;
  }
  const todoIndex = window.history.state.todos.findIndex((t) => t.title === findClickedTodo(e));
  const todoElement = window.history.state.todos[todoIndex];
  todoElement.completed = !todoElement.completed;
  saveStateToLocalStorage();
};

/* -------------------------------------------------------------- */

const newTodo = (el) => {
  const addNewTodo = document.createElement('section');
  addNewTodo.className = 'todo__new-todo';
  addNewTodo.innerHTML = `
  <h1 class="todo__new-todo--heading"> Register a new todo </h1>
  <form action="" class="todo__add-form">
  <input type="text" class="todo__new-todo--input todo__input--title" data-testid="txtTodoItemTitle" placeholder="Title" required>
  <input type="text" class="todo__new-todo--input todo__input--desc" data-testid="txtTodoItemDesc" placeholder="Description">
  <button type="submit" class="todo__new-todo--input todo__new-todo--button" data-testid="btnAddTodo">Add new</button>
  </form>`;
  el.append(addNewTodo);
};

const todoList = (el) => {
  const list = document.createElement('section');
  list.className = 'todo__list';
  list.setAttribute('data-testid', 'todoList');
  el.append(list);
};

const removeElementBtn = (el) => {
  const btn = document.createElement('button');
  btn.setAttribute('data-testid', 'btnDeleteTodo');
  btn.className = 'todo__remove-button';
  btn.innerText = 'Remove';
  btn.addEventListener('click', (e) => deleteElement(e));
  el.append(btn);
};

const updateTodoList = () => {
  const todoListElement = document.querySelector('.todo__list');
  todoListElement.innerHTML = '';

  const todos = getTodos();
  todos.forEach((todo) => {
    const todoItem = document.createElement('div');
    todoItem.addEventListener('click', (event) => toggleCompleted(event));
    todoItem.setAttribute('data-testid', 'todoItem');
    todoItem.innerHTML = `
    <h2 class="todo__item--title">${todo.title}</h2>
    <p class="todo__item--description">${todo.desc}</p>`;

    if (todo.completed) {
      todoItem.className = 'todo__item todo__item--completed';
      removeElementBtn(todoItem);
    } else {
      todoItem.className = 'todo__item';
    }
    todoListElement.append(todoItem);
  });
};

/* -------------------------------------------------------------- */

window.addEventListener('statechange', () => {
  updateTodoList();
});

window.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = e.target.querySelector('.todo__input--title').value;
  const desc = e.target.querySelector('.todo__input--desc').value;

  e.target.reset();
  saveTodoToState(title, desc, false);
  saveStateToLocalStorage();
});

const render = (rootElement) => {
  newTodo(rootElement);
  todoList(rootElement);
};

const app = document.querySelector('.todo');

window.onload = () => {
  render(app);
  checkAndCreateState();
};
