/// <reference types="cypress" />
describe('todo functional tests', () => {
  const getUniqueTitle = () =>
    `A title at ${new Date().getSeconds()}${new Date().getMilliseconds()}`;

  const TodoPage = {
    titleInput: () => cy.get('[data-testid="txtTodoItemTitle"]'),
    addButton: () => cy.get('[data-testid="btnAddTodo"]'),
    todoList: () => cy.get('[data-testid="todoList"]'),
    todoListItems: () => TodoPage.todoList().children(),
    visit: () => cy.visit('http://localhost:8080'),
    clear: () => cy.clearLocalStorage(),
    createTodo: (title) => {
      TodoPage.titleInput().type(title);
      TodoPage.addButton().click();
      return title;
    },
    firstTodoItem: () => TodoPage.todoListItems().first(),
    toggleCompletedFirstTodo: () => cy.get('[data-testid="todoItem"]').click(),
    firstRemoveButton: () => cy.get('[data-testid="btnDeleteTodo"]'),
  };

  beforeEach(() => {
    TodoPage.visit();
  });
  afterEach(() => {
    TodoPage.clear();
  });

  it('page loads properly', () => {
    // act
    TodoPage.visit();
  });

  it('creates a new todo', () => {
    // act
    const createdTitle = TodoPage.createTodo(getUniqueTitle());

    // assert
    TodoPage.todoList().should('have.length', 1);
    TodoPage.todoList().contains(createdTitle);
  });

  it('input field empties after todo is submitted', () => {
    // act
    TodoPage.createTodo(getUniqueTitle());

    // assert
    TodoPage.titleInput().should('have.value', '');
  });

  it('creates a few new todos', () => {
    // act
    TodoPage.createTodo(getUniqueTitle());
    TodoPage.createTodo(getUniqueTitle());
    TodoPage.createTodo(getUniqueTitle());

    // assert
    TodoPage.todoListItems().should('have.length', 3);
  });

  it('completes a todo', () => {
    // arrange
    TodoPage.createTodo(getUniqueTitle());

    // act
    TodoPage.firstTodoItem().should('not.have.class', 'todo__item--completed');

    TodoPage.toggleCompletedFirstTodo();
    TodoPage.firstTodoItem().should('have.class', 'todo__item--completed');
  });

  it('uncompletes a todo', () => {
    // arrange
    TodoPage.createTodo(getUniqueTitle());

    // act
    TodoPage.toggleCompletedFirstTodo();
    TodoPage.toggleCompletedFirstTodo();
    TodoPage.firstTodoItem().should('not.have.class', 'todo__item--completed');
  });

  it('completed items has remove button', () => {
    // arrange
    TodoPage.createTodo(getUniqueTitle());

    TodoPage.firstRemoveButton().should('not.exist');
    TodoPage.toggleCompletedFirstTodo();
    TodoPage.firstRemoveButton().should('exist');
  });

  it('remove todo removes the todo from the list', () => {
    // arrange
    TodoPage.createTodo(getUniqueTitle());

    TodoPage.todoListItems().should('have.length', 1);

    TodoPage.toggleCompletedFirstTodo();
    TodoPage.firstRemoveButton().click();
    TodoPage.todoListItems().should('have.length', 0);
  });

  it('removes the correct todo', () => {
    // arrange
    TodoPage.createTodo(getUniqueTitle());
    const titleToRemove = TodoPage.createTodo('The one we want to remove');
    TodoPage.createTodo(getUniqueTitle());

    const el = TodoPage.todoListItems().contains(titleToRemove);
    el.click();
    el.get('[data-testid="btnDeleteTodo"]').click();
  });
});
