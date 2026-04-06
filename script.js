// script.js

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#new-task");
  const addBtn = document.querySelector("#add-task");
  const list = document.querySelector("#task-list");

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
      list.appendChild(createTaskItem(task));
    });
  }

  function saveTasks() {
    const tasks = Array.from(list.children).map(li => li.querySelector("span").textContent);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function createTaskItem(text) {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = text;
    li.appendChild(label);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.type = "button";
    delBtn.addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    li.appendChild(delBtn);
    return li;
  }

  loadTasks();

  addBtn.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) return;

    list.appendChild(createTaskItem(value));
    saveTasks();
    input.value = "";
    input.focus();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addBtn.click();
    }
  });
});
