var fs = require("fs");

var command = process.argv[2];
var title = process.argv[3];

if (process.argv[4]) {
	title = "";
	var input = process.argv.slice(3);
	for (var i = 0; i < input.length; i++) {
		if (i > 0) {
			title = title + " ";
		}
		title = title + input[i];
	};
};

function userCommand(cmd) {
	switch (cmd) {
		case "my-tweets":
		twitter();
		break;

		case "spotify-this-song":
		spotify();
		break;

		case "movie-this":
		movie();
		break;

		case "do-what-it-says":
		doIt();
		break;

		default:
		console.log("I'm sorry, but this input is invalid");
	};
};

function twitter() {
	var Twitter = require('twitter');

	var keys = require("./keys.js");

	var T = new Twitter(keys);
	var parameters = { screen_name: 'ThisismeStuart', count: 20 }
	T.get('statuses/user_timeline', parameters, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				console.log("Tweet Created:");
				console.log(tweets[i].created_at);
				console.log("");
				console.log("Tweet:");
				console.log(tweets[i].text);
				console.log("----------------------------");
			}
		}
	});
}

function spotify() {
	if (title) {
		var Spotify = require("node-spotify-api");

	var spotify = new Spotify({
		id: "24e5a4dc948b43ef908769053d1b1e83",
		secret: "7145a9013c9043afabdca615a17f0c77"
	});

	spotify.search({ type: "track", query: title }, function(err, data){
		if (err) {
			return console.log("Error occurred: " + err);
		}
		for (var i = 0; i < data.tracks.items.length; i++) {
			console.log("-----------------------------------------------------");
			console.log("Artist Name: " + data.tracks.items[i].artists[0].name);
			console.log("Song Name: " + data.tracks.items[i].name);
			console.log("Preview Link: " + data.tracks.items[i].external_urls.spotify);
			console.log("Album: " + data.tracks.items[i].album.name);
			console.log("-----------------------------------------------------");
		}
	});
	} else {
		console.log("-----------------------------------------------------");
		console.log("Artist: Ace of Base");
		console.log("Song Name: The Sign");
		console.log("Preview Link: https://play.spotify.com/track/3DYVWvPh3kGwPasp7yjahc?play=true&utm_source=open.spotify.com&utm_medium=open");
		console.log("Album: The Sign");
		console.log("-----------------------------------------------------");
	}
};

function movie() {
	var request = require("request");

	if (!title) {
		title = "Mr+Nobody";
	}

	var queryURL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";

	request(queryURL, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("-----------------------------------------------------");
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Produced In: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("-----------------------------------------------------");
		}
	});
};

function doIt() {
	fs.readFile("./random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}
		console.log(data);
	});
};
userCommand(command);