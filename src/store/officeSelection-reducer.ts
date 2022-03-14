import { BaseThunkType, InferActionsTypes } from "./store";

type officesListResponseType = {
	Address: any,
	AutoInsurServiceTypeId: number,
	City: string,
	HasChildren: boolean,
	INN: string,
	Id: number,
	IsAutoShop: boolean,
	IsCity: boolean,
	IsLiteClaimAvailable: boolean,
	IsRestricted: number,
	LifeInsurServiceTypeId: number,
	MoscowRegion: number,
	Name: string,
	OfficeString: string,
	Options: string,
	ParentId: number | null,
	PartnerTypeId: number,
	Phone: number | null,
	RoadAsistServiceTypeId: number,
	YandexRegionId: number,
	ispartnercrossavailable: number
};

type productsResponseType = {
	AutoInsurServiceTypeId: any,
	AvailabilityRestrict: number,
	Id: number,
	IsRestricted: boolean,
	Joined: boolean,
	LifeInsurServiceTypeId: any,
	Name: string,
	RoadAsistServiceTypeId: any
};

export type productType = {
	productId: number,
	name: string
};

export type officeType = {
	officeId: number,
	name: string,
	isLiteClaim: boolean
};


const initialState = {
	officesList: [] as officeType[],
	productsList: [] as productType[],

	officeId: null as number | null,
	productId: null as number | null
};

const officeSelectionReducer = (state = initialState, action: ActionsType): InitialStateType => {
	switch (action.type) {
		case 'APP/OFFICE_SELECTION/SET_OFFICES_LIST':
			return {
				...state,
				officesList: action.officesList
			};

		case 'APP/OFFICE_SELECTION/SET_PRODUCTS_LIST':
			return {
				...state,
				productsList: action.productsList
			};

		case 'APP/OFFICE_SELECTION/SET_OFFICE_ID':
			return {
				...state,
				officeId: action.officeId
			};

		case 'APP/OFFICE_SELECTION/SET_PRODUCT_ID':
			return {
				...state,
				productId: action.productId
			};

		default:
			return state;
	};
};

export const actions = {
	setOfficesList: (officesList: officeType[]) => ({ type: 'APP/OFFICE_SELECTION/SET_OFFICES_LIST', officesList } as const),
	setProductsList: (productsList: productType[]) => ({ type: 'APP/OFFICE_SELECTION/SET_PRODUCTS_LIST', productsList } as const),
	setOfficeId: (officeId: number | null) => ({ type: 'APP/OFFICE_SELECTION/SET_OFFICE_ID', officeId } as const),
	setProductId: (productId: number | null) => ({ type: 'APP/OFFICE_SELECTION/SET_PRODUCT_ID', productId } as const),
};


// Thunk Creator

export const getOfficesList = (): ThunkType => async (dispatch, getState) => {
	const officesListResponse: officesListResponseType[] = await fetch(`/Office/GetLeafOffices4Creation`, {
		method: "POST",
		headers: {
			'dataType': 'json',
			'Content-Type': 'application/json; charset=utf-8'
		}
	}).then((data) => handleResponse(data));

	const officesList = officesListResponse.map((office) => {
		return {
			officeId: office.Id,
			name: office.Name,
			isLiteClaim: office.IsLiteClaimAvailable
		};
	});

	dispatch(actions.setOfficesList(officesList));
	dispatch(actions.setOfficeId(officesList[0].officeId));

	if (officesList.length === 1) {
		dispatch(getProductsByOffice(officesList[0].officeId));
	};
};

export const officeSelected = (officeId: number | null): ThunkType => async (dispatch, getState) => {
	dispatch(actions.setOfficeId(officeId));
	if (officeId)
		dispatch(getProductsByOffice(officeId));
	else {
		dispatch(actions.setProductsList([]));
		dispatch(actions.setProductId(null));
	};

};

export const getProductsByOffice = (officeId: number): ThunkType => async (dispatch, getState) => {
	const productsResponse: productsResponseType[] = await fetch(`/Office/LoadProductsByOffice`, {
		method: "POST",
		headers: {
			'dataType': 'json',
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify({ 'id': officeId })
	}).then((data) => handleResponse(data));

	const productsList = productsResponse.map((product) => {
		return {
			productId: product.Id,
			name: product.Name
		};
	}) || [];

	dispatch(actions.setProductsList(productsList));
	dispatch(actions.setProductId(productsList[0]?.productId));
	// if (productsList.length === 1 && getState().officeSelection.officesList.length === 1)
	// 	dispatch(redirectToCreateClaim());
};


export const redirectToCreateClaim = (): ThunkType => async (dispatch, getState) => {
	const officeId = getState().officeSelection.officeId;
	const productId = getState().officeSelection.productId;
	const isLiteClaim = getState().officeSelection.officesList.find((item, index) => (officeId === item.officeId))?.isLiteClaim;

	const carCost = getState().calc.formData.priceVehicle;
	const initialFee = getState().calc.formData.initPay;
	const isNew = (getState().calc.formData.vehicleType == "new") ? true : false;
	const creditTerm = getState().calc.formData.creditTerm;
	const insuranceCost = getState().calc.resRequestedCond.insuranceSum;
	const dischargePFR = getState().calc.formData.certificatePFR || false;

	const switcher = isLiteClaim ? 'LiteClaim' : 'Claim';
	window.location.href = `/${switcher}/Create?productType=${productId}&officeId=${officeId}&carCost=${carCost}&initialFee=${initialFee}&isNew=${isNew}&creditTerm=${creditTerm}&insuranceCost=${insuranceCost}&dischargePFR=${dischargePFR}`;
};


// carCost; число    // Стоимость ТС
// initialFee; число  // Первоначальный взнос
// isNew; булин     //Новое или БУ
// creditTerm; число //Срок кредита в месяцах
// insuranceCost; число  //Сумма страховки
// dischargePFR; булин 

// export const auth = (): ThunkType => async (dispatch, getState) => {
// 	var authToken = getState().wschat.authToken;
// 	let login = getState().wschat.login;
// 	let pwd = getState().wschat.pwd;
// 	let isAuthDataChanged = getState().wschat.isAuthDataChanged;

// 	if (authToken === '' && login === '' && pwd === '')
// 		return;

// 	if (authToken === '' || isAuthDataChanged) {
// 		try {
// 			let response = await fetch(`/Account/LogOn/?login=${login}&pwd=${pwd}`, {
// 				method: "GET",
// 				headers: {
// 					'Access-Control-Allow-Origin': "*",
// 					"Accept": "application/json",
// 					'Content-Type': 'text/plain'
// 				}
// 			}).then((data) => handleResponse(data));
// 			authToken = response.headers['set-cookie'][1].split(';')[0].replace('.pipiline=', '');
// 		} catch (err) {
// 			alert("Ошибка авторизации");
// 			console.log(err);
// 			dispatch(actions.setIsLogonLoading(false));
// 			return;
// 		};
// 	};


// 	let cookieValidate;
// 	try {
// 		cookieValidate = await fetch(`/Account/ExplainCookie/?cookie=${authToken}`, {
// 			method: "GET",
// 			headers: {
// 				'Access-Control-Allow-Origin': "*",
// 				"Accept": "application/json",
// 				'Content-Type': 'text/plain'
// 			}
// 		}).then((data) => handleResponse(data));
// 	} catch (err) {
// 		alert("Ошибка при валидации authToken");
// 		console.log(err);
// 		dispatch(actions.setIsLogonLoading(false));
// 		return;
// 	};

// 	dispatch(actions.changeAuthToken(authToken));
// 	dispatch(actions.changeUserName(cookieValidate.Name));
// 	setCookie('.pipiline', authToken);
// 	dispatch(actions.setIsLogonLoading(false));
// };





function handleResponse(response: Response) {
	return response.json().then((json) => {
		if (!response.ok) {
			const error = {
				data: json,
				status: response.status,
				statusText: response.statusText,
			};
			return Promise.reject(error);
		}
		return json;
	});
}


export default officeSelectionReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
export type ThunkType = BaseThunkType<ActionsType>;