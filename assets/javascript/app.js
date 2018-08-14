var heroArray = ["batman", "iron man", "superman", "captain america"];

var baseURL = "https://api.giphy.com/v1/gifs/search?q=";

var query;

var apiKey = "&api_key=dc6zaTOxFJmzC";

var limit = "&limit=10";
var offset = 0;
var previous;
var favorites = [];

// make gif
function makeGif(result) {
    var data = result.data;
    for (var i = 0; i < data.length; i++) {
        var imgDiv = $("<div class='image'>");
        var rating = $("<p>");
        rating.text("Rating: " + data[i].rating);
        var image = $("<img class='img' data-state='still'>");
        image.attr("src", data[i].images.fixed_height_still.url);
        image.attr("data-still", data[i].images.fixed_height_still.url);
        image.attr("data-animated", data[i].images.fixed_height.url);
        var favButton = $("<button class='favButton' data-state='still'>");
        favButton.attr("title", data[i].title);
        favButton.attr("src", data[i].images.fixed_height_still.url);
        favButton.attr("data-still", data[i].images.fixed_height_still.url);
        favButton.attr("data-animated", data[i].images.fixed_height.url);
        favButton.text("Favorite");
        for (var j = 0; j < favorites.length; j++) {
            if (favorites[j].still === data[i].images.fixed_height_still.url)
            {
                favButton.addClass("active");
            }
        }
        imgDiv.append(rating);
        imgDiv.append(image);
        imgDiv.append(favButton);
        $("#gifSection").prepend(imgDiv);
    }
    // $(".img").on("click", function () {
    //     var image = $(this);
    //     playGif(image);
    // });
    // $(".favButton").on("click", function () {
    //     var button = $(this);
    //     $(this).addClass("active");
    //     favorite(button);
    // })
}

// check for offset if needed then call make gif function
function generateGifs(button) {
    query = button.attr("data-hero");
    if (previous === button.attr("data-hero")) {
        offset += 10;
        // console.log(offset);
        $.ajax({
            url: baseURL + query + apiKey + limit + "&offset=" + offset,
            method: "GET"
        }).then(function (result) {
            makeGif(result);
        });
    } else {
        offset = 0;
        $("#gifSection").empty();
        $.ajax({
            url: baseURL + query + apiKey + limit,
            method: "GET"
        }).then(function (result) {
            console.log(result);
            makeGif(result);
        });
    }
}

// play gif when click gif
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

// Create button when search
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


function favorite(button) {
    previous = "";
    console.log(favorites);
    var gif = {
        title: button.attr("title"),
        src: button.attr("data-still"),
        still: button.attr("data-still"),
        animate: button.attr("data-animated"),
        state: button.attr("data-state")
    }
    favorites.push(gif);
}



// Document click
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
    $(".favorite").on("click", function() {
        $("#gifSection").empty();
        for(var i = 0; i < favorites.length; i++) {
            var title = $("<p>");
            var imgDiv = $("<div class='image'>");
            var image = $("<img class='img' data-state='still'>");
            title.text(favorites[i].title);
            image.attr("src", favorites[i].src);
            image.attr("data-still", favorites[i].still);
            image.attr("data-animated", favorites[i].animate);
            imgDiv.append(title);
            imgDiv.append(image);
            $("#gifSection").prepend(imgDiv);
        } 
    });
    $(document).on("click", ".img", function () {
        var image = $(this);
        playGif(image);
    });
    $(document).on("click", ".favButton", function () {
        var button = $(this);
        $(this).addClass("active");
        favorite(button);
    })
});