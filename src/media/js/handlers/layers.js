
import { create, editById, deleteById, moveUpById, moveDownById, handlerCreator } from "./base";
import { LAYER_CREATE, LAYER_EDIT, LAYER_DELETE, LAYER_MOVE_UP, LAYER_MOVE_DOWN } from "../lib/action-keys";


const LAYER_ACTIONS = {
	[LAYER_CREATE]: create,
	[LAYER_EDIT]: editById,
	[LAYER_DELETE]: deleteById,
	[LAYER_MOVE_UP]: moveUpById,
	[LAYER_MOVE_DOWN]: moveDownById
};


export default handlerCreator(LAYER_ACTIONS);
