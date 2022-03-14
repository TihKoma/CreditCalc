import React from "react";
import { connect } from "react-redux";
import { AppStateType } from "../../store/store";
import { calculate, formDataType, stageCalcType, resultType } from "./../../store/calc-reducer";
import style from './creditCalc.module.css';
import InputDataBlock from "./inputDataBlock/inputDataBlock";
import imgPreloader from "./../../img/pleloader.gif";
import OfficeSelection from "./officeSelection/officeSelection";
import OfficeAutocomplete from "./officeSelection/officeAutocomplete/officeAutocomplete";
import { officeType, productType, redirectToCreateClaim } from "./../../store/officeSelection-reducer";


type propsType = {
	visible: boolean,
	onClose: () => void,

	stageCalc: stageCalcType,
	resRequestedCond: resultType,
	resExtendedTimeCond: resultType,
	resDownCreditRate: resultType,
	officesList: officeType[],
	productsList: productType[]

	calculate: (formData: formDataType) => void,
	redirectToCreateClaim: () => void
};




const CreditCalc: React.FC<propsType> = (props) => {
	const { resRequestedCond, resExtendedTimeCond, resDownCreditRate } = props;


	const [isShownOfficeSelection, setShownOfficeSelection] = React.useState(false); // показана ли форма выбора офиса и продукта
	const onCloseOfficeSelection = () => setShownOfficeSelection(false);

	const onKeydown = ({ key }: KeyboardEvent) => {
		switch (key) {
			case 'Escape':
				props.onClose()
				break
		}
	};

	React.useEffect(() => {
		document.addEventListener('keydown', onKeydown)
		return () => document.removeEventListener('keydown', onKeydown)
	});

	if (!props.visible) return null

	// const onCalculateClick = () => {
	// props.calculate();
	// };

	const formSubmit = (formData: formDataType) => props.calculate(formData);

	const onApplyCreditClick = () => {
		//@ts-ignore
		// window.createClaimModel.showProductSelection();
		if (props.productsList.length == 1 && props.officesList.length == 1)
			props.redirectToCreateClaim();
		else
			setShownOfficeSelection(true);
	};


	return <>
		<OfficeSelection
			visible={isShownOfficeSelection}
			onClose={onCloseOfficeSelection}
		/>


		{/* <OfficeAutocomplete /> */}
		<div className={style.calc}>
			<div className={style.calcWindow} onClick={e => e.stopPropagation()} onMouseDown={event => event.stopPropagation()}>
				<div className={style.calcHeader}>
					<div className={style.calcHeaderTitle}>
						<span className={style.calcTitle}>Калькулятор</span>
						<span className={style.calcSubtitle}>предварительный расчет, <br /> не является публичной офертой</span>
					</div>
					
					<span className={style.calcClose} onClick={props.onClose}>
						Закрыть
					</span>
				</div>
				<div className={style.calcContainer}>
					<div className={style.calcBody}>
						<div className={style.calcContent}>
							{/* <OfficeAutocomplete /> */}

							<InputDataBlock onSubmit={formSubmit} />

							<div id={style.outputDataBlock}>
								{(props.stageCalc === 'NOT_INIT') && <div id={style.outputPreview}>
									<span>
										Установите интересующие Вас параметры и нажмите кнопку Рассчитать. <br />
										Здесь появятся индивидуальные предложения для Вас
									</span>
								</div>}

								{(props.stageCalc === 'LOADING') && <div id={style.preloaderContainer}>
									<img src={imgPreloader} width="64px" height="64px" />
								</div>}

								{(props.stageCalc === 'COMPLETED') && <div id={style.resultDataContainer}>
									<span className={style.calcContentTitle}>Выберите предложение:</span>

									<div className={style.resultData}>
										<input id='requestedConditions' type="radio" name="resultDataRadio" />
										<label htmlFor="requestedConditions">
											<span>Запрошенные условия</span>

											<table className={style.conditionTable}>
												<thead>
													<tr>
														<td>Первый взнос</td>
														<td>Ежемесячный <br /> платеж</td>
														<td>Срок <br /> кредита</td>
														<td>Ставка <br /> кредита</td>
													</tr>
												</thead>

												<tbody>
													<tr>
														<td> {parseInt((+resRequestedCond.initPay).toFixed(0)).toLocaleString()} Р ({Math.trunc(resRequestedCond.initPayPercent*100)/100}%) </td>
														<td> {parseInt(resRequestedCond.monthPay.toFixed(0)).toLocaleString()} Р</td>
														<td>{resRequestedCond.creditTerm} мес</td>
														<td>{resRequestedCond.creditRate.toFixed(1)}%</td>
													</tr>
												</tbody>
											</table>

											<span className={style.resultDataInitPay}>
												Сумма кредита: {parseInt(resRequestedCond.creditSum.toFixed(0)).toLocaleString()} Р
											</span>
										</label>
									</div>

									<div className={style.resultData}>
										<input id='extendedTime' type="radio" name="resultDataRadio" />
										<label htmlFor="extendedTime">
											<span>Увеличен срок</span>

											<table className={style.conditionTable}>
												<thead>
													<tr>
														<td>Первый взнос</td>
														<td>Ежемесячный <br /> платеж</td>
														<td>Срок <br /> кредита</td>
														<td>Ставка <br /> кредита</td>
													</tr>
												</thead>

												<tbody>
													<tr>
														<td> {parseInt((+resExtendedTimeCond.initPay).toFixed(0)).toLocaleString()} Р ({Math.trunc(resExtendedTimeCond.initPayPercent*100)/100}%) </td>
														<td> {parseInt(resExtendedTimeCond.monthPay.toFixed(0)).toLocaleString()} Р</td>
														<td> {resExtendedTimeCond.creditTerm} мес</td>
														<td> {resExtendedTimeCond.creditRate.toFixed(1)}%</td>
													</tr>
												</tbody>
											</table>

											<span className={style.resultDataInitPay}>
												Сумма кредита: {parseInt(resExtendedTimeCond.creditSum.toFixed(0)).toLocaleString()} Р
											</span>
										</label>
									</div>

									<div className={style.resultData}>
										<input id='reducedCreditRate' type="radio" name="resultDataRadio" />
										<label htmlFor="reducedCreditRate">
											<span>Уменьшена ставка по кредиту</span>

											<table className={style.conditionTable}>
												<thead>
													<tr>
														<td>Первый взнос</td>
														<td>Ежемесячный <br /> платеж</td>
														<td>Срок <br /> кредита</td>
														<td>Ставка <br /> кредита</td>
													</tr>
												</thead>

												<tbody>
													<tr>
														<td> {parseInt((+resDownCreditRate.initPay).toFixed(0)).toLocaleString()} Р ({Math.trunc(resDownCreditRate.initPayPercent*100)/100}%) </td>
														<td> {parseInt(resDownCreditRate.monthPay.toFixed(0)).toLocaleString()} Р</td>
														<td> {resDownCreditRate.creditTerm} мес</td>
														<td> {resDownCreditRate.creditRate.toFixed(1)}%</td>
													</tr>
												</tbody>
											</table>

											<span className={style.resultDataInitPay}>
												Сумма кредита: {parseInt(resDownCreditRate.creditSum.toFixed(0)).toLocaleString()} Р
											</span>
										</label>
									</div>

									<button id={style.applyCreditBtn} type="submit" onClick={onApplyCreditClick}>
										Оформить
									</button>
								</div>}

							</div>

						</div>
					</div>
				</div>
			</div>
		</div>


	</>;
};

const mapStateToProps = (state: AppStateType) => {
	return {
		stageCalc: state.calc.stageCalc,
		resRequestedCond: state.calc.resRequestedCond,
		resExtendedTimeCond: state.calc.resExtendedTimeCond,
		resDownCreditRate: state.calc.resDownCreditRate,
		officesList: state.officeSelection.officesList,
		productsList: state.officeSelection.productsList
	};
};

export default connect(mapStateToProps, { calculate, redirectToCreateClaim })(CreditCalc);



