
// colours used by the colour picker tool
export const COLOURS = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#000', '#fff'];

// default name of the map or layer if none is present
export const DEFAULT_MAP = "Map 1";
export const DEFAULT_LAYER = "Layer 1";

export const MAP_URL_LEN = 5;

export const MODE = {
	VIEW: "view",
	EDIT: "edit"
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

// keys for different actions
export const ACTION_KEYS = {
	MAP_NAME_SET: "set-map-name",
	MAP_DATA: "map-data",
	MAP_NODES: "map-nodes",

	NODE_SET: "set-node",
	NODE_DELETE: "delete-node",

	LAYER_SET: "set-layer",
	LAYER_DELETE: "delete-layer"
};
