import store from "../store/store";
import { getMinInitPay } from "../store/calc-reducer";


export const required = (value: any) => {
	return value || (typeof value === "number" && !isNaN(value))
		? undefined
		: "Обязательное поле";
};

export const initPayRange = (value: any) => {
	// console.log(value);
	value = parseInt((value || '').replace(/\s+/g, '')) || 0;
	const priceVehicle = (store.getState().form.calcFields.values?.priceVehicle || '').replace(/\s+/g, '');
	const initPayPercent = ((value / priceVehicle) * 100);
	// return ((initPayPercent < 10) || (initPayPercent > 100))
	//   ? 'Недопустимое значение. Первоначальный платеж выходит за рамки диапазона (10% - 100%)'
	//   : undefined;
	// const minInitPaySum = (minInitPayPercent * priceVehicle) / 100;
	const minInitPaySum = getMinInitPay(priceVehicle);
	const minInitPayPercent = minInitPaySum * 100 / priceVehicle;

	if (value < minInitPaySum)
		return `Минимальный первоначальный взнос ${minInitPayPercent.toFixed(2)}% (или ${Math.ceil(minInitPaySum).toLocaleString()} Р) для данного ТС`;

	if (initPayPercent > 100)
		return 'Первоначальный взнос больше стоимости ТС';

	const creditPart = priceVehicle - value; // кредитная часть
	const minInitPay_referenceList = store.getState().calc.minInitPay_referenceList;
	const minInitPayIndex = minInitPay_referenceList.findIndex((arrange) => {
		if ((arrange[0] <= creditPart) && (creditPart <= arrange[1]))
			return true;
	});

	if (creditPart < 200000)
		return 'Минимальная кредитная часть не менее 200 000 Р';

	if (minInitPayIndex < 0)
		return 'Превышена кредитная часть';

	return undefined;

};

export const number = (value: any) => +value && isNaN(Number(value)) ? "Только число" : undefined;