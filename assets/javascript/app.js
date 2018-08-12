var heroArray = ["batman", "iron man", "superman", "captain america"];

var baseURL = "https://api.giphy.com/v1/gifs/search?q=";

var query;

var apiKey = "&api_key=shCGHocGsPVCVsc1KVmaEOzoa8XFiXFm";

var limit = "&limit=10";

$(document).ready(function () {
    $("#submit").on("click", function (event) {
        event.preventDefault();
        query = $("#searchBar").val();
        if (!heroArray.includes(query) && query) {
            heroArray.push(query);
        }
        $("#heroes").empty();
        for (var i = 0; i < heroArray.length; i++) {
            var button = $("<button>");
            button.attr("data-hero", heroArray[i]);
            button.text(heroArray[i]);
            $("#heroes").append(button);
        }
        $("button").on("click", function () {
            $("#gifSection").empty();
            query = $(this).attr("data-hero");
            $.ajax({
                url: baseURL + query + apiKey + limit,
                method: "GET"
            }).then(function (result) {
                console.log(result);
                var data = result.data;
                for (var i = 0; i < data.length; i++) {
                    var image = $("<img>");
                    image.attr("src", data[i].images.fixed_height.url);
                    $("#gifSection").append(image);
                }
            });
        });
    });
});