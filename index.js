#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const clipboard = require("clipboardy");

function color(input) {
	switch (input) {
		case "reset":
			return "\x1b[0m";
		case "magenta":
			return "\x1b[35m";
		case "cyan":
			return "\x1b[36m";
		case "green":
			return "\x1b[32m";
		case "red":
			return "\x1b[31m";
		case "bright":
			return "\x1b[1m";
		case "underline":
			return "\x1b[4m";
	}
}

function rainbow(input) {
	input = input.match(/.{1,3}/g);
	let colorTxt = color("underline") + color("bright");
	let index = 0;
	for (let i = 0; i < input.length; i++) {
		const snip = input[i];
		switch (index) {
			case 0:
				colorTxt = colorTxt + color("magenta");
				break;
			case 1:
				colorTxt = colorTxt + color("cyan");
				break;
			case 2:
				colorTxt = colorTxt + color("green");
				break;
			case 3:
				colorTxt = colorTxt + color("red");
				index = -1;
				break;
		}
		index++;
		colorTxt = colorTxt + snip;
	}
	colorTxt = colorTxt + color("reset");
	return colorTxt;
}

let fd;

if (process.argv[2] == "-c") {
	fd = fs.createReadStream(process.argv[3]);
} else {
	fd = fs.createReadStream(process.argv[2]);
}

var hash = crypto.createHash("sha256");
hash.setEncoding("hex");

fd.on("end", function () {
	hash.end();
	var txt = hash.read();
	if (process.argv[2] == "-c") {
		clipboard.writeSync(txt);
	}
	txt = rainbow(txt);
	console.log(txt);
});

fd.pipe(hash);
