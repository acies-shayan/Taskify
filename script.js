document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#new-task");
  const addBtn = document.querySelector("#add-task");
  const list = document.querySelector("#task-list");
  const searchInput = document.querySelector("#search");

  const sortNameBtn = document.querySelector("#sort-name");
  const sortStatusBtn = document.querySelector("#sort-status");
  const markAllBtn = document.querySelector("#mark-all");
  const clearCompletedBtn = document.querySelector("#clear-completed");
  const clearAllBtn = document.querySelector("#clear-all");

  // --- Toast notification ---
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  // --- Local storage helpers ---
  function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  function setTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // --- Update task counter ---
  function updateCount() {
    const tasks = getTasks();
    const remaining = tasks.filter(t => !t.completed).length;
    document.getElementById("task-count").textContent =
      `${remaining} task(s) remaining`;
  }

  // --- Update progress bar ---
  function updateProgress() {
    const tasks = getTasks();
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percent = total ? (completed / total) * 100 : 0;

    const bar = document.getElementById("progress-bar");
    bar.style.width = percent + "%";

    if (percent < 40) bar.style.background = "red";
    else if (percent < 80) bar.style.background = "orange";
    else bar.style.background = "green";
  }

  // --- Create task element ---
  function createTaskItem(task, index) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) li.classList.add("completed");

    // --- Double-click to edit ---
    span.addEventListener("dblclick", () => {
      const edit = document.createElement("input");
      edit.value = span.textContent;
      li.replaceChild(edit, span);
      edit.focus();

      edit.addEventListener("blur", () => {
        const tasks = getTasks();
        tasks[index].text = edit.value.trim() || tasks[index].text;
        setTasks(tasks);
        loadTasks();
        showToast("Task edited ✏️");
      });
    });

    // --- Delete button ---
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent row click toggle
      const tasks = getTasks();
      tasks.splice(index, 1);
      setTasks(tasks);
      loadTasks();
      showToast("Task deleted 🗑️");
    });

    li.append(checkbox, span, del);

    // --- Toggle checkbox when clicking anywhere on li ---
    li.addEventListener("click", (e) => {
      if (e.target !== del && e.target !== checkbox) { // ignore delete & checkbox
        checkbox.checked = !checkbox.checked;
        li.classList.toggle("completed", checkbox.checked);

        const tasks = getTasks();
        tasks[index].completed = checkbox.checked;
        setTasks(tasks);

        updateProgress();
        updateCount();
      }
    });

    // --- Update on manual checkbox change ---
    checkbox.addEventListener("change", () => {
      li.classList.toggle("completed", checkbox.checked);
      const tasks = getTasks();
      tasks[index].completed = checkbox.checked;
      setTasks(tasks);
      updateProgress();
      updateCount();
    });

    return li;
  }

  // --- Load tasks ---
  function loadTasks(filter = "") {
    list.innerHTML = "";
    const tasks = getTasks();

    tasks
      .filter(t => t.text.toLowerCase().includes(filter.toLowerCase()))
      .forEach((t, i) => list.appendChild(createTaskItem(t, i)));

    updateCount();
    updateProgress();
  }

  // --- Add new task ---
  addBtn.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) return;

    const tasks = getTasks();

    if (tasks.some(t => t.text.toLowerCase() === value.toLowerCase())) {
      showToast("Task exists ❗");
      return;
    }

    tasks.push({ text: value, completed: false });
    setTasks(tasks);
    loadTasks();

    input.value = "";
    showToast("Task added ✅");
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") addBtn.click();
  });

  // --- Search ---
  searchInput.addEventListener("input", () => {
    loadTasks(searchInput.value);
  });

  // --- Sorting ---
  sortNameBtn.addEventListener("click", () => {
    const tasks = getTasks();
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    setTasks(tasks);
    loadTasks();
    showToast("Sorted A–Z 🔤");
  });

  sortStatusBtn.addEventListener("click", () => {
    const tasks = getTasks();
    tasks.sort((a, b) => a.completed - b.completed);
    setTasks(tasks);
    loadTasks();
    showToast("Sorted by status 📌");
  });

  // --- Mark all completed ---
  markAllBtn.addEventListener("click", () => {
    const tasks = getTasks();
    tasks.forEach(t => t.completed = true);
    setTasks(tasks);
    loadTasks();
    showToast("All completed ✅");
  });

  // --- Clear completed ---
  clearCompletedBtn.addEventListener("click", () => {
    let tasks = getTasks().filter(t => !t.completed);
    setTasks(tasks);
    loadTasks();
    showToast("Completed cleared ❌");
  });

  // --- Clear all tasks ---
  clearAllBtn.addEventListener("click", () => {
    if (!confirm("Delete all tasks?")) return;
    localStorage.removeItem("tasks");
    loadTasks();
    showToast("All tasks cleared 🧹");
  });

  // --- Initial load ---
  loadTasks();
});