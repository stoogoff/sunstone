
utils.Map = function(id) {
	var map = new Firebase("https://we-evolve-sunstone.firebaseio.com/maps/" + id);

	this.load = function() {
		console.log("loading...");

		map.on("child_added", function(snapshot) {
			var data = snapshot.val();

			console.log("child_add fired");
			console.log(data);

			if(_.isObject(data))
				io.importJSON(snapshot.val());

			// TODO doesn't update display unless an event fires
		});
	};

	this.setBackground = function(background) {
		console.log("setting background to '" + background + "'");

		var node = map.child("data/background");

		node.set(utils.toId(background));
	};

	this.addPath = function(layer, path) {
		var data = {};

		data["closed"] = path.closed;
		data["strokeWidth"] = path.strokeWidth;
		data["segments"] = [];

		path.segments.forEach(function(segment) {
			data["segments"].push({
				"x": segment.point.x,
				"y": segment.point.y
			})
		});

		// add smoothing or not
		if(path.closed)
			data["smooth"] = path.firstSegment.linear !== true;

		return this.addObject(layer, data);
	};

	this.addObject = function(layer, data) {
		console.log("adding object to '" + layer + "'");
		console.log(data);

		var layer = map.child("data/layers/" + layer);
		var key = layer.push(data).key();

		console.log("retrieved new key '" + key + "'");

		return key;
	};

	this.removeObject = function(layer, id) {
		console.log("removing '" + id + "' from '" + layer + "'");

		map.child("data/layers/" + layer + "/" + id).remove();
	};

	this.moveObject = function(layer, id, position) {
		// TODO problem with moving paths
		console.log("moving '" + id + "' on '" + layer + "'");
		console.log(position);

		var x = map.child("data/layers/" + layer + "/" + id + "/x");
		var y = map.child("data/layers/" + layer + "/" + id + "/y");

		x.set(position.x);
		y.set(position.y);
	};
};