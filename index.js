// Get all HTML elements
const nameInput = document.querySelector("#name");
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
const taskInput = document.querySelector("#new-task #content");
const noTasksMsg = document.querySelector("#no-tasks-msg");
const taskList = document.querySelector("#task-list");
const taskEls = taskList.children;
const catTabs = document.querySelector(".cat-tabs");
const catTabEls = catTabs.children;
const filters = document.querySelector(".task-view-filters").children;
const viewAllFilter = document.querySelector("#view-all");
const viewActiveFilter = document.querySelector("#view-active");
const viewCompletedFilter = document.querySelector("#view-completed");
const delCompletedTaskBtn = document.querySelector("#del-completed");
// Global tasks, categories, and username
let tasks = [];
let categories = [];
let username = "";

// Initialize app
const init = () => {
  // console.log("called init");
  // Load data from localStorage
  load();
  // Update greeting
  updateGreeting();
  // Show no task message if no tasks are available
  if (tasks) {
    noTasksMsg.style.display = "none";
  }
  // Check if categories reached max limit of 5
  if (categories.length >= 5) {
    delCategoryBtn.style.display = "block";
    newCategoryBtn.style.display = "none";
  }
  // Prepend loaded data to dom
  for (let i = 0; i < tasks.length; i++) {
    const taskItem = tasks[i];
    // Pass taskItem to createTaskElements to create HTML and store in taskElements
    const taskElements = createTaskElements(taskItem);
    // Append taskElements to taskList
    if (tasks[i].category.isActive) {
      taskList.append(taskElements);
    }
  }
  const catColors = document.querySelectorAll(".category-colors input");
  for (let i = 0; i < categories.length; i++) {
    const categoryItem = categories[i];
    categoryItem.isActive = true;
    // Pass categoryItem to createCategoryElements to create HTML and store in catElements
    const {catLabel, catTab} = createCategoryElements(categoryItem);
    // Prepend catLabel to savedCategories
    savedCategories.prepend(catLabel);
    // Prepend catTab to catTabs under task lists
    catTabs.prepend(catTab);
    // Uncheck, disable, and hide used color
    let color = categories[i].color;
    for (let i = 0; i < catColors.length; i++) {
      let selectedColor = catColors[i];
      if (color === selectedColor.id) {
        selectedColor.checked = false;
        selectedColor.disabled = true;
        selectedColor.parentElement.style.display = "none";
      }
    }
  }
  // Add event listeners to all buttons
  nameInput.addEventListener("blur", updateGreeting);
  newCategoryBtn.addEventListener("click", showCategoryForm);
  addCategoryBtn.addEventListener("click", addNewCategory);
  delCategoryBtn.addEventListener("click", deleteCategory);
  newTaskBtn.addEventListener("click", addNewTask);
  viewAllFilter.addEventListener("click", viewAllTasks);
  viewActiveFilter.addEventListener("click", viewActiveTasks);
  viewCompletedFilter.addEventListener("click", viewCompletedTasks);
  delCompletedTaskBtn.addEventListener("click", delCompletedTasks);
};

const updateGreeting = () => {
  // console.log("called updateGreeting");
  if (username !== "") {
    greeting.firstElementChild.textContent = `Hello, ${username}!`;
    save();
  } else {
    username = nameInput.value;
    greeting.firstElementChild.textContent = `Hello, ${nameInput.value}!`;
    // Save to localStorage
    save();
  }
};

const showCategoryForm = () => {
  // console.log("called showCategoryForm");
  if (newCategoryView.style.display === "none") {
    newCategoryView.style.display = "block";
    addCategoryBtn.style.display = "block";
    delCategoryBtn.style.display = "block";
    newCategoryBtn.style.display = "none";
    newTaskBtn.style.display = "none";
  }
};

const hideCategoryForm = () => {
  // console.log("called hideCategoryForm");
  newCategoryView.style.display = "none";
  addCategoryBtn.style.display = "none";
  delCategoryBtn.style.display = "none";
  newCategoryBtn.style.display = "block";
  newTaskBtn.style.display = "block";
};

const getSelectedColor = () => {
  // console.log("called getSelectedColor");
  const colorOptions = categoryColors.querySelectorAll("input");
  return Array.from(colorOptions).filter((color) => {
    if (color.checked) {
      return color;
    }
  });
};

const addNewCategory = () => {
  // console.log("called addNewCategory");
  // Create a new category item
  const categoryItem = {
    id: Math.floor(Math.random() * 1000),
    content: "",
    color: "",
    isActive: true,
    createdAt: new Date().getTime(),
  };
  // Get selected color input and value
  let selectedColorInput = getSelectedColor();
  let selectedColorVal =
    selectedColorInput.length > 0 ? selectedColorInput[0].id : "";
  // Check to see if color value is empty
  if (selectedColorVal === "") {
    alert("Please select a color for your category");
    showCategoryForm();
  } else {
    categoryItem.color = selectedColorVal;
  }
  // Get category input value
  let catValue = categoryInput.value;
  // Check if catValue already exists in categories array
  let existingCat = false;
  for (const category of categories) {
    if (catValue === category.content) {
      existingCat = true;
    }
  }
  // Check to see if input value is empty
  if (catValue === "" || existingCat) {
    alert("Please enter a unique name for your category");
    showCategoryForm();
  } else {
    categoryItem.content = catValue;
  }
  // If all inputs are valid, do this
  if (categoryItem.content !== "" && categoryItem.color !== "") {
    // Uncheck, disable, and hide used color
    let color = selectedColorInput[0];
    color.checked = false;
    color.disabled = true;
    color.parentElement.style.display = "none";
    // Add the item to the front of the categories array
    categories.unshift(categoryItem);
    // Pass categoryItem to createCategoryElements to create HTML and store in catElements
    const {catLabel, catTab} = createCategoryElements(categoryItem);
    // Append catLabel to savedCategories
    savedCategories.append(catLabel);
    // Append catTab to catTabs under task lists
    catTabs.append(catTab);
    // Hide newCategoryForm
    hideCategoryForm();
    // Check if categories reached max limit of 5
    if (categories.length >= 5) {
      delCategoryBtn.style.display = "block";
      newCategoryBtn.style.display = "none";
    }
    //  Reset input value
    categoryInput.value = "";
    // Save to localStorage
    save();
  }
};

const createCategoryElements = (categoryItem) => {
  // console.log("called createCategoryElements");
  let catName = categoryItem.content;
  let catColor = categoryItem.color;
  // Create HTML elements, add classes and attributes for each category item
  const catLabel = document.createElement("label");
  catLabel.setAttribute("for", catName);

  const catRadio = document.createElement("input");
  catRadio.type = "radio";
  catRadio.setAttribute("name", "category");
  catRadio.setAttribute("class", catColor);
  catRadio.setAttribute("id", catName);
  catRadio.value = catName;

  const catBubble = document.createElement("span");
  catBubble.setAttribute("class", "bubble " + catColor);

  const catNameEl = document.createElement("p");
  catNameEl.classList.add("category-name");
  catNameEl.textContent = catName;
  // Append everything to the catLabel
  catLabel.append(catRadio, catBubble, catNameEl);

  // Create HTML elements, add classes and attributes for each category tab
  const catTab = document.createElement("p");
  catTab.classList.add("cat-tab", "active");
  if (!categoryItem.isActive) {
    catTab.classList.remove("active");
  }
  catTab.setAttribute("id", catName);
  catTab.textContent = catName;
  catTab.style.color = catColor;
  catTab.style.borderColor = catColor;
  // Check which category tab is active and show tasks associated with that category
  catTab.addEventListener("click", (e) => {
    toggleActiveTab(e);
  });
  catTab.addEventListener("mouseover", () => {
    catTab.style.boxShadow = `0px 1px 3px ${catColor}`;
  });
  catTab.addEventListener("mouseout", () => {
    catTab.style.boxShadow = "none";
  });
  // Save to localStorage
  save();
  return {catLabel, catTab};
};

const deleteCategory = () => {
  // console.log("called deleteCategory");
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
      `This will remove the "${selectedCat.id}" category and all tasks associated with it. Are you sure you want to delete this category?`
    );
    if (confirmed) {
      // Remove selectedCat element from dom
      selectedCat.parentElement.remove();
      // Remove category item from categories array that has the same id as the selectedCat
      for (let i = categories.length - 1; i >= 0; --i) {
        if (categories[i].content === selectedCat.id) {
          categories.splice(i, 1);
        }
      }
      // Remove catTab associated with this category
      for (let i = 0; i < catTabEls.length; i++) {
        if (catTabEls[i].id === selectedCat.id) {
          catTabEls[i].remove();
        }
      }
      // Remove any task elements associated with this category
      for (let i = 0; i < taskEls.length; i++) {
        if (taskEls[i].classList.contains(selectedCat.id)) {
          taskEls[i].remove();
          i--;
        }
      }
      // Remove any task items from tasks array associated with this category
      for (let i = tasks.length - 1; i >= 0; i--) {
        // Find task.content in tasks array that matches selectedTask
        if (tasks[i].category.content === selectedCat.id) {
          // Remove from tasks array
          tasks.splice(i, 1);
        }
      }
      // Add category color back into options
      const colorOptions = categoryColors.querySelectorAll("input");
      for (let i = 0; i < colorOptions.length; i++) {
        let color = colorOptions[i];
        if (color.id.trim() === selectedCat.className.trim()) {
          color.parentElement.style.display = "flex";
          color.disabled = false;
        }
      }
      // Check if categories reached max limit of 5
      if (categories.length < 5) {
        delCategoryBtn.style.display = "none";
        newCategoryBtn.style.display = "block";
      }
      // Save to localStorage
      save();
    }
  }
};

const getSelectedCategory = () => {
  // console.log("called getSelectedCategory");
  const catOptions = savedCategories.querySelectorAll("input");
  return Array.from(catOptions).filter((cat) => {
    if (cat.checked) {
      return cat;
    }
  });
};

const addNewTask = () => {
  // console.log("called addNewTask");
  // Create a new task item
  const taskItem = {
    id: Math.floor(Math.random() * 1000),
    content: "",
    category: "",
    completed: false,
    createdAt: new Date().getTime(),
  };
  // Get selected category input
  let selectedCatInput = getSelectedCategory();
  // If category is selected, get selected category object from categories array
  if (selectedCatInput.length === 0) {
    alert("Please selected existing category or create a new one");
  } else {
    for (const category of categories) {
      if (selectedCatInput[0].id === category.content) {
        taskItem.category = category;
      }
    }
  }
  // Get task input value
  let taskInputVal = taskInput.value;
  // Check to see if task input value is empty
  if (taskInputVal === "") {
    alert("Please enter a new task to add");
  } else {
    taskItem.content = taskInputVal;
  }
  // If all inputs are valid, do this
  if (taskItem.content !== "" && taskItem.category !== "") {
    // Add the item to the front of the tasks array
    tasks.unshift(taskItem);
    // Hide no task message if no tasks are available
    if (!tasks) {
      noTasksMsg.style.display = "none";
    }
    // Show task filters
    document.querySelector(".task-filters").style.display = "flex";
    // Pass taskItem to createTaskElements to create HTML and store in taskElements
    const taskElements = createTaskElements(taskItem);
    // Append taskElements to taskList
    taskList.prepend(taskElements);
    // Reset input value
    taskInput.value = "";
    // Save to localStorage
    save();
  }
};

const createTaskElements = (taskItem) => {
  // console.log("called createTaskElements");
  let taskContent = taskItem.content;
  let taskCompleted = taskItem.completed;
  let taskCatColor = taskItem.category.color;
  let taskCatName = taskItem.category.content;
  // Create HTML elements, add classes and attributes for each task item
  const taskItemEl = document.createElement("div");
  taskItemEl.setAttribute("class", "task-item " + taskCatName);

  const taskLabel = document.createElement("label");

  const taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.setAttribute("name", taskCatName);
  taskCheckbox.setAttribute("class", taskCatColor);
  taskCheckbox.checked = taskCompleted;
  if (taskCompleted) {
    taskItemEl.classList.add("done");
  }
  taskCheckbox.addEventListener("change", (e) => {
    const activeFilter = getFilter();
    taskCompleted = e.target.checked;
    // Show all active tasks have their associated catTab active
    if (taskCompleted) {
      taskItemEl.classList.add("done");
      taskItem.completed = true;
      // Check if all tasks are completed or not
      let noActiveTasks = tasks.every((task) => {
        return task.completed;
      });
      if (activeFilter.id === "view-active") {
        // Hide completed task if in view-active filter
        taskItemEl.style.display = "none";
        // Display noTaskMsg if no active tasks available
        if (noActiveTasks) {
          noTasksMsg.style.display = "block";
        }
      }
      save();
    } else {
      taskItemEl.classList.remove("done");
      taskItem.completed = false;
      let noCompletedTasks = tasks.every((task) => {
        return !task.completed;
      });
      if (activeFilter.id === "view-completed") {
        // Hide completed task if in view-completed filter
        taskItemEl.style.display = "none";
        // Display noTaskMsg if no completed tasks available
        if (noCompletedTasks) {
          noTasksMsg.style.display = "block";
        }
      }
      save();
    }
  });

  const taskBubble = document.createElement("span");
  taskBubble.setAttribute("class", "bubble " + taskCatColor);

  const taskContentEl = document.createElement("input");
  taskContentEl.classList.add("task-content");
  taskContentEl.type = "text";
  taskContentEl.value = taskContent;
  taskContentEl.setAttribute("disabled", "");
  // Update task after clicking out of input field
  let oldTask = "";
  taskContentEl.addEventListener("blur", (e) => {
    const selectedTask = e.target;
    for (const task of tasks) {
      if (task.content === oldTask) {
        task.content = selectedTask.value;
      }
    }
    selectedTask.setAttribute("disabled", "");
    save();
  });

  const taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  const editBtn = document.createElement("span");
  editBtn.classList.add("edit-btn", "material-symbols-outlined");
  editBtn.textContent = "edit";
  editBtn.addEventListener("click", (e) => {
    // Look away, idk what I'm doing
    const selectedTask = e.target.parentElement.parentElement.children[1];
    selectedTask.removeAttribute("disabled");
    selectedTask.focus();
    oldTask = selectedTask.value;
  });

  const deleteBtn = document.createElement("span");
  deleteBtn.classList.add("delete-btn", "material-symbols-outlined");
  deleteBtn.textContent = "delete";
  deleteBtn.addEventListener("click", (e) => {
    deleteTask(e);
  });

  taskLabel.append(taskCheckbox, taskBubble);
  taskActions.append(editBtn, deleteBtn);
  taskItemEl.append(taskLabel, taskContentEl, taskActions);
  // Save to localStorage
  save();
  return taskItemEl;
};

const deleteTask = (e) => {
  // Get selected task
  const selectedTask = e.target.parentElement.parentElement.children[1];
  for (let i = tasks.length - 1; i >= 0; i--) {
    // Find selectedTask that matches task.content in tasks array
    if (tasks[i].content === selectedTask.value) {
      // Remove from dom
      e.target.parentElement.parentElement.remove();
      // Remove from tasks array
      tasks.splice(i, 1);
      // Save
      save();
    }
  }
};

const getFilter = () => {
  for (const filter of filters) {
    if (filter.classList.contains("active")) {
      return filter;
    }
  }
};

const getActiveTabs = () => {
  const activeTabs = [];
  for (const tab of catTabEls) {
    if (tab.classList.contains("active")) {
      activeTabs.push(tab.id);
    }
  }
  return activeTabs;
};

const isActive = (e) => {
  e.target.classList.add("active");
};

const notActive = (e) => {
  e.target.classList.remove("active");
};

const toggleActiveTab = (e) => {
  // console.log("called toggleActiveTab");
  const selectedTab = e.target;
  // Get activeFilter
  const activeFilter = getFilter();
  // Hide all tasks
  if (selectedTab.classList.contains("active")) {
    // Hide tab
    notActive(e);
    // Set isActive to false for category in categories array
    for (const category of categories) {
      if (category.content === selectedTab.id) {
        category.isActive = false;
        save();
      }
    }
    // Hide all tasks under the selectedTab
    for (const task of taskEls) {
      let catName = task.classList[1];
      if (catName === selectedTab.id) {
        task.style.display = "none";
      }
    }
    // If deactivating tab makes it so there are no tasks in view, show noTaskMessage
    let noTasksInView = Array.from(taskEls).every((task) => {
      return task.style.display === "none" ? true : false;
    });
    if (noTasksInView) {
      noTasksMsg.style.display = "block";
    }
  } else {
    isActive(e);
    // Set isActive to true for category in categories array
    for (const category of categories) {
      if (category.content === selectedTab.id) {
        category.isActive = true;
        save();
      }
    }
    // Show all tasks under the selectedTab
    for (const task of taskEls) {
      let catName = task.classList[1];
      if (catName === selectedTab.id) {
        if (activeFilter.id === "view-active") {
          if (!task.classList.contains("done")) {
            task.style.display = "flex";
          }
        } else if (activeFilter.id === "view-completed") {
          if (task.classList.contains("done")) {
            task.style.display = "flex";
          }
        } else {
          task.style.display = "flex";
        }
      }
    }
    // If activating tab makes it so there are new tasks in view, hide noTaskMessage
    let tasksInView = Array.from(taskEls).every((task) => {
      console.log(task ,task.style.display);
      return task.style.display === "flex" ? true : false;
    });
    // console.log(tasksInView);
    if (!tasksInView) {
      noTasksMsg.style.display = "none";
    }
  }
};

const hideAllTasks = () => {
  let counter = 0;
  for (const task of taskEls) {
    task.style.display = "none";
    counter++;
    // if (counter !== taskEls.length) {
    //   noTasksMsg.style.display = "none";
    // } else {
    //   noTasksMsg.style.display = "block";
    // }
    // console.log(counter);
  }
  counter = 0;
  // console.log(taskEls.length);
};

const viewAllTasks = (e) => {
  // console.log("called viewAllTasks");
  // Remove active class from other siblings
  e.target.nextElementSibling.classList.remove("active");
  e.target.nextElementSibling.nextElementSibling.classList.remove("active");
  // Add active class to All btn
  isActive(e);
  // Get activeTabs
  const activeTabs = getActiveTabs();
  // Hide all tasks
  hideAllTasks();
  // Show all tasks have their associated catTab active
  for (const task of taskEls) {
    let catName = task.classList[1];
    for (const activeTab of activeTabs) {
      if (activeTab === catName) {
        task.style.display = "flex";
      }
      // task.style.display = "none";
    }
  }
};

const viewActiveTasks = (e) => {
  // console.log("called viewActiveTasks");
  // Remove active class from other siblings
  e.target.previousElementSibling.classList.remove("active");
  e.target.nextElementSibling.classList.remove("active");
  // Add active class to Active btn
  isActive(e);
  // Get activeTabs
  const activeTabs = getActiveTabs();
  // Hide all tasks
  hideAllTasks();
  let hiddenTaskCounter = 0;
  noTasksMsg.style.display = "none";
  // Show all active tasks have their associated catTab active
  for (const task of taskEls) {
    let catName = task.classList[1];
    for (const activeTab of activeTabs) {
      if (activeTab === catName && !task.classList.contains("done")) {
        task.style.display = "flex";
      }
    }
    // Display noTaskMsg if no completed tasks available
    if (task.style.display === "none") {
      hiddenTaskCounter++;
      if (hiddenTaskCounter === taskEls.length) {
        noTasksMsg.style.display = "block";
      }
    }
  }
};

const viewCompletedTasks = (e) => {
  // console.log("called viewCompletedTasks");
  // Remove active class from other siblings
  e.target.previousElementSibling.classList.remove("active");
  e.target.previousElementSibling.previousElementSibling.classList.remove(
    "active"
  );
  // Add active class to Completed btn
  isActive(e); // Get activeTabs
  const activeTabs = getActiveTabs();
  // Hide all tasks
  hideAllTasks();
  let hiddenTaskCounter = 0;
  noTasksMsg.style.display = "none";
  // Show all active tasks have their associated catTab active
  for (const task of taskEls) {
    let catName = task.classList[1];
    for (const activeTab of activeTabs) {
      if (activeTab === catName && task.classList.contains("done")) {
        task.style.display = "flex";
      }
    }
    // Display noTaskMsg if no completed tasks available
    if (task.style.display === "none") {
      hiddenTaskCounter++;
      if (hiddenTaskCounter === taskEls.length) {
        noTasksMsg.style.display = "block";
      }
    }
  }
};

const delCompletedTasks = () => {
  // console.log("called delCompletedTasks");
  // Get all tasks inside tasks array where completed = true
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].completed === true) {
      console.log(tasks[i], tasks[i].category.content);
      // Remove from tasks array
      tasks.splice(i, 1);
      // Save
      save();
    }
  }
  // Get all tasks inside task-list element where child has class done
  for (let i = 0; i < taskEls.length; i++) {
    if (taskEls[i].classList.contains("done")) {
      taskEls[i].remove();
      i--;
    }
  }
};

const save = () => {
  // console.log("called save");
  const taskData = JSON.stringify(tasks);
  const categoriesData = JSON.stringify(categories);
  const usernameData = JSON.stringify(username);

  localStorage.setItem("my_tasks", taskData);
  localStorage.setItem("my_categories", categoriesData);
  localStorage.setItem("my_username", usernameData);
};

const load = () => {
  // console.log("called load");
  const taskData = localStorage.getItem("my_tasks");
  const categoriesData = localStorage.getItem("my_categories");
  const usernameData = localStorage.getItem("my_username");

  if (taskData) {
    tasks = JSON.parse(taskData);
  }

  if (categoriesData) {
    categories = JSON.parse(categoriesData);
  }

  if (usernameData) {
    username = JSON.parse(usernameData);
  }
};

window.addEventListener("load", init());

// THINGS TODO
// when selecting tab filter, set window where task list is on top?
// fix tab filters so only one is active when page is loaded
// fix tab filters so you see only tasks with the category you're adding the task to?
// Add logo, restyle headings and greetings
// drag and drop todo?
// add functionality to filter tasks by crated at: tasks.sort(...)
// update to show date and time todo was created?
// add dark mode
