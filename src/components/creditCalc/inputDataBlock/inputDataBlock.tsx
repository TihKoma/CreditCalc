import React from "react";
import { connect } from "react-redux";
import {
	Field,
	InjectedFormProps,
	reduxForm,
	WrappedFieldProps,
	change as changeField,
	getFormValues,
	formValueSelector,
} from "redux-form";
import { actions, calculate, formDataType, getMinInitPay, stageCalcType } from "../../../store/calc-reducer";
import store, { AppStateType } from "../../../store/store";
import { initPayRange, number, required } from "../../../validation/ValidateRules";
import ToolTip from "../../toolTip";
import style from "./inputDataBlock.module.css";
import config from "./../../../config.json";

type CalcFieldPropsType = {
	field_cn: string; // cn - className
	type: string;
	input_id?: string;
	input_cn?: string;
	label: string;
	label_cn: string;
	subTitle?: string;
	checked?: boolean;
};

const CalcField: React.FC<WrappedFieldProps & CalcFieldPropsType> = (props) => {
	let {
		field_cn,
		type,
		input_id,
		input_cn,
		label,
		label_cn,
		subTitle,
		input,
		checked,
		meta,
	} = props;
	// console.log(input);

	const isError = meta.touched && meta.invalid;
	// input = {
	// 	...input,
	// 	checked: checked ? true : false
	// };

	return (
		<div className={field_cn}>
			<input
				type={type}
				id={input_id}
				className={input_cn}
				placeholder=" "
				{...input}
			/>
			<label
				htmlFor={input_id}
				className={label_cn + " " + (isError && style.textError)}
			>
				{" "}
				{label}{" "}
			</label>
			{isError && <span className={style.calcFormError}> {meta.error}</span>}
			{!isError && subTitle && (
				<span className={style.calcFormSubTitle}> {subTitle}</span>
			)}
		</div>
	);
};

// type CalcFieldRadioPropsType = {
// 	id: string,
// 	label: string,
// 	// checked: boolean
// };

// const CalcFieldRadio: React.FC<WrappedFieldProps & CalcFieldRadioPropsType> = ({ id, label, input, ...ownprops }) => {
// 	// console.log(ownprops);
// 	return <div className={style.vehicleType}>
// 		<input id={id} type="radio" {...input} />
// 		<label htmlFor={id}> {label} </label>
// 	</div>
// };

type propsType = {
	// handleSubmit: (values: any) => void
	priceVehicle: number;
	initPay: number;
};

type ownProps = {
	changeField: typeof changeField;
	priceVehicle?: number;
	initPayPercent?: any;
	stageCalc: stageCalcType;
};

const InputDataBlock: React.FC<InjectedFormProps<formDataType, ownProps> & ownProps> = (props) => {
	// массив сроков кредита
	const timeLineList = config.creditTerm_referenceList.map((creditTerm, index) => {
		return {
			pointId: index,
			termInMonths: creditTerm,
			termInYears: creditTerm / 12
		};
	});

	const [currentPointId, setCurrentPointId] = React.useState(0);

	const onSelectSliderPoint = (pointId: number) => () => {
		setCurrentPointId(pointId);
		props.changeField(
			"calcFields",
			"creditTerm",
			timeLineList[pointId].termInMonths
		);
	};

	const masPoints = timeLineList.map((el) => {
		let pointClassName =
			el.pointId <= currentPointId
				? style.creditTermSliderPointSelected
				: style.creditTermSliderPoint; // активна ли текущая точка
		pointClassName +=
			el.pointId === currentPointId ? ` ${style.sliderLastSelectedPoint}` : ""; // стиль для последней выбранной точки
		pointClassName +=
			el.pointId === timeLineList.length - 1 ? ` ${style.sliderLastPoint}` : ""; // стиль для последней точки
		return (
			<div className={pointClassName} onClick={onSelectSliderPoint(el.pointId)}>
				{" "}
				{el.termInMonths}{" "}
			</div>
		);
	});

	const monthStr = ([24, 72, 84].indexOf(timeLineList[currentPointId].termInMonths) !== -1) ? 'месяца' : 'месяцев';
	const yearStr = ([2, 3, 4].indexOf(timeLineList[currentPointId].termInYears) !== -1) ? 'года' : 'лет';

	return (
		<div id={style.inputDataBlock}>
			<form onSubmit={props.handleSubmit} autoComplete="off">
				<span className={style.calcContentTitle}>Установите параметры:</span>{" "}
				<ToolTip
					text="Подробности по условиям и правилам расчёта на сайте банка"
					style={{ marginLeft: "45px" }}
				/>
				<br />
				<Field
					name="priceVehicle"
					component={CalcField}
					type="text"
					// pattern="[0-9]*"
					field_cn={style.calcFormGroup}
					input_cn={style.calcFormField}
					validate={[required, number]}
					label="Стоимость транспортного средства, Р"
					label_cn={style.calcFormLabel}
					// normalize={(val: string) => (val.replace(/\s+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, " "))}
					// normalize={(val: string) => (parseInt((val).replace(/\s+/g, '')) || '').toLocaleString()}
					normalize={(value: any, prevVal: any) => {
						const val = value.replace(/\s+/g, "");
						if (value)
							return /^\d+$/.test(val)
								? val.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
								: prevVal;
						return value;
					}}
				/>
				<Field
					name="initPay"
					component={CalcField}
					type="text"
					field_cn={style.calcFormGroup}
					input_cn={style.calcFormField}
					validate={[initPayRange, number]}
					label="Сумма первого взноса, Р"
					label_cn={style.calcFormLabel}
					// subTitle='Сумма первого взноса должна быть равна или более 10% от стоимости транспортного средства (ТС)'
					// subTitle={ props.initPayPercent }
					subTitle={
						props.initPayPercent !== ""
							? props.initPayPercent
							: ""
						// : "Сумма первого взноса должна быть равна или более 10% от стоимости транспортного средства (ТС)"
					}
					// normalize={(val: string) => (parseInt((val).replace(/\s+/g, '')) || '').toLocaleString()}
					normalize={(value: any, prevVal: any) => {
						const val = value.replace(/\s+/g, "");
						if (value)
							return /^\d+$/.test(val)
								? val.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
								: prevVal;
						return value;
					}}
				/>
				<div id={style.vehicleTypeContainer}>
					{/* <fieldset> */}
					{/* <Field
					id='radioNewVehicle'
					name="vehicleType"
					component={CalcFieldRadio}
					// checked={true}
					type="radio"
					value={"new_ts"}
					label="Новое ТС"
				// props={{ value: "Новое ТС" }}
				/> */}

					<Field
						name="vehicleType"
						component={CalcField}
						type="radio"
						value={"new"}
						input_id="radioNewVehicle"
						field_cn={style.vehicleType}
						label="Новое ТС"
					/>

					<Field
						name="vehicleType"
						component={CalcField}
						type="radio"
						value={"used"}
						input_id="radioUsedVehicle"
						field_cn={style.vehicleType}
						label="С пробегом"
					/>

					{/* <Field
					name="vehicleType"
					component={CalcFieldRadio}
					props={{ value: "С пробегом" }}
				/> */}

					{/* <div className={style.vehicleType}>
					<input id='radioUsedVehicle' type="radio" name="vehicleType" value="used_ts" />
					<label htmlFor="radioUsedVehicle">С пробегом</label>
				</div> */}
					{/* </fieldset> */}
				</div>
				<div id={style.creditTermContainer}>
					<span>Установите срок кредита: </span>
					<b>
						{timeLineList[currentPointId].termInMonths} {monthStr} (
						{timeLineList[currentPointId].termInYears} {yearStr})
					</b>

					<Field
						name="creditTerm"
						component="input"
						type="hidden"
					// value={timeLineList[currentPointId].termInMonths}
					/>

					<div id={style.creditTermSlider}>
						{/* <label htmlFor=""></label> */}
						{/* <div className={style.creditTermSliderPointSelected} onClick={onSelectSliderPoint(0)}></div>
				<div className={style.creditTermSliderPoint} onClick={onSelectSliderPoint(1)}></div> */}
						{masPoints}
					</div>
				</div>
				<div className={style.optionalFieldsContainer}>
					<span>Снизить кредитную ставку? (необязательно)</span>
					<div className={style.optionalFieldsContainerBox}>
						<Field
							name="insurance"
							component={CalcField}
							type="checkbox"
							value={"insurance"}
							input_id="checkboxInsurance"
							field_cn={style.checkbox}
							label="Страховка"
						/>
						<Field
							name="certificatePFR"
							component={CalcField}
							type="checkbox"
							value={"certificatePFR"}
							input_id="checkboxCertificatePFR"
							field_cn={style.checkbox}
							label="Справка из ПФР"
						/>
						<ToolTip
							text="Страховка - Специальная ставка предоставляется при заключении договора комплексного страхового продукта* или личного страхования*<br>
							Справка ПФР - При сумме кредита до 1 500 000 рублей и предоставлении Заемщиком сведений о состоянии индивидуального лицевого счета застрахованного лица (форма СЗИ-ИЛС) процентная ставка снижается на 1 процентный пункт*"
						/>
						{/* <label className={style.checkbox}>
							<input type="checkbox" /> Справка из ПФР
						</label> */}
					</div>
				</div>
				{props.stageCalc === "NOT_INIT" && (
					<button id={style.calculateBtn} type="submit">
						Рассчитать
					</button>
				)}
				<div style={{ marginTop: "10px" }}>
					* подробности по{" "}
					<a
						target="_blank"
						href="https://www.km-bank.ru/to_individuals/lending_to_individuals/auto_loans/autoprivilege.php"
					>
						ссылке
          </a>
				</div>
			</form>
		</div>
	);
};

const mapStateToProps = (state: AppStateType) => {
	//@ts-ignore
	const isInitPayVisited = state.form.calcFields?.fields?.initPay?.visited;
	const selector = formValueSelector("calcFields");
	const initPay = parseInt(
		(selector(state, "initPay") || "").replace(/\s+/g, "")
	);
	const priceVehicle = parseInt(
		(selector(state, "priceVehicle") || "").replace(/\s+/g, "")
	);
	const initPayPercent = Math.trunc(((initPay / priceVehicle) * 100) * 100) / 100; // вычисление % и отброс дробной части после сотых
	const minInitPaySum = getMinInitPay(priceVehicle);
	const minInitPayPercent = minInitPaySum * 100 / priceVehicle;
	const minInitPaySubtitle = !isInitPayVisited ? "" : `Минимальный первоначальный взнос ${minInitPayPercent.toFixed(2)}% (или ${Math.ceil(minInitPaySum).toLocaleString()} Р) для данного ТС`

	return {
		// priceVehicle,
		initPayPercent: !Number.isNaN(initPayPercent)
			? `${initPayPercent}% от стоимости транспортного средства (ТС)`
			: minInitPaySubtitle,
		stageCalc: state.calc.stageCalc,
	};
};

const anyFieldOnChange = (formData: formDataType, dispatch: any, props: ownProps) => {
	const { priceVehicle, initPay } = formData;

	// if (!priceVehicle || !initPay)
	// dispatch(actions.setStageCalc("NOT_INIT"));

	// if (props.stageCalc !== "NOT_INIT" && priceVehicle && initPay)
	if (props.stageCalc !== "NOT_INIT" && (priceVehicle || initPay))
	dispatch(calculate(formData));
};

const InputDataBlockWithReduxForm = reduxForm<formDataType, ownProps>({
	form: "calcFields",
	initialValues: {
		// priceVehicle: 0,
		vehicleType: "new",
		creditTerm: 24,
	},
	onChange: anyFieldOnChange,
})(InputDataBlock);

export default connect(mapStateToProps, { changeField })(
	InputDataBlockWithReduxForm
);
