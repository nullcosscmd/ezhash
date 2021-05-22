#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const clipboard = require("clipboardy");
const color = require("./color").color;

function rainbow(input) {
	//Split the string every 3 characters
	input = input.match(/.{1,3}/g);
	//Make the string bright and underline it
	let colorTxt = color("brightunderline");

	//Index for switching the color every 3 characters
	let index = 0;
	//Array of color names
	let colors = ["magenta", "cyan", "green", "red"];

	//Loop through the array of 3 character strings
	for (let i = 0; i < input.length; i++) {
		//"Snip" is the 3 character piece of the hash that we're currently processing
		const snip = input[i];

		//If the index reaches 3, reset it, otherwise increment it
		if (index == 3) {
			index = 1;
		} else {
			index++;
		}
		//Add the color to the end of the text, then add the 3 characters that we're going to color
		colorTxt = colorTxt + color(colors[index]) + snip;
	}
	//Reset the color to plain white and return the rainbow string
	colorTxt = colorTxt + color("reset");
	return colorTxt;
}

//Option callback functions
//-------------------------
function copyToClipboard(txt) {
	clipboard.writeSync(txt);
}

function compareHashes(txt) {
	//Check if the hash we got is equal to the hash the user inputted
	if (txt == process.argv[3]) {
		console.log(color("green") + "The hashes match!");
	} else {
		console.log(color("red") + "The hashes don't match!");
	}
}
//-------------------------

//If this variable is false, then the user didn't put any options (-c, -d, etc)
let option = false;

//Define the characters for the options, and give them callback functions
let options = {
	c: copyToClipboard,
	d: compareHashes,
};

//Get the file location from the last argument in the command
let fd = fs.createReadStream(process.argv[process.argv.length - 1]);

if (process.argv.length >= 3) {
	if (process.argv[2].charAt(0) == "-") {
		option = true;
		if (process.argv[2] == "-d") {
			if (!process.argv[3]) {
				console.log(color("red") + "Please input a hash for comparison!");
				process.exit();
			} else if (!process.argv[4]) {
				console.log(color("red") + "Please input a file location!");
				process.exit();
			}
		} else {
			if (!process.argv[3]) {
				console.log(color("red") + "Please input a file location!");
				process.exit();
			}
		}
	}
} else {
	console.log(color("red") + "Please input a file location!");
	process.exit();
}

//Create a new SHA256 hash with hex encoding
var hash = crypto.createHash("sha256");
hash.setEncoding("hex");

//When the script finishes reading the file
fd.on("end", function () {
	//Stop hashing
	hash.end();
	//Read what was hashed and assign it to a variable
	let txt = hash.read();

	//Check to see if the user gave an option
	if (option) {
		//Get the option that the user put
		option = process.argv[2].charAt(1);

		//If the option that the user gave exists, send the hash to the callback function for that option
		if (options[option]) {
			options[option](txt);
		}
	}

	//Rainbow-fy the hash and send it to the console
	txt = rainbow(txt);
	console.log(txt);
});

//Send what's being read to be hashed
fd.pipe(hash);
