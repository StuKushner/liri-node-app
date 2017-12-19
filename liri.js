var fs = require("fs");

var command = process.argv[2];

switch (command) {
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
	random();
	break;
}

function twitter() {
	var twitter = require("twitter");


}

function spotify() {
	
}