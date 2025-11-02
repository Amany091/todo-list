
const search = document.querySelector(" .searchtask"),
  searchBox = document.querySelector('.search-box'),
  addTaskBtn = document.querySelector(" .addtask "),
  del = document.querySelector(" .tasks .bx-trash "),
  edit = document.querySelector(" .tasks .bx-edit"),
  clearAll = document.querySelector(" .clearAll"),
  input = document.querySelector("#todo"),
  sceduleDate = document.querySelector(".scedule-date"),
  searchInput = document.querySelector(".input-search"),
  tasks_container = document.querySelector(" .tasks");
  
let tasks = [];
const getTasks = localStorage.getItem("task") || '';
if (getTasks) tasks = JSON.parse(getTasks);


function searchTaskByName() {
  searchInput.addEventListener('keyup', (e) => {
    let value = e.target.value.toLowerCase()
    let filterdata = []
    for (let i = 0; i < tasks.length; i++) { 
    let name = tasks[i].name.toLowerCase() // get the value of task name 
    if (name.includes(value)) {
      filterdata.push(tasks[i]) // push the el to filterdata
       document.querySelector('tbody').children[i].classList.add('show');
    } else {
      document.querySelector('tbody').children[i].classList.replace('show', 'hide');
      // tasks_container.innerHTML = `<p class="text-center search-box text-sm md:text-md border-1 shadow-md  " colspan=4 rowspan=2 >NOT EXIST</p>`
    }
    (value === '' ? showAllTodos() : '') // if value of input search is empty show all taks 
  }
    // console.log(filterdata);
  })
}
searchTaskByName()


class Task {
  static displayTask() {
    tasks_container.innerHTML = "";
    if (tasks.length === 0) {
      tasks_container.innerHTML = `<tr> <td class="text-center my-3 font-bold " colspan="5" > No task found </td> </tr>`;
      return;
    }
    tasks.forEach((task) => {
      let tsks = `
            <tr class="taskItem w-xs md:w-full text-center  text-xs md:text-md" value= ${task.state = task.state} " value= ${task.name} id=${task.id} >
                    <td ${task.status === 'completed' ? " decoration-2 line-through ":""} > ${task.name}  </td>
                    <td> ${task.dueDate || "no due date"} </td>
                    <td>${task.status}</td>
                    <td class="action btns d-flex "  >
                        <button class="isCompleted  btn-xs md:btn-md   " title="complete" onclick="Task.complete(${
                          task.id
                        })" >
                            <i class="bx bx-check bx-xs md:bx-md text-success rounded-sm bg-rose-100 "></i>
                        </button>
                        <button class="edit  btn-xs md:btn-md " title="edit" onclick="Task.edit(${
                          task.id
                        })" >
                            <i class="bx bx-edit-alt text-lime-400 bx-xs md:bx-md"></i>
                        </button>
                        <button class="delete btn-xs md:btn-md " title="delete" onclick="Task.delete(${
                          task.id
                        })" >
                            <i class="bx bx-trash bx-xs text-rose-600  md:bx-lg"></i>
                        </button>
                    </td>
              </tr>
            `
      tasks_container.innerHTML += tsks;
      this.saveToLacalStorage();
    });
  }
  // show alertMsg message
  static showAlertMessage(Message, alertPlace) {
    const alertMsg = document.querySelector(alertPlace);
    let alertBox = `<div class = " shadow-lg alert w-auto text-light bg-success flex justify-center align-middle" >
      <p class="font-bold"> ${Message} </p>
    </div>`;
    alertMsg.innerHTML = alertBox;
    setTimeout(() => {
      alertMsg.classList.add("show");
      setTimeout(() => {
        alertMsg.classList.remove("show");
        alertMsg.classList.add("hide");
      });
    }, 2000);
  }

  // identify task
  static create(task) {
    const generateRandomId = Math.floor(Math.random() * 5000);
    tasks.push({
      id: generateRandomId,
      completed: "false",
      name: task,
      state: "show",
      status: "pending",
      dueDate: sceduleDate.value
    });
    showAllTodos();
  }

  // complete task
  static complete(id) {
    tasks.forEach((item) => {
      if (item.id === id) {
        if (item.completed === false) {
          item.completed = true;
          item.status = "completed";
        }
       else {
          item.completed = false;
          item.status = "pending";
      }
    }
    });
    showAllTodos();
  }
// edit task with specified id
  static edit(id) {
    let todo = tasks.find((task) => task.id === id); // retrieve todo item with specified id from tasks array
    input.value = todo.name; // get value of todo 'certain task with its id ' to input
    sceduleDate.value = todo.dueDate;
    tasks = tasks.filter((todo) => todo.id !== id); // remove todo item from tasks's array
    addTaskBtn.classList.replace("bx-plus", "bx-check")
    addTaskBtn.addEventListener("click", () => {
      addTaskBtn.classList.replace("bx-check", "bx-plus")
      this.showAlertMessage("Todo Updated Successfully", ".alertMsg");
    });
  }
 
// delete task with id
static delete(id) {
  tasks = tasks.filter((item) => item.id !== id);
    tasks.forEach((item, index) => {
      if (item.id === id) {
        if (index !== -1) {
          tasks.splice(index, 1); // splice method changes the contents of an array by removing or replacing existing elements
        }  
      }
    });
    showAllTodos();
  }
  
  //   save tasks to localStorage
static saveToLacalStorage() {
    localStorage.setItem("task", JSON.stringify(tasks)); // convert data to json string
}
}
// change completed status betwn completed and not completed with specified id 
function toggleStatus(id) {
  let todo = tasks.find((item)=> item.id === id )
  todo.completed = !todo.completed
  Task.saveToLacalStorage();
  showAllTodos()
}

// list todo with completed or pending tasks
function filterToDos(status) {
  let filterTodo;
 let dataclone = [...tasks]
  switch (status) {
    case 'all':
      filterTodo = dataclone;
      tasks.filter(tsk => (tsk.completed === true || tsk.completed !== true ? tsk.state = 'show':''))
      break;
    case 'pending':
      filterTodo = tasks.filter(tsk => (tsk.completed !== true ? tsk.state = 'show' : tsk.state = 'hide'))
      break;
    case 'completed':
      filterTodo = tasks.filter(tsk => ( tsk.completed === true ? tsk.state = 'show': tsk.state = 'hide') )
      console.log(filterTodo);
      break;
  }
  showAllTodos(filterToDos);
}


$('.sort').on('click', function () {
  var column = $(this).data('column'),
    order = $(this).data('order');
  
  if (order === 'desc') {
    $(this).data('order', 'asc')
    tasks = tasks.sort((a, b) => a[column] > b[column] ? 1 : -1)
    
  } else {
    $(this).data('order', 'desc')
    tasks = tasks.sort((a, b) => a[column] < b[column] ? 1 : -1)
  }
  showAllTodos(tasks)
});

$(".addtask").on('click', () => {
  const input_value = input.value;
  if (input_value !== ""  ) {
    input.value = "";
    // push value into create function
    Task.create(input_value);
    Task.displayTask();
  } else {
    Task.showAlertMessage("input filed is empty ", ".alertMsg")
  }
})

// key support to add input
$('#todo').on('keydown', (e) => {
  if (e.key == "Enter") addTaskBtn.click();
  
})

$('.clearAll').on('click', () => {
  tasks = [];
  Task.showAlertMessage("All Tasks Are Deleted Successfully", ".alertMsg");
  Task.displayTask();
})


function showAllTodos() {
  tasks_container.innerHTML = "";
  if (tasks_container.length == 0) {
    tasks_container.innerHTML = `<tr> <td class="text-center " colspan="5" > No task found </td> </tr>`;
    return;
  }
  tasks.forEach((task) => {
    var tsks = `
                <tr class="taskItem  w-xs md:w-full text-center  text-xs md:text-md ${task.state = task.state} " value= ${task.name} id=${task.id}>
                    <td ${task.completed === true ? 'text-success':''} > ${task.name}  </td>
                    <td> ${task.dueDate || "no due date"} </td>
                    <td >${task.status}</td>
                    <td class="action btns" >
                        <button class="isCompleted md:text-xs btn-xs md:btn-md  " title="complete" onclick="Task.complete(${
                          task.id
                        })" >
                            <i class="bx bx-check bx-xs md:bx-md text-success"></i>
                        </button>
                        <button class="edit  btn-xs md:btn-md" title="update" onclick="Task.edit(${
                          task.id
                        })" >
                            <i class="bx bx-edit-alt text-lime-400 bx-xs md:bx-md"></i>
                        </button>
                        <button class="delete  btn-xs md:btn-md" title="delete" onclick="Task.delete(${
                          task.id
                        })" >
                            <i class="bx bx-trash bx-xs text-rose-600 md:bx-lg"></i>
                        </button>
                    </td>
                </tr>
            `;
    tasks_container.innerHTML += tsks;

    Task.saveToLacalStorage();
  });
}
// display tasks when window loaded
window.addEventListener("DOMContentLoaded", () => {
  if (!tasks.length) {
    Task.displayTask()
  }
  showAllTodos()
  
});





