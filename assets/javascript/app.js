var heroArray = ["batman", "iron man", "superman", "captain america"];

var baseURL = "https://api.giphy.com/v1/gifs/search?q=";

var query;

var apiKey = "&api_key=dc6zaTOxFJmzC";

var limit = "&limit=10";
var offset = 0;
var previous;

function generateGifs(button) {
    query = button.attr("data-hero");
    if (previous === button.attr("data-hero")) {
        offset += 10;
        // console.log(offset);
        $.ajax({
            url: baseURL + query + apiKey + limit + "&offset=" + offset,
            method: "GET"
        }).then(function (result) {
            var data = result.data;
            for (var i = 0; i < data.length; i++) {
                var imgDiv = $("<div class='image'>");
                var rating = $("<p>");
                rating.text("Rating: " + data[i].rating);
                var image = $("<img class='img' data-state='still'>");
                image.attr("src", data[i].images.fixed_height_still.url);
                image.attr("data-still", data[i].images.fixed_height_still.url);
                image.attr("data-animated", data[i].images.fixed_height.url);
                imgDiv.append(rating);
                imgDiv.append(image);
                $("#gifSection").prepend(imgDiv);
            }
            $(".img").on("click", function () {
                var image = $(this);
                playGif(image);
            });
        });
    } else {
        offset = 0;
        $("#gifSection").empty();
        $.ajax({
            url: baseURL + query + apiKey + limit,
            method: "GET"
        }).then(function (result) {
            // console.log(result);
            var data = result.data;
            for (var i = 0; i < data.length; i++) {
                var imgDiv = $("<div class='image'>");
                var rating = $("<p>");
                rating.text("Rating: " + data[i].rating);
                var image = $("<img class='img' data-state='still'>");
                image.attr("src", data[i].images.fixed_height_still.url);
                image.attr("data-still", data[i].images.fixed_height_still.url);
                image.attr("data-animated", data[i].images.fixed_height.url);
                imgDiv.append(rating);
                imgDiv.append(image);
                $("#gifSection").prepend(imgDiv);
            }
            $(".img").on("click", function () {
                var image = $(this);
                playGif(image);
            });
        });
    }
}

function playGif(image) {
    var state = image.attr("data-state");
    if (state === "still") {
        image.attr("src", image.attr("data-animated"));
        image.attr("data-state", "animate");
    } else {
        image.attr("src", image.attr("data-still"))
        image.attr("data-state", "still");
    }

}

function generateButtons() {
    $("#heroes").empty();
    for (var i = 0; i < heroArray.length; i++) {
        var button = $("<button>");
        button.attr("data-hero", heroArray[i]);
        button.text(heroArray[i]);
        $("#heroes").append(button);
    }
    $("button").on("click", function () {
        var button = $(this);
        generateGifs(button);
        previous = button.attr("data-hero");
    });
}

$(document).ready(function () {
    generateButtons();
    $("#submit").on("click", function (event) {
        event.preventDefault();
        query = $("#searchBar").val();
        if (!heroArray.includes(query) && query) {
            heroArray.push(query);
        }
        generateButtons();
    });
});