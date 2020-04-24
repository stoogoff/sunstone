
import React from "react";
import Dropzone from "react-dropzone";

import Icon from "./icon.jsx";
import dispatcher from "../lib/dispatcher";
import { IMAGE_UPLOAD } from "../lib/action-keys";

// enable drop zone so images can be dropped and automatically uploaded DONE
// list any uploaded images
// tell the user they can do this DONE

export default (props) => {
	const readFiles = files => {
		console.log(files);

		files = files.filter(file => file.type.startsWith("image/")).map(file => ({ map: props.map.id, file: file }));

/*

sample file data

lastModified: 1587416283000
lastModifiedDate: Mon Apr 20 2020 21:58:03 GMT+0100 (British Summer Time) {}
name: "star-wars-backgrounds-12-1.jpg"
path: "star-wars-backgrounds-12-1.jpg"
size: 371746
type: "image/jpeg"
webkitRelativePath: ""

*/


		dispatcher.dispatch(IMAGE_UPLOAD, files);
	};

	return <section className="image-panel">
		<Dropzone onDrop={ readFiles }>
		{ ({ getRootProps, getInputProps }) => (
			<div className="drop-zone" { ...getRootProps() }>
				<input { ...getInputProps() } />
				<p>Drop images here to upload or click to select.</p>
				<div className="is-centred"><Icon icon="image" huge /></div>
			</div> )}
		</Dropzone>
		{ props.images ? <ul className="menu">
			{ props.images.map(image => <li>{ image }</li>) }
		</ul> : null }
	</section>;
};
