
import React from "react";
import Dropzone from "react-dropzone";

import Expander from "./expander.jsx";
import Button from "./button.jsx";
import Icon from "./icon.jsx";
import Modal from "./modal.jsx";
import { id, toDate } from "../lib/string";
import { toByteString } from "../lib/number";
import dispatcher from "../lib/dispatcher";
import { IMAGE_UPLOAD, IMAGE_DELETE } from "../lib/action-keys";


// TODO deleting images
export default class ImagePabel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			openMenu: false,
			loading: false,
			naturalWidth: 0,
			naturalHeight: 0,
			showDialogue: false,
			deletingImage: null,
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
		const newState = {
			openMenu: this.state.openMenu == image.path ? null : image.path
		};

		// get actual image dimensions for display
		const domNode = document.getElementById(id(image.path));

		if(domNode) {
			newState.naturalHeight = domNode.naturalHeight;
			newState.naturalWidth = domNode.naturalWidth;
		}

		this.setState(newState);
	}

	activateImage(image) {
		if(this.props.onSelect) {
			this.props.onSelect(image);
		}
	}

	hideDialogue() {
		this.setState({
			showDialogue: false
		});
	}

	displayDeleteDialogue(image) {
		this.setState({
			showDialogue: true,
			deletingImage: image
		});
	}

	deleteImage() {
		if(this.state.deletingImage) {
			dispatcher.dispatch(IMAGE_DELETE, this.state.deletingImage);

			this.hideDialogue();
		}
	}

	render() {
		const readFiles = files => {
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
						onClick={ this.activateImage.bind(this, image) } 
					/>
						<Expander open={ this.state.openMenu == image.path }>
							<figure className="image">
								<a className="delete" onClick={ this.displayDeleteDialogue.bind(this, image) }></a>
								<img id={ id(image.path) } src={ image.url } />
								<figcaption className="content is-small">
									<div><strong>Dimensions</strong> { this.state.naturalWidth } x { this.state.naturalHeight }</div>
									<div><strong>Size</strong> { toByteString(image.size) }</div>
									<div><strong>Created</strong> { toDate(image.created).toLocaleString() }</div>
									<div><strong>Updated</strong> { toDate(image.updated).toLocaleString() }</div>
								</figcaption>
							</figure>
						</Expander>
				</li>) }
			</ul> : null }
			<Modal active={ this.state.showDialogue } title="Delete Image" closable close={ this.hideDialogue.bind(this) }>
				<p>Are you sure you want to delete this image? This action can't be undone.</p>
				<Button label="OK" onClick={ this.deleteImage.bind(this) } />
				<Button label="Cancel" onClick={ this.hideDialogue.bind(this) } />
			</Modal>
		</section>;
	}
}
