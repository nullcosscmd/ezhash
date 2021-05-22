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

//Preset error message for when the user doesn't enter a file location
let locationErr = "Please input a file location!";

//Make an erorr function to send an error message and then exit the script
function err(input) {
	console.log(color("red") + input);
	process.exit();
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

//If there's at least one argument, look for options
if (process.argv.length >= 3) {
	//Check to see if there's a dash at the front of the first argument
	if (process.argv[2].charAt(0) == "-") {
		//Let the script know that the user put an option
		option = true;

		//Check to see if the comparison option was used
		if (process.argv[2] == "-d") {
			//If there isn't an argument after the "-d," tell the user to input a hash
			if (!process.argv[3]) {
				err("Please input a hash for comparison!");
			} else if (!process.argv[4]) {
				//If there isn't an argument after the hash they used for comparison, tell the user to input a
				//file location
				err(locationErr);
			}
		} else {
			//If the used didn't use the comparison option, check to see if they put a file location after the
			//option
			if (!process.argv[3]) {
				err(locationErr);
			}
		}
	}
} else {
	//If there's not a single argument, tell the user to input a file location
	err(locationErr);
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
