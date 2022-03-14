import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux';
// import store from './../store/store';
import CreditCalc from './creditCalc/creditCalc';
import style from './btnCalc.module.css';
import { actions } from './../store/calc-reducer';

const BtnCalc: React.FC<typeof actions> = (props) => {
	const [isModal, setModal] = React.useState(false)
	const onClose = () => {
		props.setStageCalc('NOT_INIT');
		setModal(false);
	};

	return (
		<React.Fragment>
			{/* <Provider store={store}> */}
				{/* <button onClick={() => setModal(true)}>Открыть Калькулятор</button> */}
				<div id={style.calcWidgetBtn} onClick={() => setModal(true)}>
					<div id={style.calcWidgetImage}></div>
				</div>

				<CreditCalc visible={isModal} onClose={onClose} />
				{/* <Modal
					visible={isModal}
					content={<CreditCalc />}
					footer={<button onClick={onClose}>Закрыть</button>}
					onClose={onClose}
				/> */}
			{/* </Provider> */}
		</React.Fragment>
	)
}

// export default BtnCalc;
export default connect(() => {}, { ...actions })(BtnCalc);