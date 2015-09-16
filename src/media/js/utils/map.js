
utils.Map = function(id) {
	console.log("preparing map with id '" + id + "'")

	var map = new Firebase("https://we-evolve-sunstone.firebaseio.com/maps/" + id);

	this.load = function(callback) {
		console.log("loading...");

		map.once("value", function(snapshot) {
			var data = snapshot.val();

			console.log("value fired");
			console.log(data);

			if(_.isFunction(callback))
				callback(data);
		});

		/*map.on("child_added", function(snapshot) {
			var data = snapshot.val();

			console.log("child_added fired");
			console.log(data);

			if(!_.isObject(data))
				return;

			if("layers" in data)
				io.importJSON(snapshot.val());
			else {
				console.log("single object")
			}

			// TODO doesn't update display unless an event fires
		});*/
	};

	this.setBackground = function(background) {
		return this.setNode("background", utils.toId(background));
	};

	this.setName = function(name) {
		return this.setNode("name", name);
	};

	this.setNode = function(node, content) {
		console.log("setting node '" + node + "' to '" + content + "'");

		var node = map.child(node);

		return node.set(content);
	};

	this.removeNode = function(node) {
		console.log("removing '" + node + "'");

		map.child(node).remove();
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

	this.setPathSegments = function(layer, path) {
		var segments = [];

		path.segments.forEach(function(segment) {
			segments.push({
				"x": segment.point.x,
				"y": segment.point.y
			});
		});

		return this.setNode("layers/" + layer + "/" + path.name + "/segments", segments);
	};

	this.addObject = function(layer, data) {
		console.log("adding object to '" + layer + "'");
		console.log(data);

		var layer = map.child("layers/" + layer);
		var key = layer.push(data).key();

		console.log("retrieved new key '" + key + "'");

		return key;
	};

	this.removeObject = function(layer, id) {
		console.log("removing '" + id + "' from '" + layer + "'");

		map.child("layers/" + layer + "/" + id).remove();
	};

	this.moveObject = function(layer, obj) {
		// TODO problem with moving paths
		console.log("moving '" + obj.name + "' on '" + layer + "'");
		console.log(obj.position);

		// moving paths involves moving each of the segments, not adjusting the xy co-ordinates of the object
		if(obj.constructor === paper.Path) {
			this.setPathSegments(layer, obj);
		}
		else {
			["x", "y"].forEach(function(i) {
				var node = map.child("layers/" + layer + "/" + obj.name + "/" + i);

				node.set(obj.position[i]);
			});
		}
	};

	this.updateObject = function(layer, id, data) {
		console.log("updating '" + id + "' on '" + layer + "'");
		console.log(data);

		var node = map.child("layers/" + layer + "/" + id);

		node.set(data);
	};
};