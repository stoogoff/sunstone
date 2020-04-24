
import { handlerCreator } from "./base";
import { storage } from "../lib/firebase";
import { IMAGE_UPLOAD } from "../lib/action-keys";


const NODE_ACTIONS = {};


NODE_ACTIONS[IMAGE_UPLOAD] = (state, payload) => {
	console.log("image upload", state, payload)

	// upload image
	// save a reference to it in the map object
	const rootRef = storage.ref("images");

	payload.forEach(item => {
		console.log("creating ref at", item.file.name)

		const imageRef = rootRef.child(item.file.name);

		imageRef.put(item.file).then((snapshot) => {
			console.log("uploaded file")
			console.log(snapshot);
		})

		/*const reader = new FileReader();

		reader.onload = (read) => {
			console.log(read.target.result)

			const imageRef = rootRef.child(item.file.name);

			imageRef.put()
		};

		reader.readAsDataURL(item.file);*/
	});
/*

// Points to the root reference
var storageRef = firebase.storage().ref();

// Points to 'images'
var imagesRef = storageRef.child('images');

// Points to 'images/space.jpg'
// Note that you can use variables to create child values
var fileName = 'space.jpg';
var spaceRef = imagesRef.child(fileName);

// File path is 'images/space.jpg'
var path = spaceRef.fullPath

// File name is 'space.jpg'
var name = spaceRef.name

// Points to 'images'
var imagesRef = spaceRef.parent;*/







	return [...state, ...payload.map(p => p.file.name)];
};

export default handlerCreator(NODE_ACTIONS);
