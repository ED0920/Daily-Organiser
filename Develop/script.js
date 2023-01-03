//Global variables for todo list

var eventInputEl = $("#event-input");
var toDoListEl = $("#to-do-list");
var count = 0;

// Create a function that will add checkboxes
function addTodoItem(todo, completed) {
  // Add a checkbox and label. Set the style based on whether the item
  // is completed or not
  if (completed) {
    toDoListEl.append(
      '<input type="checkbox" class="form-check-input" id="task-' +
        count +
        '" checked>'
    );
    toDoListEl.append(
      '<label class="form-check-label todo-done" for="task-' +
        count +
        '">' +
        todo +
        "</label><br>"
    );
  } else {
    toDoListEl.append(
      '<input type="checkbox" class="form-check-input" id="task-' + count + '">'
    );
    toDoListEl.append(
      '<label class="form-check-label" for="task-' +
        count +
        '">' +
        todo +
        "</label><br>"
    );
  }

  // Add item to local storage. If it is already there, it will override the existing item.
  var todoItem = { todo: todo, completed: completed };
  window.localStorage.setItem("todo-" + count, JSON.stringify(todoItem));

  // Update the todo list count in local storage
  count++;
  window.localStorage.setItem("todo-count", count);
}

// Restore the saved list from local storage
function restoreTodoList() {
  var todoCount = parseInt(localStorage.getItem("todo-count"));

  for (var i = 0; i < todoCount; i++) {
    var todoItem = JSON.parse(window.localStorage.getItem("todo-" + i));
    addTodoItem(todoItem.todo, todoItem.completed);
  }
}

$(function () {
  let currentDateEl = document.getElementById("currentDay");
  var d = new dayjs().format("dddd, MMMM DD");
  const currentD = new Date();
  var currentHour = currentD.getHours();
  console.log(currentHour);
  currentDateEl.innerHTML = d;

  // save text to local storage
  for (let i = 9; i < 21; i++) {
    document
      .getElementById("saveBtn" + i)
      .addEventListener("click", function () {
        console.log("text" + i);
        console.log(document.getElementById("text" + i));
        window.localStorage.setItem(
          "key" + i,
          document.getElementById("text" + i).value
        );
      });
    var savedText = window.localStorage.getItem("key" + i);
    document.getElementById("text" + i).value = savedText;
  }

  // change colour of text background pending time of day
  for (var i = 9; i < 21; i++) {
    if (i < currentHour) {
      document.getElementById("hour-" + i).style.backgroundColor = "grey";
    }
    if (i === currentHour) {
      document.getElementById("text" + i).style.backgroundColor = "#957fef";
    }
    if (i > currentHour) {
      document.getElementById("hour-" + i).style.backgroundColor = "blue";
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  ///
  /// Todo list functionality
  ///
  ///

  // check if 'todo-count' has been saved to local storage
  // if it has not, save and set it to zero.
  if (window.localStorage.getItem("todo-count") === null) {
    window.localStorage.setItem("todo-count", 0);
  }

  // An event lister for changes to the event textbox
  eventInputEl.change(function () {
    addTodoItem(eventInputEl.val(), false);
    eventInputEl.val("Enter event!");
  });

  // restore save todo list
  restoreTodoList();

  // An event lister for all checkboxes
  $(".form-check").change(function () {
    var checkboxBtn = $(this).children("input");
    var checkboxLbl = $(this).children("label");

    // Loop through the checkboxes and set the style based on whether
    // the checkbox is set
    for (var i = 0; i < checkboxBtn.length; i++) {
      if (checkboxBtn[i].checked) {
        $(checkboxLbl[i]).removeClass("todo-not-done");
        $(checkboxLbl[i]).addClass("todo-done");
      } else {
        $(checkboxLbl[i]).addClass("todo-not-done");
        $(checkboxLbl[i]).removeClass("todo-done");
      }

      // Save the state of the checkbox to local storage
      var todoItem = JSON.parse(window.localStorage.getItem("todo-" + i));
      todoItem.completed = checkboxBtn[i].checked;
      window.localStorage.setItem("todo-" + i, JSON.stringify(todoItem));
    }
  });

  // get weather
  getLocalWeather();
});

// function to get the current weather
var getLocalWeather = function () {
  // Base URL to get icons
  const weatherAPIIconBaseUrl = "https://openweathermap.org/img/wn/";

  // URL to retrieve weather. Currently set to get Sydney weather.
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=2ceea9234e7f11c55707a7299e43d1c6";

  // Request current Sydney weather
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Create selectors to weather discription, temperature and icon elements
      var weatherDescriptionEl = $("#weather-description")[0];
      var weatherTempEl = $("#weather-temp")[0];
      var weatherIconEl = $("#weather-icon")[0];

      // Update the description, temperature, and icon using the fetched weather data
      // The icon is downloaded from the openweathermap host
      weatherDescriptionEl.innerHTML = data.weather[0].description;
      weatherTempEl.innerHTML = (data.main.temp / 10.0).toFixed(2) + "°C";
      weatherIconEl.src = weatherAPIIconBaseUrl + data.weather[0].icon + ".png";
    });
};

var requestUrl = "https://api.quotable.io/random"; // it holds the api to get a random quote

// this function gets the quote from the api, saves it in the local storage
//and gets a new one when the date changes
function setQuote(requestUrl) {
  var quote1 = localStorage.getItem("quote");
  var author1 = localStorage.getItem("author");
  var savedDate = localStorage.getItem("date"); //
  var today = new dayjs().format("YYYY-MM-DD");
  localStorage.setItem("date", today); // saves the current day

  var resetQuote = false;

  // if current day hasnt been saved in local storage the resetQuote variable is set to true
  if (savedDate === null) {
    resetQuote = true;

    // if the current day is different to the date saved in local storage the resetQuote is set to true
  } else if (today !== savedDate) {
    resetQuote = true;
  }

  // if quote or author are not saved in local storage or resetQuote is true
  // then we get the random quote with its author from the api and save it in the local storage
  if (quote1 === null || author1 === null || resetQuote) {
    fetch(requestUrl).then(function (response) {
      response.json().then(function (data) {
        localStorage.setItem("quote", data.content);
        document.getElementById("quote").textContent = '"' + data.content + '"';

        localStorage.setItem("author", data.author);
        document.getElementById("author").textContent = data.author;
      });
    });
  } else {
    document.getElementById("quote").textContent = '"' + quote1 + '"';
    document.getElementById("author").textContent = author1;
  }
}
setQuote(requestUrl);
