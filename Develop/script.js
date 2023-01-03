
$(function(){
    let currentDateEl = document.getElementById("currentDay");
    var d = new dayjs().format("dddd, MMMM DD");
    const currentD = new Date();
    var currentHour = currentD.getHours();
    console.log(currentHour);
    currentDateEl.innerHTML = d
    
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

    // get weather
    getLocalWeather();

});

// function to get the current weather    
var getLocalWeather = function () {

  // Base URL to get icons
  const weatherAPIIconBaseUrl = 'https://openweathermap.org/img/wn/';

  // URL to retrieve weather. Currently set to get Sydney weather.
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=2ceea9234e7f11c55707a7299e43d1c6';

  // Request current Sydney weather
  fetch(apiUrl) 
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          // Create selectors to weather discription, temperature and icon elements
          var weatherDescriptionEl = $('#weather-description')[0];
          var weatherTempEl = $('#weather-temp')[0];
          var weatherIconEl = $('#weather-icon')[0];

          // Update the description, temperature, and icon using the fetched weather data
          // The icon is downloaded from the openweathermap host
          weatherDescriptionEl.innerHTML = data.weather[0].description;
          weatherTempEl.innerHTML = (data.main.temp/10.0).toFixed(2)+'°C';
          weatherIconEl.src = weatherAPIIconBaseUrl + data.weather[0].icon + '.png';
      });
};
