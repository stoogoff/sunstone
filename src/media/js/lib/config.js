
// colours used by the colour picker tool
export const COLOURS = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#000', '#FFF'];


// default name of the map or layer if none is present
export const DEFAULT_MAP = "Map 1";
export const DEFAULT_LAYER = "Layer 1";


// the state the app is in, which dictates what actions can be performed
export const MODE = {
	VIEW: "view",
	EDIT: "edit"
};


// icon names which unfortunately have to be used as actions
export const ICON = {
	VISIBLE: "eye",
	HIDDEN: "eye-slash",
	MORE: "ellipsis-v"
};

// layer visibility
export const VISIBILITY = {
	HIDDEN: 0.3,
	VISIBLE: 1
};

// keys for local storage
export const STORAGE_KEYS = {
	MAP_LOCAL: "sunstone-map",
	MAP_ROOT: "/maps",
	MAP_ID: "/maps/$ID$",
	MAP_NAME: "/maps/$ID$/name",
	NODE: "/maps/$ID$/nodes/$ID$",
	LAYER: "/maps/$ID$/layers/$ID$",
	LAYER_VISIBLE: "/maps/$ID$/layers/$ID$/visible",
};
