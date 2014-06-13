utils.Font = function(name, data) {
	this.name = function() {
		return name;
	};

	this.setFont = function(text) {
		text.font = data["font"];
		text.fontSize = data["size"];

		if(this.bold()) {
			text.fontWeight = "bold";
		}

		if(this.italic()) {
			// NOTE this doesn't work
			console.log("italic")
			text.font = "italic " + text.font;
		}

		if(this.colour()) {
			text.fillColor = data["colour"];
		}

		if(this.outline()) {
			// should this be part of the theme?
			text.strokeWidth = data["outline"].width;
			text.strokeColor = data["outline"].colour;
		}

		if(this.shadow()) {
			text.shadowColor = config.SHADOW.COLOUR;
			text.shadowBlur = config.SHADOW.BLUR;
			text.shadowOffset = config.SHADOW.OFFSET;
		}
	};

	// set up methods for optional properties
	var properties = ["bold", "italic", "outline", "shadow", "colour"];

	for(var i = 0, len = properties.length; i < len; ++i) {
		this[properties[i]] = (function(property) {
			return function() {
				if(property in data)
					return data[property];

				return false;
			};
		})(properties[i]);
	}
};