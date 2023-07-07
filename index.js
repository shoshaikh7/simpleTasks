// Initialize app
const init = () => {
  // Global tasks variable
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // Grab username from local storage or set to empty
  const username = localStorage.getItem("username" || "");
  const nameInput = document.querySelector("#name");
  // Grab all HTML elements
  const newTaskForm = document.querySelector("#new-task-form");
  const newTaskBtn = document.querySelector("#new-task-btn");
  // Create new todo
  newTaskBtn.addEventListener("click", addNewTask);
};

const addNewTask = (e) => {
  // Prevent default action on form
  e.preventDefault();
  // Create a new task item
  const taskItem = {
    id: Math.random() * 1000000,
    content: "",
    cat: "",
    completed: false,
    createdAt: new Date().getTime(),
  };
  // Add the item to the front of the tasks array
  tasks.unshift(taskItem);
  // Create and store task elements using createTaskElements()
  const taskList = document.querySelector("#task-list");
  const {itemEl, inputEl} = createTaskElements(taskItem);
};

const createTaskElements = (taskItem) => {
  // Create HTML elements, add classes and attributes for each task item
  const taskItemEl = document.createElement("div");
  taskItem.classList.add("task-item");

  const checkboxLabel = document.createElement("label");
  const checkboxInput = document.createElement("input");
  const checkboxBubble = document.createElement("span");
  span.classList.add("bubble");
  checkboxInput.type = "checkbox";
  checkboxInput.checked = taskItem.completed;

  if (taskItem.completed) {
    taskItemEl.classList.add("completed");
  }

  const taskContent = document.createElement("input");
  taskContent.classList.add("task-content");
  taskContent.type = "text";
  taskContent.value = taskItem.content;
  taskContent.setAttribute("disabled", "")

  const actions = document.createElement("div");
  actions.classList.add("actions");

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.innerHTML = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = "Delete";


  if (todo.category == "personal") {
    span.classList.add("personal");
  } else {
    span.classList.add("business");
  }
  if ()

  task.innerHTML = `<input type="text" value="${todo.task}" disabled />`;
};

// Grab saved data from local storage if there is any
window.addEventListener("load", () => {
  // Get input value and set it to username in local storage
  // nameInput.value = username;
  // nameInput.addEventListener("change", (e) => {
  //   localStorage.setItem("username", e.target.value);
  // });

  // Add new todo
  newToDoForm.addEventListener("submit", (e) => {
    // Stop default action from submit button
    e.preventDefault();

    // Create todo object, get values from input in form and set to each property
    const todo = {
      task: e.target.elements.task.value,
      category: e.target.elements.category.value,
      done: false,
      createdAt: new Date().getTime(),
    };

    // Add each todo to the todos array
    todos.push(todo);

    // Convert todos array into JSON and save to local storage variable called todos
    localStorage.setItem("todos", JSON.stringify(todos));

    // Reset form
    e.target.reset();

    // Create todos
    createTodos();

    // Check if todos are done
    // checkTodos();
  });
  createTodos();
});

// Create todos
const createTodos = () => {
  // Get todo list element
  const todoList = document.querySelector("#todo-list");

  // Clear all elements  in todo list
  todoList.innerHTML = "";

  // Loop through each todo in todos array
  todos.forEach((todo) => {
    // Create all HTML elements for each todo
    const todoItem = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const task = document.createElement("div");
    const actions = document.createElement("div");
    const editTodo = document.createElement("button");
    const deleteTodo = document.createElement("button");

    span.classList.add("bubble");
    todoItem.classList.add("todo-item");
    task.classList.add("task");
    actions.classList.add("actions");
    editTodo.classList.add("edit");
    deleteTodo.classList.add("delete");
    if (todo.category == "personal") {
      span.classList.add("personal");
    } else {
      span.classList.add("business");
    }

    input.type = "checkbox";
    input.checked = todo.done;
    task.innerHTML = `<input type="text" value="${todo.task}" disabled />`;
    editTodo.innerHTML = "Edit";
    deleteTodo.innerHTML = "Delete";

    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(editTodo);
    actions.appendChild(deleteTodo);
    todoItem.appendChild(label);
    todoItem.appendChild(task);
    todoItem.appendChild(actions);
    todoList.appendChild(todoItem);

    // Check if todo is done
    if (todo.done) {
      todoItem.classList.add("done");
    }

    input.addEventListener("click", (e) => {
      todo.done = e.target.checked;
      localStorage.setItem("todos", JSON.stringify(todos));

      if (todo.done) {
        todoItem.classList.add("done");
      } else {
        todoItem.classList.remove("done");
      }

      createTodos();
    });

    // Edit todos
    editTodo.addEventListener("click", (e) => {
      const input = task.querySelector("input");
      input.removeAttribute("disabled");
      input.focus();
      input.addEventListener("blur", (e) => {
        input.setAttribute("disabled", true);
        todo.task = e.target.value;
        localStorage.setItem("todos", JSON.stringify(todos));
        createTodos();
      });
    });

    // Delete todos
    deleteTodo.addEventListener("click", (e) => {
      todos = todos.filter((t) => t != todo);
      localStorage.setItem("todos", JSON.stringify(todos));
      createTodos();
    });
  });
};

window.addEventListener("load", init());

// const checkTodos = () => {

// }

// THINGS TODO
// restructure code to separate each functionality(add, edit, remove) to their own functions
// change/edit categories so that user can create their own category (more than two, different colors)
// add functionality to store todos in different categories and view each category separately
// add different tabs/views where user can see all/active/completed todos
// add functionality to check if todo and category exist before submitting/adding todo
// add functionality to filter todos by crated at: todos.sort(...)
// update greetings once user enters name
// update to show date and time todo was created?
// style to support desktop
// add dark mode
// update colors
