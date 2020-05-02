
// keys for different actions
// these are exported individually so which actions are used can easily be seen
// at the top of the file


// maps can be created and deleted
export const MAP_CREATE = "create-map";
export const MAP_EDIT = "edit-map";
export const MAP_DELETE = "delete-map";
export const MAP_LOAD = "load-map";
export const MAP_LOAD_UPDATES = "load-map-and-update";
export const MAP_LOAD_COMPLETE = "map-load-complete";
export const MAP_SUBSCRIBE = "subscribe-map-updates";
export const MAP_UNSUBSCRIBE = "unsubscribe-map-upadtes";
export const MAP_ZOOM = "zoom-map-to";


// loading of nodes and layers
export const NODE_LOAD_COMPLETE = "node-load-complete";
export const LAYER_LOAD_COMPLETE = "layer-load-complete";
export const IMAGE_LOAD_COMPLETE = "image-load-complete";


// layers can be created and deleted, reordered and their visibility changed
export const LAYER_CREATE = "create-layer";
export const LAYER_RENAME = "rename-layer";
export const LAYER_DELETE = "delete-layer";
export const LAYER_MOVE_UP = "move-up-layer";
export const LAYER_MOVE_DOWN = "move-down-layer";
export const LAYER_SHOW = "show-layer";
export const LAYER_HIDE = "hide-layer";
export const LAYER_ACTIVATE = "activate-layer";


// nodes can be created, deleted and moved
export const NODE_CREATE = "create-node";
export const NODE_MOVE = "move-node";
export const NODE_DELETE = "delete-node";
export const NODE_DELETE_BY_IMAGE = "delete-nodes-by-image";


// images can be uploaded...
export const IMAGE_UPLOAD = "create-image";
export const IMAGE_LOAD = "load-image";
export const IMAGE_DELETE = "delete-image";
