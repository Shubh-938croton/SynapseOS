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


// for the taking task 

const taskInput=document.getElementById("taskInput");
const addTaskBtn=document.getElementById("addTaskBtn");
const taskList=document.getElementById("taskList");


addTaskBtn.addEventListener("click",function(){
    alert("Button Clicked:");
});
