//Global variables
var count = 0;

$(function () {
  // Load calendar
  loadCalendar();

  // Load the 'todo' list
  loadTodoList();

  // Load today's weather
  loadLocalWeather();

  // Load word of the day
  setWord();

  // Load quote of the day
  setQuote(requestUrl);

  // Load latest news headline
  loadNews();
});

function loadCalendar() {
  let currentDateEl = document.getElementById("currentDay");
  var d = new dayjs().format("dddd, MMMM DD");
  const currentD = new Date();
  var currentHour = currentD.getHours();
  currentDateEl.innerHTML = d;

  // save text to local storage
  for (let i = 9; i < 22; i++) {
    document
      .getElementById("saveBtn" + i)
      .addEventListener("click", function () {
        window.localStorage.setItem(
          "key" + i,
          document.getElementById("text" + i).value
        );
      });
    var savedText = window.localStorage.getItem("key" + i);
    document.getElementById("text" + i).value = savedText;
  }

  // change colour of text background pending time of day
  for (var i = 9; i < 22; i++) {
    if (i < currentHour) {
      document.getElementById("text" + i).style.backgroundColor = "#e9ecef";
    }
    if (i === currentHour) {
      document.getElementById("text" + i).style.backgroundColor = "#957fef";
    }
    if (i > currentHour) {
      document.getElementById("text" + i).style.backgroundColor = "#cee4f4";
    }
  }
}

/*
 * This function loads and initialises the todo list.
 */
function loadTodoList() {
  // check if 'todo-count' has been saved to local storage
  // if it has not, save and set it to zero.
  if (window.localStorage.getItem("todo-count") === null) {
    window.localStorage.setItem("todo-count", 0);
  }

  var todoCount = parseInt(localStorage.getItem("todo-count"));

  for (var i = 0; i < todoCount; i++) {
    var todoItem = JSON.parse(window.localStorage.getItem("todo-" + i));
    addTodoItem(todoItem.todo, todoItem.completed);
  }

  // An event lister for changes to the event textbox
  $("#event-input").on("change", handleAddTodo);

  // An event lister for all checkboxes
  $(".form-check").on("change", handleCheckboxChange);
}

function handleAddTodo() {
  addTodoItem($("#event-input").val(), false);
  $("#event-input").val("");
}

function handleCheckboxChange() {
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
}

function handleTodoDelete(id) {
  //todo-button-x
  var deleteId = "todo-" + id.slice(12);

  // Update local storage to remove item
  // Create an array with all the todo items we want to keep
  // Adjust the ids
  var todoCount = parseInt(localStorage.getItem("todo-count"));
  var todoList = [];
  for (var i = 0, j = 0; i < todoCount; i++) {
    var todoKey = "todo-" + i;

    // If the key is for the item to delete, do not add it to the array
    if (deleteId != todoKey) {
      todoList.push(["todo-" + j, window.localStorage.getItem(todoKey)]);
      j++;
    }

    // Remove the item from local storage
    window.localStorage.removeItem(todoKey);
  }

  // Restore the items. This will restore all except the item deleted.
  for (var i = 0; i < todoList.length; i++) {
    window.localStorage.setItem(todoList[i][0], todoList[i][1]);
  }

  // Update the todo list count in local storage
  todoCount--;

  if (todoCount < 0) {
    todoCount = 0;
  }

  window.localStorage.setItem("todo-count", todoCount);

  window.location.reload();
}

// Create a function that will add checkboxes
function addTodoItem(todo, completed) {
  // Add a checkbox and label. Set the style based on whether the item
  // is completed or not
  if (completed) {
    $("#to-do-list").append(
      '<input type="checkbox" class="form-check-input" id="task-' +
        count +
        '" checked>'
    );
    $("#to-do-list").append(
      '<label class="form-check-label todo-done" for="task-' +
        count +
        '">' +
        todo +
        '<button type="button" id="task-button-' +
        count +
        '"  class="close" aria-label="Close">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
        '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>' +
        '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>' +
        "</svg></button>" +
        "</label><br>"
    );
  } else {
    $("#to-do-list").append(
      '<input type="checkbox" class="form-check-input" id="task-' + count + '">'
    );
    $("#to-do-list").append(
      '<label class="form-check-label" for="task-' +
        count +
        '">' +
        todo +
        '<button type="button" id="task-button-' +
        count +
        '" class="close" aria-label="Close">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
        '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>' +
        '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>' +
        "</svg></button>" +
        "</label><br>"
    );
  }

  // Add item to local storage. If it is already there, it will override the existing item.
  var todoItem = { todo: todo, completed: completed };
  window.localStorage.setItem("todo-" + count, JSON.stringify(todoItem));

  // Add event listener for the new task
  $("#task-button-" + count).click(function () {
    handleTodoDelete(this.id);
  });

  // Update the todo list count in local storage
  count++;
  window.localStorage.setItem("todo-count", count);
}

// function to get the current weather
var loadLocalWeather = function () {
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

// it holds the api to get a random quote
var requestUrl = "https://api.quotable.io/random";

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
  // then we get a new random quote with its author from the api, save it in the local storage and display
  if (quote1 === null || author1 === null || resetQuote) {
    fetch(requestUrl).then(function (response) {
      response.json().then(function (data) {
        localStorage.setItem("quote", data.content);
        document.getElementById("quote").textContent = '"' + data.content + '"';

        localStorage.setItem("author", data.author);
        document.getElementById("author").textContent = data.author;
      });
    });
    //If quote and its author are not saved in local storage or resetQuote is true
    //then display the new quote and its author
  } else {
    document.getElementById("quote").textContent = '"' + quote1 + '"';
    document.getElementById("author").textContent = author1;
  }
}

// to display word of the day.
function setWord() {
  //declaring and initialising variables for the random word
  // of the day and its meaning in local storage
  var word1 = localStorage.getItem("word1");
  var wordMeaning1 = localStorage.getItem("wordMeaning1");

  //declaring and initialising variables for the date
  //in local storage to be able, later on, to store or change wordOfDay according
  //whether if is a new day or not, accordingly
  var savedDate1 = localStorage.getItem("date1"); //
  var today1 = dayjs().format("YYYY-MM-DD");
  localStorage.setItem("date1", today1); // saves the current day

  var resetWord = false;
  // if current day hasnt been saved in local storage the resetWord variable is set to true
  if (savedDate1 === null) {
    resetWord = true;

    // if the current day is different to the date saved in local storage the resetWord is set to true
  } else if (today1 !== savedDate1) {
    resetWord = true;
  }

  // if word1 are is not  saved in local storage or WordMeaning1 is null or resetWord is true
  // then we get a new random word from the api and save it in the local storage
  var requestUrl2 = "https://random-word-api.herokuapp.com/word"; // it holds the api to get a random word
  if (word1 === null || wordMeaning1 === null || resetWord) {
    fetch(requestUrl2).then(function (response) {
      response.json().then(function (data) {
        // data is an array wwith a string inside
        console.log(data);
        var wordOfDay = data[0];
        // saving in local storage and displaying on website.
        localStorage.setItem("word1", wordOfDay);
        document.getElementById("word").textContent = wordOfDay;
        //API for definition of wordOfDay
        fetch(
          "https://api.dictionaryapi.dev/api/v2/entries/en/" + wordOfDay
        ).then(function (response) {
          //if the response from the API is Ok then display definition
          if (response.ok) {
            response.json().then(function (data) {
              //grabbing the definition object from the data array and converting it to string
              var defOutput = data[0].meanings[0].definitions[0].definition;
              defOutput = JSON.stringify(defOutput);
              //saving word definition for display on website
              localStorage.setItem("wordMeaning1", defOutput);
              document.getElementById("wordMeaning").textContent = defOutput;
            });
            // otherwise if the definition is not in the definition API, display error message
          } else {
            localStorage.setItem("wordMeaning1", "Definition not found.");
            document.getElementById("wordMeaning").textContent =
              "Definition not found.";
          }
        });
      });
    });
    // if wordOfDay and its definition are saved in local storage or resetWord is false
    // then display them.
  } else {
    document.getElementById("word").textContent = word1;
    document.getElementById("wordMeaning").textContent = wordMeaning1;
  }
}

function loadNews() {
  const newAPIUrl =
    'https://api.mediastack.com/v1/news?access_key=bf07b14ff7f7f445faf52417d8bdb544&countries=au';

  // Request top news headlines
  fetch(newAPIUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var newsImageEl = $("#news-image")[0];
      var newsTitleEl = $("#news-title")[0];
      var newsLinkEl = $("#news-url")[0];

      newsTitleEl.innerHTML = data.data[0].title;
      newsImageEl.src = data.data[0].image;
      newsLinkEl.href = data.data[0].url;

    });
}
