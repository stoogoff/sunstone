
// colours used by the colour picker tool
export const COLOURS = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#000', '#fff'];

// default name of the map if none is present
export const DEFAULT_MAP = "Map 1";

export const MAP_URL_LEN = 5;
export const NODE_ID_LEN = 5;

// keys for local storage
export const STORAGE_KEYS = {
	MAP: "sunstone-map",
	MAP_ID: "/maps/$ID$",
	MAP_NAME: "/maps/$ID$/name",
	MAP_NODES: "/maps/$ID$/nodes/$ID$"
};

// keys for different actions
export const ACTION_KEYS = {
	MAP_NAME_SET: "set-map-name",
	MAP_DATA: "map-data",

	NODE_SET: "set-node",
	NODE_DELETE: "delete-node"
};
