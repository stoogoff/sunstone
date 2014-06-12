utils.Font = function(name, data) {
	this.name = function() {
		return name;
	};

	this.setFont = function(text) {
		text.font = data["font"];
		text.fontSize = data["size"];

		if(this.isBold()) {
			text.fontWeight = "bold";
		}

		if(this.isItalic()) {
			console.log("italic")
			text.font += " italic";
		}
	};

	this.isBold = function() {
		return "bold" in data && data["bold"] === true;
	};

	this.isItalic = function() {
		return "italic" in data && data["italic"] === true
	};
};