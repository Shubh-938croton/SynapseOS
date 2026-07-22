// for the theme change 


const themeButton = document.getElementById("theme-toggle");
themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "☀️ Light Mode";
  } else {
    themeButton.textContent = "🌙 Dark Mode";
  }
});




// Task Section

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();

    if(taskText === ""){
        alert("Please enter a task.");
        return;
    }

    const li = document.createElement("li");

  

   const completeBtn=document.createElement("li");

   const taskSpan = document.createElement("span");
   taskSpan.textContent=taskText;
   
   const completeBtn=document.createElement("button");
   completeBtn.textContent="✔";
   

    li.classList.add("task");

    taskList.appendChild(li);

    taskInput.value = "";

});


