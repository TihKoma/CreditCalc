import {
	createStore,
	combineReducers,
	applyMiddleware,
	compose,
	Action,
} from "redux";
import thunkMiddleware, { ThunkAction } from "redux-thunk";
import calcReducer from "./calc-reducer";
import { reducer as formReducer } from "redux-form";
import officeSelectionReducer from "./officeSelection-reducer";

let rootReducer = combineReducers({
	calc: calcReducer,
	officeSelection: officeSelectionReducer,
	form: formReducer
});

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;

// type PropertiesTypes<T> = T extends {[key: string]: infer U} ? U : never;
// export type InferActionsTypes<T extends {[key: string]: (...args: any) => any}> = ReturnType<PropertiesTypes<T>>;

export type InferActionsTypes<T> = T extends {
	[key: string]: (...args: any[]) => infer U;
}
	? U
	: never;

export type BaseThunkType<A extends Action, R = Promise<void>> = ThunkAction<
	R,
	AppStateType,
	unknown,
	A
>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunkMiddleware))
);

export default store;
