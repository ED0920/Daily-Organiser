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
        document.getElementById("text"+i).style.backgroundColor = '#ebebeb'
      }
      if (i === currentHour){
        document.getElementById("text"+i).style.backgroundColor = "#957fef"
      }
      if (i > currentHour){
        document.getElementById("text" + i).style.backgroundColor = '#cee4f4'
      }
    }
    });

var requestUrl = 'https://api.quotable.io/random';// it holds the api to get a random quote

// this function gets the quote from the api, saves it in the local storage
//and gets a new one when the date changes
function setQuote(requestUrl) {
  var quote1 = localStorage.getItem("quote");
  var author1 = localStorage.getItem("author");
  var savedDate = localStorage.getItem('date');//
  var today = new dayjs().format("YYYY-MM-DD");
  localStorage.setItem('date', today);// saves the current day

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
  if (quote1 === null || author1 === null || resetQuote ) {
    fetch(requestUrl)
      .then(function (response) {

        response.json().then(function (data) {
          localStorage.setItem("quote", data.content );
          document.getElementById("quote").textContent = "\"" + data.content +"\"" ;

          localStorage.setItem("author", data.author);
          document.getElementById("author").textContent = data.author;
        })
        
    });
  } else {
    document.getElementById("quote").textContent = "\"" + quote1 +"\"" ;
    document.getElementById("author").textContent = author1;
  }
}
setQuote(requestUrl);




  