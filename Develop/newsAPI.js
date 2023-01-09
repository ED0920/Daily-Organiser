var url = "https://newsapi.org/v2/top-headlines?country=au&apiKey=6bfbc7eb141343d58fa5803ccb916e9a"

var req = new Request(url);

fetch(url)
    .then(function(response) {
        console.log(response);
        return response.json()
    })
    .then(function(data){
        // console.log(data)
        var articles = data.articles
        console.log(articles[0])
        var article = articles[0]
        var articleTitleEl = $("#article-title-0");
        articleTitleEl.text(article.title)
        
        var articleurlEl = $("#article-url-0");
        articleurlEl.text(article.url)

        article = articles[1]
        articleTitleEl = $("#article-title-1");
        articleTitleEl.text(article.title)
        
         articleurlEl = $("#article-url-1");
        articleurlEl.text(article.url)
        
    })