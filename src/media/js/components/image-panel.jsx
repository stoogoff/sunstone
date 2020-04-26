
import React from "react";
import Dropzone from "react-dropzone";

import Expander from "./expander.jsx";
import Button from "./button.jsx";
import Icon from "./icon.jsx";
import dispatcher from "../lib/dispatcher";
import { IMAGE_UPLOAD } from "../lib/action-keys";

// enable drop zone so images can be dropped and automatically uploaded DONE
// list any uploaded images
// tell the user they can do this DONE

export default class ImagePabel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			openMenu: false,
			loading: false
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.images != this.props.images) {
			this.setState({
				loading: false
			});
		}
	}

	toggleMenu(image, event) {
		const openMenu = this.state.openMenu == image.path ? null : image.path;

		this.setState({
			openMenu: openMenu,
		});
	}

	activateImage(image) {
		if(this.props.onSelect) {
			this.props.onSelect(image);
		}
	}

	render() {
		const readFiles = files => {
			console.log(files);

			files = files.filter(file => file.type.startsWith("image/")).map(file => ({ map: this.props.map.id, file: file }));

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

			this.setState({
				loading: true
			});

			dispatcher.dispatch(IMAGE_UPLOAD, files);
		};

		//

		return <section className="image-panel">
			<Dropzone onDrop={ readFiles }>
			{ ({ getRootProps, getInputProps }) => (
				<div className="drop-zone" { ...getRootProps() }>
					<input { ...getInputProps() } />
					<p>Drop images here to upload or click to select.</p>
					<div className="is-centred"><Icon icon={ this.state.loading ? "circle-notch" : "image" } huge animated={ this.state.loading } /></div>
				</div> )}
			</Dropzone>
			{ this.props.images ? <ul className="menu">
				{ this.props.images.map(image => <li>
					<Button label={ image.name }
						warning={ this.props.activeImage == image.path }
						leftIcon={ this.state.openMenu == image.path ? "chevron-down" : "chevron-right" }
						onLeftIconClick={ this.toggleMenu.bind(this, image) }
						onClick={ this.activateImage.bind(this, image) } />
						<Expander open={ this.state.openMenu == image.path }>
							<img src={ image.url } />
						</Expander>
				</li>) }
			</ul> : null }
		</section>;
	}
}
