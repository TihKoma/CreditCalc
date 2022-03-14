import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import BtnCalc from './components/btnCalc';
import OfficeAutocomplete from './components/creditCalc/officeSelection/officeAutocomplete/officeAutocomplete';
import store from './store/store';

if (document.getElementById("credit-calc") != undefined) {
	ReactDOM.render(
		<Provider store={store}>
			<BtnCalc />
		</Provider>,
		document.getElementById('credit-calc')
	);
};

// if (document.getElementById("credit-calc") != undefined) {
// 	ReactDOM.render(
// 		<OfficeAutocomplete />,
// 		document.getElementById('credit-calc')
// 	);
// };