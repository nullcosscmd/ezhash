#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const clipboard = require("clipboardy");
const color = require("./color").color;

function rainbow(input) {
	input = input.match(/.{1,3}/g);
	let colorTxt = color("underline") + color("bright");
	let index = 0;
	let colors = ["magenta", "cyan", "green", "red"];
	for (let i = 0; i < input.length; i++) {
		const snip = input[i];
		if (index == 3) {
			index = 1;
			colorTxt = colorTxt + color(colors[index]);
		} else {
			index++;
			colorTxt = colorTxt + color(colors[index]);
		}
		colorTxt = colorTxt + snip;
	}
	colorTxt = colorTxt + color("reset");
	return colorTxt;
}

if (!process.argv[2]) {
	console.log(color("red") + "Please input a file directory!");
	return 0;
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
