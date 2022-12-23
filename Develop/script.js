/*
 * Global variables for todo list
 */
var eventInputEl = $("#event-input")
var toDoListEl = $('#to-do-list');
var count = 0;

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

    /* Create a function that will add checkboxes */
    function addToDo(todo) {
        toDoListEl.append("<input type=\"checkbox\" class=\"form-check-input\" id=\"task-" + count + "\">");
        toDoListEl.append("<label class=\"form-check-label\" for=\"task-" + count + "\">" + todo + "</label><br>");
        count++;
    }
    
    /* An event lister for changes to the event textbox */
    eventInputEl.change(function() {
        addToDo(eventInputEl.val());
        eventInputEl.val("Enter event!");
    });
    
    /* An event lister for all checkboxes */
    $(".form-check").change(function() {
        var checkboxBtn = $(this).children("input");
        var checkboxLbl = $(this).children("label");
        
        for(var i = 0; i < checkboxBtn.length; i++)
        {
            if (checkboxBtn[i].checked) {
                $(checkboxLbl[i]).removeClass('todo-not-done');
                $(checkboxLbl[i]).addClass('todo-done');
            } else {
                $(checkboxLbl[i]).addClass('todo-not-done');
                $(checkboxLbl[i]).removeClass('todo-done');
            }
        }
    });
});

