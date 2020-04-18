
// keys for different actions
// these are exported individually so which actions are used can easily be seen
// at the top of the file
 

//export const MAP_NAME_SET = "set-map-name";
//export const MAP_DATA = "map-data";
//export const MAP_NODES = "map-nodes";

//export const NODE_SET = "set-node";
//export const NODE_DELETE = "delete-node";


// maps can be created and deleted
export const MAP_CREATE = "create-map";
export const MAP_EDIT = "edit-map";
export const MAP_DELETE = "delete-map";
export const MAP_LOAD = "load-map";
export const MAP_LOAD_COMPLETE = "load-map-complete";

// not sure about this one
export const MAP_SELECT = "select-map";



// layers can be created and deleted, reordered and their visibility changed
export const LAYER_CREATE = "create-layer";
export const LAYER_EDIT = "edit-layer";
export const LAYER_DELETE = "delete-layer";
export const LAYER_MOVE_UP = "move-up-layer";
export const LAYER_MOVE_DOWN = "move-down-layer";
export const LAYER_SHOW = "show-layer";
export const LAYER_HIDE = "hide-layer";