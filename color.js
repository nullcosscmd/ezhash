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
		case "brightunderline":
			return "\x1b[1m" + "\x1b[4m";
	}
}

module.exports = { color };
