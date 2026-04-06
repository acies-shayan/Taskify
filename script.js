document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#new-task");
  const addBtn = document.querySelector("#add-task");
  const list = document.querySelector("#task-list");
  
  // Matching your HTML IDs exactly
  const sortNameBtn = document.querySelector("#sort-name");
  const sortStatusBtn = document.querySelector("#sort-status");
  const markAllBtn = document.querySelector("#mark-all");

  function loadTasks() {
    list.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => list.appendChild(createTaskItem(task)));
  }

  function saveTasks() {
    const tasks = Array.from(list.children).map(li => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector("input[type='checkbox']").checked
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function createTaskItem(taskObj) {
    const li = document.createElement("li");
    
    // Create Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskObj.completed;
    checkbox.addEventListener("change", () => {
      li.classList.toggle("completed", checkbox.checked);
      saveTasks();
    });

    // Create Text Span
    const label = document.createElement("span");
    label.textContent = taskObj.text;
    if (taskObj.completed) li.classList.add("completed");

    // Create Delete Button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    li.append(checkbox, label, delBtn);
    return li;
  }

  // --- Logic for your new Buttons ---

  sortNameBtn.addEventListener("click", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  });

  sortStatusBtn.addEventListener("click", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // Shows Pending (false) before Completed (true)
    tasks.sort((a, b) => a.completed - b.completed);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  });

  markAllBtn.addEventListener("click", () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(t => t.completed = true);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  });

  // Standard Add Logic
  addBtn.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) return;
    const newTask = { text: value, completed: false };
    list.appendChild(createTaskItem(newTask));
    saveTasks();
    input.value = "";
    input.focus();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });

  loadTasks();
})