// ===========================
// DEPENDENCIES
// ===========================

// Read and set environment variables
require("dotenv").config();

// Import Twitter NPM Package
var Twitter = require('twitter');

// Import Spotify NPM Package
var Spotify = require("node-spotify-api");

// Import keys
var keys = require("./keys");

// Import request npm package
var request = require("request");

// Import fs for reading and writing
var fs = require("fs");

// Initialize Spotify API client using the client ID and secret
var spotify = new Spotify(keys.spotify);

// ============================
// FUNCTIONS
// ============================

// Writes to the log.txt file
var writeToLog = function(data) {
	fs.appendFile("log.txt", JSON.stringify(data) + "\n", function(err){
		if (err) {
			return console.log(err);
		}
		console.log("log.txt was updated!");
	});
};

// This is a helper function that gets the artist's name
var getArtistNames = function(artist) {
	return artist.name;
};

// This function runs a Spotify search
var getMeSpotify = function(songName) {
	if (songName === undefined) {
		songName = "The Sign";
	}

	spotify.search(
		{
			type: "track",
			query: songName
		},
		function (err, data) {
			if (err) {
				console.log("Error occurred: " + err);
				return;
			}

			var songs = data.tracks.items;
			var data = [];

			for (var i = 0; i < songs.length; i++) {
				data.push({
					"artist(s)": songs[i].artists.map(getArtistNames),
					"song name": songs[i].name,
					"preview song": songs[i].preview_url,
					"albums": songs[i].album.name
				});
			}

		console.log(data);
		writeToLog(data);
	});
};

// This function runs a Twitter search
var getMyTweets = function() {
	var client = new Twitter(keys.twitter);

	var params = {
		screen_name: "ThisismeStuart"
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			var data = [];

			for (var i = 0; i < tweets.length; i++) {
				data.push({
					created_at: tweets[i].created_at,
					text: tweets[i].text
				});
			}

			console.log(data);
			writeToLog(data);
		}
	});
};

// This function runs a movie search
var getMyMovie = function(title) {
	if (title === undefined) {
		title = "Mr Nobody";
	}

	var queryURL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";

	request(queryURL, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var jsonData = JSON.parse(body);

			var data = {
				"Title:": jsonData.Title,
				"Year:": jsonData.Year,
				"Rated:": jsonData.Rated,
				"IMDB Rating:": jsonData.imdbRated,
				"Country:": jsonData.Country,
				"Language:": jsonData.Language,
				"Plot:": jsonData.Plot,
				"Actors:": jsonData.Actors,
				"Rotten Tomatoes URL:": jsonData.tomatoURL
			};

			console.log(data);
			writeToLog(data);
		}
	});
};

// This function runs a command based on the text file
var doWhatItSays = function() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		console.log(data);

		var dataArr = data.split(",");

		if (dataArr.length === 2) {
			pick(dataArr[0], dataArr[1]);
		}
		else if (dataArr.length === 1) {
			pick(dataArr[0]);
		}
	});
};

// This function determines which command is executed
var pick = function(command, functionData) {
	switch (command) {
		case "my-tweets":
			getMyTweets();
			break;
		case "spotify-this-song":
			getMeSpotify(functionData);
			break;
		case "movie-this":
			getMyMovie(functionData);
			break;
		case "do-what-it-says":
			doWhatItSays();
			break;
		default:
			console.log("LIRI doesn't know that");	
	}	
};

// This function takes in command arguments and executes the correct function
var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

// ============================
// MAIN PROCESS
// ============================
runThis(process.argv[2], process.argv[3]);