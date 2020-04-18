
// colours used by the colour picker tool
export const COLOURS = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#000', '#fff'];


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
	VISIBLE: "visibility",
	HIDDEN: "visibility_off",
	MORE: "more_vert"
};


// keys for local storage
export const STORAGE_KEYS = {
	MAP_LOCAL: "sunstone-map",
	MAP_ROOT: "/maps",
	MAP_ID: "/maps/$ID$",
	MAP_NAME: "/maps/$ID$/name",
	MAP_NODES: "/maps/$ID$/nodes/$ID$",
	MAP_LAYERS: "/maps/$ID$/layers/$ID$",
};
