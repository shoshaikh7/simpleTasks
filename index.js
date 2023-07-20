// Get all HTML elements
const greeting = document.querySelector(".greeting");
const categoriesWrapper = document.querySelector(".categories-wrapper");
const savedCategories = document.querySelector(".saved-categories");
const newCategoryView = document.querySelector(".new-category");
const newCategoryBtn = document.querySelector("#new-category-btn");
const addCategoryBtn = document.querySelector("#add-category-btn");
const delCategoryBtn = document.querySelector("#del-category-btn");
const categoryInput = document.querySelector("#category-input");
const categoryColors = document.querySelector(".category-colors");
const newTaskBtn = document.querySelector("#new-task-btn");
// Global tasks and categories variable
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const categories = JSON.parse(localStorage.getItem("categories")) || [];
// Grab username from local storage or set to empty
const username = localStorage.getItem("username" || "");
const nameInput = document.querySelector("#name");

// Initialize app
const init = () => {
  console.log("called init");
  // Add event listeners to all buttons
  nameInput.addEventListener("blur", updateGreeting);
  newCategoryBtn.addEventListener("click", showCategoryForm);
  addCategoryBtn.addEventListener("click", addNewCategory);
  delCategoryBtn.addEventListener("click", deleteCategory);
  newTaskBtn.addEventListener("click", addNewTask);
};

const updateGreeting = () => {
  console.log("called updateGreeting");
  if (username !== null) {
    greeting.firstElementChild.textContent = `Hello, ${username}!`
  } else {
    greeting.firstElementChild.textContent = `Hello, ${nameInput.value}!`
  }
};

const showCategoryForm = () => {
  console.log("called showCategoryForm");
  // Show category input and colors
  if (newCategoryView.style.display === "none") {
    newCategoryView.style.display = "block";
    addCategoryBtn.style.display = "block";
    delCategoryBtn.style.display = "block";
    newCategoryBtn.style.display = "none";
    newTaskBtn.style.display = "none";
  }
};

const hideCategoryForm = () => {
  console.log("called hideCategoryForm");
  newCategoryView.style.display = "none";
  addCategoryBtn.style.display = "none";
  delCategoryBtn.style.display = "none";
  newCategoryBtn.style.display = "block";
  newTaskBtn.style.display = "block";
};

const addNewCategory = () => {
  console.log("called addNewCategory");
  // Get selected color value and checked input radio
  let { selectedColorVal, checkedColorInput } = getSelectedColor();
  let catValue = categoryInput.value;
  let existingCat = false;
  // Check if catValue !== already existing cat value
  for (const category of categories) {
    if (catValue === category.content) {
      existingCat = true;
      console.log(existingCat);
    }
  }
  // Create a new category item
  const categoryItem = {
    id: Math.random() * 1000,
    content: "",
    color: "",
    createdAt: new Date().getTime(),
  };
  // Check to see if input value is empty
  if (catValue === "" || existingCat) {
    alert("Please enter a unique name for your category");
    showCategoryForm();
  } else {
    categoryItem.content = catValue;
  }
  // Check to see if color value is empty
  if (selectedColorVal === "") {
    alert("Please select a color for your category");
    showCategoryForm();
  } else {
    categoryItem.color = selectedColorVal;
  }
  // If everything is okay, do this
  if (categoryItem.content !== "" && categoryItem.color !== "") {
    // Uncheck, disable, and hide used color
    let color = checkedColorInput[0];
    color.checked = false;
    color.disabled = true;
    if (color.disabled) {
      color.parentElement.style.display = "none";
    }
    // Add the item to the front of the categories array
    categories.unshift(categoryItem);
    // Pass categoryItem to createCategoryElements to create HTML and store in catElements
    const catElements = createCategoryElements(categoryItem);
    // Append catElements to savedCategories
    savedCategories.append(catElements);
    // Hide newCategoryForm
    hideCategoryForm();
    // Check if categories reached max limit of 5
    if (categories.length >= 5) {
      delCategoryBtn.style.display = "block";
      newCategoryBtn.style.display = "none";
    }
    //  Reset input value once collected and saved
    categoryInput.value = "";
  }
};

const getSelectedColor = () => {
  console.log("calledGetSelectedColor");
  let selectedColorVal = "";
  const colorOptions = categoryColors.querySelectorAll("input");
  const checkedColorInput = Array.from(colorOptions).filter((color) => {
    if (color.checked) {
      selectedColorVal = color.value;
      return color;
    }
  });
  return { selectedColorVal, checkedColorInput };
}

const createCategoryElements = (categoryItem) => {
  console.log("called createCategoryElements");
  // Create HTML elements, add classes and attributes for each category item
  let catContent = categoryItem.content;
  let catColor = categoryItem.color;
  const catLabel = document.createElement("label");
  catLabel.setAttribute("for", catContent);

  const catCheckboxBubble = document.createElement("input");
  catCheckboxBubble.type = "radio";
  catCheckboxBubble.setAttribute("name", "category");
  catCheckboxBubble.setAttribute("class", catColor);
  catCheckboxBubble.setAttribute("id", catContent);
  catCheckboxBubble.value = catContent;

  const catBubble = document.createElement("span");
  catBubble.setAttribute("class", "bubble " + catColor);

  const catName = document.createElement("p");
  catName.classList.add("category-name");
  catName.textContent = catContent;
  // Append everything to the catLabel
  catLabel.append(catCheckboxBubble, catBubble, catName);
  return catLabel;
};

const deleteCategory = () => {
  console.log("called deleteCategory");
  // Store checked input inside selectedCat
  let cats = savedCategories.getElementsByTagName("input");
  let selectedCat = "";
  for (let i = 0; i < cats.length; i++) {
    let cat = cats[i];
    if (cat.checked) {
      selectedCat = cat;
    }
  }
  // Check if cat is selected
  if (selectedCat === "") {
    alert("Please select an existing category to delete");
  } else {
    let confirmed = confirm(
      `This will remove ${selectedCat.id} and all tasks associated with it. Are you sure you want to delete this category?`
    );
    if (confirmed) {
      selectedCat.parentElement.remove();
      // Check to see which category item has the same id as the selectedCatId
      for (let i = categories.length - 1; i >= 0; --i) {
        if (categories[i].content === selectedCat.id) {
          categories.splice(i, 1);
        }
      }
      // Add category color back into options
      const colorOptions = categoryColors.querySelectorAll("input");
      for (let i = 0; i < colorOptions.length; i++) {
        let color = colorOptions[i];
        console.log(color.id, selectedCat.className);
        if (color.id.trim() === selectedCat.className.trim()) {
          console.log("match")
          console.log(color);
          color.parentElement.style.display = "flex";
          color.disabled = false;
        }
      }
    }
  }
};

const addNewTask = () => {
  // Create a new task item
  const taskItem = {
    id: Math.random() * 1000,
    content: "",
    category: "",
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
  taskContent.setAttribute("disabled", "");

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

  task.innerHTML = `<input type="text" value="${todo.task}" disabled />`;
};

// Grab saved data from local storage if there is any
// window.addEventListener("load", () => {
//   // Get input value and set it to username in local storage
//   // nameInput.value = username;
//   // nameInput.addEventListener("change", (e) => {
//   //   localStorage.setItem("username", e.target.value);
//   // });

//   // Add new todo
//   newToDoForm.addEventListener("submit", (e) => {
//     // Stop default action from submit button
//     e.preventDefault();

//     // Create todo object, get values from input in form and set to each property
//     const todo = {
//       task: e.target.elements.task.value,
//       category: e.target.elements.category.value,
//       done: false,
//       createdAt: new Date().getTime(),
//     };

//     // Add each todo to the todos array
//     todos.push(todo);

//     // Convert todos array into JSON and save to local storage variable called todos
//     localStorage.setItem("todos", JSON.stringify(todos));

//     // Reset form
//     e.target.reset();

//     // Create todos
//     createTodos();

//     // Check if todos are done
//     // checkTodos();
//   });
//   createTodos();
// });

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
