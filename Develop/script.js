//Global variables for todo list

var eventInputEl = $("#event-input")
var toDoListEl = $('#to-do-list');
var count = 0;

// Create a function that will add checkboxes
function addTodoItem(todo, completed) {

  // Add a checkbox and label. Set the style based on whether the item
  // is completed or not
  if (completed)
  {
    toDoListEl.append("<input type=\"checkbox\" class=\"form-check-input\" id=\"task-" + count + "\" checked>");
    toDoListEl.append("<label class=\"form-check-label todo-done\" for=\"task-" + count + "\">" + todo + "</label><br>");
  } else {
    toDoListEl.append("<input type=\"checkbox\" class=\"form-check-input\" id=\"task-" + count + "\">");
    toDoListEl.append("<label class=\"form-check-label\" for=\"task-" + count + "\">" + todo + "</label><br>");
  }
  
  // Add item to local storage. If it is already there, it will override the existing item.
  var todoItem = {"todo": todo, "completed": completed};
  window.localStorage.setItem("todo-"+count, JSON.stringify(todoItem));

  // Update the todo list count in local storage
  count++;
  window.localStorage.setItem("todo-count", count);
}

// Restore the saved list from local storage
function restoreTodoList() {
  var todoCount = parseInt(localStorage.getItem('todo-count')); 

  for (var i = 0; i < todoCount; i++)
  {
    var todoItem = JSON.parse(window.localStorage.getItem('todo-'+i));
    addTodoItem(todoItem.todo, todoItem.completed);
  }
}

// 
$(function(){
    let currentDateEl = document.getElementById("currentDay");
    var d = new dayjs().format("dddd, MMMM DD");
    const currentD = new Date();
    var currentHour = currentD.getHours();
    console.log(currentHour);
    currentDateEl.innerHTML = d;
    
    // save text to local storage 
    for (let i = 9; i < 18; i++){
      document.getElementById("saveBtn"+ i).addEventListener("click", function() {
        console.log("text"+i);
        console.log(document.getElementById("text"+i));
      window.localStorage.setItem("key"+i, document.getElementById("text"+i).value)  
      });
      var savedText = window.localStorage.getItem("key"+i);
      document.getElementById("text"+i).value = savedText;
    }
    
    // change colour of text background pending time of day
    for (var i=9; i<18; i++){
      if (i < currentHour){
        document.getElementById("hour-"+i).style.backgroundColor = '#38618C'
      }
      if (i === currentHour){
        document.getElementById("hour-"+i).style.backgroundColor = "#FF5964"
      }
      if (i > currentHour){
        document.getElementById("hour-"+i).style.backgroundColor = '#38618c'
      }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///
    /// Todo list functionality
    ///
    ///

    // check if 'todo-count' has been saved to local storage
    // if it has not, save and set it to zero.
    if (window.localStorage.getItem('todo-count') === null)
    {
        window.localStorage.setItem('todo-count', 0);
    }

    // An event lister for changes to the event textbox
    eventInputEl.change(function() {
        addTodoItem(eventInputEl.val(), false);
        eventInputEl.val("Enter event!");
    });

    // restore save todo list
    restoreTodoList();
    
    // An event lister for all checkboxes
    $(".form-check").change(function() {
        var checkboxBtn = $(this).children("input");
        var checkboxLbl = $(this).children("label");
        
        // Loop through the checkboxes and set the style based on whether
        // the checkbox is set
        for(var i = 0; i < checkboxBtn.length; i++)
        {
            if (checkboxBtn[i].checked) {
                $(checkboxLbl[i]).removeClass('todo-not-done');
                $(checkboxLbl[i]).addClass('todo-done');
            } else {
                $(checkboxLbl[i]).addClass('todo-not-done');
                $(checkboxLbl[i]).removeClass('todo-done');
            }

            // Save the state of the checkbox to local storage
            var todoItem = JSON.parse(window.localStorage.getItem('todo-'+i));
            todoItem.completed = checkboxBtn[i].checked;
            window.localStorage.setItem("todo-"+i, JSON.stringify(todoItem));
        }
    });
});

