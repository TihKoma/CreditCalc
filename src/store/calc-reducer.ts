import { BaseThunkType, InferActionsTypes } from "./store";
import config from "./../config.json";

export type stageCalcType = 'NOT_INIT' | 'LOADING' | 'COMPLETED';
type creditTermType = 24 | 36 | 48 | 60 | 72 | 84 | 96; // Возможные сроки кредита
// type vehicleType = 'usedWithCross' | 'usedWithoutCross' | 'newWithCross' | 'newWithoutCross';
type vehicleType = 'new' | 'used';


export interface formDataType {
	priceVehicle: number,		// Стоимость ТС
	initPay: number,			// Первоначальный взнос
	vehicleType: vehicleType,
	creditTerm: creditTermType,	// Срок кредита
	insurance: boolean,			// Страховка
	certificatePFR: boolean		// Справка из ПФР
};

export type resultType = {
	creditSum: number, 			// Сумма кредита
	monthPay: number,			// Ежемесячный платеж
	creditTerm: creditTermType,	// Срок кредита
	creditRate: number,			// Ставка по кредиту
	initPay: number,			// Первоначальный взнос
	initPayPercent: number,		// Первоначальный взнос в процентах
	insuranceSum: number		// Сумма страховки
};

const initialState = {
	stageCalc: 'NOT_INIT' as stageCalcType,
	resRequestedCond: {} as resultType,		// запрошенные условия
	resExtendedTimeCond: {} as resultType,	// увеличен срок
	resDownCreditRate: {} as resultType,	// пониженная кредитная ставка
	formData: {} as formDataType,			// Входные данные из формы
	callCounter: 0,							// Счетчик вызовов функции calculate

	creditTerm_referenceList: config.creditTerm_referenceList as creditTermType[], 	// список возможных сроков кредита
	creditPart_referenceList: config.creditPart_referenceList,						// справочное значение кредитной части (от и до)
	insuranceRate: config.insuranceRate,											// тариф страховки

	insuranceTerm_referenceList: [] as number[][],		// конечный ассоциативный массив значений срока страховки ([кредитная часть][срок кредита] = срок страховки)
	insuranceTerm_values: config.insuranceTerm_values, 	// массив значений срока страховки

	initPay_referenceList: config.initPay_referenceList,
	creditRate_referenceList: [] as number[][],			// кредитная ставка

	creditRate_values: config.creditRate_values,
	minInitPay_referenceList: config.minInitPay_referenceList




	// creditTerm_referenceList: [24, 36, 48, 60, 72, 84, 96] as creditTermType[], // список возможных сроков кредита
	// creditPart_referenceList: [													// справочное значение кредитной части (от и до)
	// 	[0, 99999],
	// 	[100000, 199999],
	// 	[200000, 299999],
	// 	[300000, 399999],
	// 	[400000, 499999],
	// 	[500000, 599999],
	// 	[600000, 699999],
	// 	[700000, 799999],
	// 	[800000, 899999],
	// 	[900000, 999999],
	// 	[1000000, 1099999],
	// 	[1100000, 1199999],
	// 	[1200000, 1299999],
	// 	[1300000, 1399999],
	// 	[1400000, 1499999],
	// 	[1500000, 1999999],
	// 	[2000000, 2499999],
	// 	[2500000, 2999999],
	// 	[3000000, 3499999],
	// 	[3500000, 3999999],
	// 	[4000000, 4500000],
	// ],
	// insuranceRate: 0.00375,							// тариф страховки
	// insuranceTerm_values: [ 						// массив значений срока страховки
	// 	[18, 36, 42, 60, 60, 60, 60],
	// 	[16, 30, 42, 48, 48, 48, 48],
	// 	[15, 21, 25, 33, 34, 34, 34],
	// 	[15, 21, 25, 25, 26, 26, 26],
	// 	[15, 19, 21, 21, 21, 21, 21],
	// 	[12, 18, 18, 18, 18, 18, 18],
	// 	[12, 16, 16, 16, 16, 16, 16],
	// 	[12, 14, 14, 14, 14, 14, 14],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12],
	// 	[12, 12, 12, 12, 12, 12, 12]
	// ],


	// initPay_referenceList: [
	// 	[0, 14.99],
	// 	[15, 29.99],
	// 	[30, 49.99],
	// 	[50, 99.99]
	// ],
	// creditRate_values: [
	// 	[12.7, 15.9, 17, 21.5],
	// 	[12.5, 15.5, 16.5, 21],
	// 	[12, 15, 16, 20.5],
	// 	[11.5, 14.5, 15.5, 20]
	// ],

	// minInitPay_referenceList: [
	// 	[0, 1500000, 0],
	// 	[1500001, 2000000, 10],
	// 	[2000001, 4500000, 30]
	// ]

};

const calcReducer = (state = initialState, action: ActionsType): InitialStateType => {
	switch (action.type) {
		case 'APP/CALC/SET_STAGE_CALC':
			return {
				...state,
				stageCalc: action.stageCalc
			};

		case 'APP/CALC/SET_INSURANCE_TERM_REFERENCE_LIST':
			return {
				...state,
				insuranceTerm_referenceList: action.insuranceTerm_referenceList
			};

		case 'APP/CALC/SET_CREDIT_RATE_REFERENCE_LIST':
			return {
				...state,
				creditRate_referenceList: action.creditRate_referenceList
			};

		case 'APP/CALC/SET_RES_REQUEST_COND':
			return {
				...state,
				resRequestedCond: action.resRequestedCond
			};

		case 'APP/CALC/SET_RES_EXTENDED_TIME_COND':
			return {
				...state,
				resExtendedTimeCond: action.resExtendedTimeCond
			};

		case 'APP/CALC/SET_RES_DOWN_CREDIT_RATE':
			return {
				...state,
				resDownCreditRate: action.resDownCreditRate
			};

		case 'APP/CALC/SET_FORM_DATA':
			return {
				...state,
				formData: action.formData
			};

		case 'APP/CALC/SET_CALL_COUNTER':
			return {
				...state,
				callCounter: action.callCounter
			};

		default:
			return state;
	};
};

export const actions = {
	setStageCalc: (stageCalc: stageCalcType) => ({ type: 'APP/CALC/SET_STAGE_CALC', stageCalc } as const),
	setInsuranceTerm_referenceList: (insuranceTerm_referenceList: number[][]) => ({ type: 'APP/CALC/SET_INSURANCE_TERM_REFERENCE_LIST', insuranceTerm_referenceList } as const),
	setCreditRate_referenceList: (creditRate_referenceList: any[]) => ({ type: 'APP/CALC/SET_CREDIT_RATE_REFERENCE_LIST', creditRate_referenceList } as const),
	setResRequestedCond: (resRequestedCond: resultType) => ({ type: 'APP/CALC/SET_RES_REQUEST_COND', resRequestedCond } as const),
	setExtendedTimeCond: (resExtendedTimeCond: resultType) => ({ type: 'APP/CALC/SET_RES_EXTENDED_TIME_COND', resExtendedTimeCond } as const),
	setResDownCreditRate: (resDownCreditRate: resultType) => ({ type: 'APP/CALC/SET_RES_DOWN_CREDIT_RATE', resDownCreditRate } as const),
	setFormData: (formData: formDataType) => ({ type: 'APP/CALC/SET_FORM_DATA', formData } as const),
	setCallCounter: (callCounter: number) => ({ type: 'APP/CALC/SET_CALL_COUNTER', callCounter } as const),
};


// Thunk Creator

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const awaitCalc = (): ThunkType => async (dispatch, getState) => {
	await sleep(1000);
};

let callCounter = 0;
export const calculate = (formData: formDataType): ThunkType => async (dispatch, getState) => {
	// console.log(formData);
	callCounter++;
	
	formData = {
		...formData,
		//@ts-ignore
		priceVehicle: +(formData.priceVehicle || '').replace(/\s+/g, ''),
		//@ts-ignore
		initPay: +(formData.initPay || '').replace(/\s+/g, '')
	};

	let creditPart, creditTerm: creditTermType;

	creditPart = +formData.priceVehicle - +formData.initPay; 	// Кредитная часть
	creditTerm = formData.creditTerm || 24;					// Срок кредита

	let creditPart_referenceList = getState().calc.creditPart_referenceList;
	let creditTerm_referenceList = getState().calc.creditTerm_referenceList;
	let insuranceTerm_values = getState().calc.insuranceTerm_values;

	let insuranceTerm_referenceList = getState().calc.insuranceTerm_referenceList;
	let insuranceRate = getState().calc.insuranceRate;

	let creditRate_referenceList = getState().calc.creditRate_referenceList;
	let initPay_referenceList = getState().calc.initPay_referenceList;
	let creditRate_values = getState().calc.creditRate_values;



	try {
		dispatch(actions.setStageCalc('LOADING'));

		await sleep(1000);
		
		if (callCounter > 1) {
			callCounter--;
			return;
		};

		//@ts-ignore
		// console.log(getState().form.calcFields.syncErrors);
		if (getState().form.calcFields.syncErrors) {
			callCounter--;
			dispatch(actions.setStageCalc('NOT_INIT'));
			return;
		};


		// if (!formData.priceVehicle || !formData.initPay || !formData.vehicleType)
		// 	throw ('Поля не заполнены');

		if (insuranceTerm_referenceList.length === 0) {
			let res = insuranceTerm_referenceList = init_insuranceTerm_referenceList(creditPart_referenceList, creditTerm_referenceList, insuranceTerm_values);
			dispatch(actions.setInsuranceTerm_referenceList(res));
		};

		if (creditRate_referenceList.length === 0) {
			let res = creditRate_referenceList = init_creditRate_referenceList(initPay_referenceList, creditRate_values);
			dispatch(actions.setCreditRate_referenceList(res));
		};

		const inputDataRequestedCond: inputData = {
			...formData,
			creditPart,
			creditTerm,
			creditPart_referenceList,
			insuranceTerm_referenceList,
			insuranceRate,
			initPay_referenceList,
			creditRate_referenceList
		};
		const resRequestedCond = getCreditConditions(inputDataRequestedCond);
		dispatch(actions.setResRequestedCond(resRequestedCond));



		const inputDataExtendedTime: inputData = {
			...inputDataRequestedCond,
			creditTerm: 96
		};
		const resExtendedTime = getCreditConditions(inputDataExtendedTime);
		dispatch(actions.setExtendedTimeCond(resExtendedTime));



		let initPayPercent = +formData.initPay / +formData.priceVehicle * 100;
		// initPayPercent = Math.round(initPayPercent*100)/100;
		const i = initPay_referenceList.findIndex((range) => {
			if ((range[0] <= initPayPercent) && (initPayPercent < range[1]))
				return true;
		});
		// if (initPay_referenceList[i + 1] === undefined)
		// throw('Ошибка. Следующая ступень % не определена (уменьшенная ставка по кредиту)');

		let initPay = formData.initPay;
		if (initPay_referenceList[i + 1] !== undefined) {
			initPayPercent = initPay_referenceList[i + 1][0];
			initPay = initPayPercent * (+formData.priceVehicle) / 100;
		};
		// initPayPercent = (initPay_referenceList[i + 1] === undefined) ? initPayPercent : initPay_referenceList[i + 1][0];
		// const initPay = initPayPercent * (+formData.priceVehicle) / 100;

		const inputDataDownCreditRate: inputData = {
			...inputDataRequestedCond,
			initPay,
			creditPart: formData.priceVehicle - initPay
		};
		const resDownCreditRate = getCreditConditions(inputDataDownCreditRate);
		dispatch(actions.setResDownCreditRate(resDownCreditRate));



		callCounter--;
		// console.log('Значение после расчета - ' + callCounter);
		dispatch(actions.setFormData(formData));
		dispatch(actions.setStageCalc('COMPLETED'));
	} catch (err) {
		alert(err);
		console.error(err);
		dispatch(actions.setStageCalc('NOT_INIT'));
	};


	// insuranceTerm = formData.creditTerm


};

interface inputData extends formDataType {
	creditPart: number,
	creditTerm: creditTermType,
	creditPart_referenceList: number[][],
	// creditTerm_referenceList: number[][],
	insuranceTerm_referenceList: number[][],
	insuranceRate: number,
	initPay_referenceList: number[][],
	creditRate_referenceList: number[][]
};

const getCreditConditions = (data: inputData) => {
	let insuranceSum, insuranceTerm, creditSum, initPayPercent, creditRate, monthPay;

	insuranceTerm = getInsuranceTerm(data.creditPart, data.creditTerm, data.creditPart_referenceList, data.insuranceTerm_referenceList);
	insuranceSum = (!data.insurance) ? 0 : data.creditPart * (1 / (1 - data.insuranceRate * insuranceTerm) - 1);

	creditSum = data.creditPart + insuranceSum;
	initPayPercent = data.initPay / data.priceVehicle * 100;


	creditRate = getCreditRate(initPayPercent, data.vehicleType, data.insurance, data.initPay_referenceList, data.creditRate_referenceList);
	creditRate -= (data.certificatePFR && creditSum < 1500000) ? 1 : 0;
	creditRate /= 100;

	monthPay = (creditSum * creditRate / 12) / (1 - Math.pow((1 + creditRate / 12), -1 * data.creditTerm));
	// console.log(monthPay);

	// console.log(creditSum);
	// console.log(creditRate);
	// console.log(data.creditTerm);

	let resRequestedCond: resultType = {
		creditSum,
		creditTerm: data.creditTerm,
		initPay: data.initPay,
		initPayPercent,
		creditRate: creditRate * 100,
		monthPay,
		insuranceSum
	};
	return resRequestedCond;
};

const getCreditRate = (initPayPercent: number, vehicleType: vehicleType, insurance: boolean, initPay_referenceList: number[][], creditRate_referenceList: any[]) => {
	// initPayPercent = Math.round(initPayPercent*100)/100;
	initPayPercent = Math.trunc(initPayPercent*100)/100;
	let index = initPay_referenceList.findIndex((rangeValues) => {
		if ((rangeValues[0] <= initPayPercent) && (initPayPercent < rangeValues[1]))
			return true;
	});

	if (index < 0)
		throw ('ПВ (в %) выходит за рамки диапазона');

	let insuranceStr = insurance ? 'withCross' : 'withoutCross';

	return creditRate_referenceList[index][vehicleType][insuranceStr];
};


const init_creditRate_referenceList = (initPay_referenceList: number[][], creditRate_values: number[][]) => {
	let creditRate_referenceList: any[] = [];

	for (let i = 0; i < initPay_referenceList.length; i++) {
		creditRate_referenceList[i] = [];
		creditRate_referenceList[i]['new'] = {
			withCross: creditRate_values[i][0],
			withoutCross: creditRate_values[i][1]
		};
		creditRate_referenceList[i]['used'] = {
			withCross: creditRate_values[i][2],
			withoutCross: creditRate_values[i][3]
		};
	};
	// console.log('####____________#####');
	// console.log(creditRate_referenceList);

	return creditRate_referenceList;
};

// инициализация ассоциативного массива со сроками страховки
type init_insuranceTerm_referenceListType = (creditPart_referenceList: number[][], creditTerm_referenceList: creditTermType[], insuranceTerm_values: number[][]) => number[][];

const init_insuranceTerm_referenceList: init_insuranceTerm_referenceListType = (creditPart_referenceList, creditTerm_referenceList, insuranceTerm_values) => {
	let insuranceTerm_referenceList: number[][] = []; // Ассоциативный массив значений срока страховки

	for (let i = 0; i < creditPart_referenceList.length; i++) {
		insuranceTerm_referenceList[i] = [];
		for (let j = 0; j < creditTerm_referenceList.length; j++) {
			insuranceTerm_referenceList[i][creditTerm_referenceList[j]] = insuranceTerm_values[i][j];
		};
	}
	// console.log(insuranceTerm_referenceList);
	return insuranceTerm_referenceList;
};


// получить срок страховки по справочнику insuranceTerm_referenceList
type getInsuranceTermType = (creditPart: number, creditTerm: number, creditPart_referenceList: number[][], insuranceTerm_referenceList: number[][]) => number;

const getInsuranceTerm: getInsuranceTermType = (creditPart, creditTerm, creditPart_referenceList, insuranceTerm_referenceList) => {
	const index = creditPart_referenceList.findIndex((rangeValues) => {
		// console.log(rangeValues);
		if ((rangeValues[0] <= creditPart) && (creditPart <= rangeValues[1]))
			return true;
	});

	if (index < 0)
		throw ('Ошибка. Кредитная часть выходит за рамки диапазона');

	// console.log(index);
	// console.log(creditTerm);
	return insuranceTerm_referenceList[index][creditTerm];
};

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

export const getMinInitPay = (priceVehicle: number) => {
	const minInitPay_referenceList = config.minInitPay_referenceList;

	let index = minInitPay_referenceList.findIndex((arrange) => {
		if ((arrange[0] <= priceVehicle) && (priceVehicle <= arrange[1]))
			return true;
	});

	let deltaSum = 0; // Разница между введеной суммой ТС и максимальным кредитом
	if (index < 0) {
		index = minInitPay_referenceList.length - 1;
		deltaSum = priceVehicle - minInitPay_referenceList[index][1];
		priceVehicle -= deltaSum;
	};

	// Расчет первого варианта ПВ
	const upperPayLimitPercent = minInitPay_referenceList[index][2]; 									 // Верхний порог данного диапазона (%)
	let minInitPayPercent = upperPayLimitPercent - getPercentByValue(+priceVehicle + deltaSum, deltaSum); // Сколько в % нужно добавить к deltaSum, чтобы достичь верхнего порога
	minInitPayPercent = (minInitPayPercent > 0) ? minInitPayPercent : 0;						 // Если введеный ПВ превышает верхний порог, то сумму ПВ не меняем (+0%)
	const minInitPay = deltaSum + getValueByPercent(+priceVehicle + deltaSum, minInitPayPercent); // Сумма по текущему диапазону

	// Расчет второго варианта ПВ
	index = (index > 0) ? index - 1 : index; // диапазон на порядок ниже

	let upperPayLimit2 = minInitPay_referenceList[index][1]; 			// Верхний порог уменьшенного диапазона (сумма)
	const upperPayLimit2Percent = minInitPay_referenceList[index][2]; 	// Верхний порог уменьшенного диапазона (%)

	let delta = priceVehicle - upperPayLimit2;
	delta = (delta < 0) ? 0 : delta;

	let minInitPay2Percent = upperPayLimit2Percent - getPercentByValue(+priceVehicle + deltaSum, deltaSum); // Аналогично с minInitPayPercent
	minInitPay2Percent = (minInitPay2Percent > 0) ? minInitPay2Percent : 0;
	const reducedAmount = getValueByPercent(upperPayLimit2, minInitPay2Percent); 	// Сумма по сниженному диапазону
	const minInitPay2 = deltaSum + delta + reducedAmount; 							// Итоговый второй вариант ПВ

	return min(+minInitPay, +minInitPay2);
	
	// console.log('1 вариант: ' + minInitPay);
	// console.log('2 вариант: ' + minInitPay2);
	// console.log('Минималка: ' + min(minInitPay, minInitPay2));
};

const min = (x: number, y: number) => (x <= y) ? x : y;
const getValueByPercent = (fullValue: number, percent: number) => (fullValue * percent / 100);
const getPercentByValue = (fullValue: number, value: number) => (value * 100 / fullValue);

export default calcReducer;

export type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
export type ThunkType = BaseThunkType<ActionsType>;