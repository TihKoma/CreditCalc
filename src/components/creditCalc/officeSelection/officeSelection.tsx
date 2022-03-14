import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { AppStateType } from '../../../store/store';
import { getOfficesList, officeType, officeSelected, productType, redirectToCreateClaim, actions } from '../../../store/officeSelection-reducer';
import style from './officeSelection.module.css';
import { setCookie } from '../../../store/cookie';
import OfficeAutocomplete from './officeAutocomplete/officeAutocomplete';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import Autocomplete from 'react-autocomplete';


// интерфейс для пропсов
type propsType = {
	visible: boolean,
	onClose: () => void,

	officesList: officeType[],
	productsList: productType[],

	getOfficesList: () => void,
	officeSelected: (officeId: number | null) => void,
	redirectToCreateClaim: () => void
}

const OfficeSelection: React.FC<propsType & typeof actions> = ({ visible = false, onClose, ...props }) => {
	const [age, setAge] = React.useState('');
	const [value, setValue] = React.useState('');

	const onKeydown = ({ key }: KeyboardEvent) => {
		switch (key) {
			case 'Escape':
				onClose()
				break
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', onKeydown)
		return () => document.removeEventListener('keydown', onKeydown)
	});

	// setCookie('.pipiline', '1D63BAB935F19054F3EE8F60109E71D1B528A15C598D923F623E5DE5D2BA18C99051DD07CB7B58D94B7B09B2DBA5B235DB70DE54E50130595CB68A2E48624DE7834F540B982FB0F47F8AE02F10DE3E7E7119A3F266857634FC52E3D83EDEE4EF');
	// setCookie('Pipeline', 'hpi3o34sljzrkzw522lu2hbm');

	useEffect(() => {
		props.getOfficesList();
	}, []);

	if (!visible) return null;

	// const officesListHtml = props.officesList.map((office) => {
	// 	//@ts-ignore
	// 	return <option officeid={office.officeId} key={`office-${office.officeId}`}> {office.name} </option>;
	// });

	const productsHtml = props.productsList.map((product) => {
		//@ts-ignore
		return <option productid={product.productId} key={`product-${product.productId}`}> {product.name} </option>;
	});

	const onOfficeChange = (e: React.ChangeEvent<{}>, value: officeType | null) => {
		//@ts-ignore
		let index = e.target.getAttribute('data-option-index');
		// console.log(value);
		props.officeSelected(value?.officeId || null);
	};

	const onProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		let index = e.target.selectedIndex;
		let optionElement = e.target.childNodes[index];
		//@ts-ignore
		let productId = optionElement.getAttribute('productid');
		// console.log(productId);

		props.setProductId(productId);
	};

	const onContinueClick = () => {
		props.redirectToCreateClaim();
	};



	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setAge(event.target.value as string);
	};



	return (
		// <div className={style.officeSelection}>
		<div className={style.officeSelection} onClick={onClose}>
			{/* <div className={style.officeSelectionDialog}> */}
			<div className={style.officeSelectionDialog} onClick={e => e.stopPropagation()} onMouseDown={event => event.stopPropagation()}>
				<div className={style.officeSelectionHeader}>
					<h3 className={style.officeSelectionTitle}> Выберите офис и продукт </h3>
					<span className={style.officeSelectionClose} onClick={onClose}>
						&times;
          			</span>
				</div>
				<div className={style.officeSelectionBody}>
					<div className={style.officeSelectionContent}>
						{/* <FormControl className={style.formControl}>
							<InputLabel id="demo-simple-select-label">Age</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={age}
								onChange={handleChange}
							>
								<MenuItem value={10}>Ten</MenuItem>
								<MenuItem value={20}>Twenty</MenuItem>
								<MenuItem value={30}>Thirty</MenuItem>
							</Select>
						</FormControl> */}

						<table style={{ textAlign: 'left' }}>
							<tr>
								<td>
									<span style={{ fontSize: '18px' }}>Офис: </span>
								</td>
								<td>
									{(props.officesList.length > 0)
										? <OfficeAutocomplete autoCompleteItems={props.officesList} onOfficeChange={onOfficeChange} />
										: '...loading'
									}
									<br />
								</td>
							</tr>

							{((props.officesList.length > 0) && (productsHtml.length > 0)) ?
								<tr>
									<td>
										<span style={{ fontSize: '18px' }}>Продукт: </span>
									</td>
									<td>
										<select name="" className={style.selectionOffice} onChange={onProductChange}>
											{productsHtml}
											{/* <option> test </option> */}
										</select>
									</td>
								</tr>
								: ''
							}
						</table>




						{(props.officesList .length > 0) && (productsHtml.length > 0) && <button onClick={onContinueClick} className={style.btnContinue}>Продолжить</button>}
					</div>
				</div>
			</div>
		</div >
		// <Autocomplete
		// 	getItemValue={(item) => item.label}
		// 	items={[
		// 		{ label: 'apple' },
		// 		{ label: 'banana' },
		// 		{ label: 'pear' }
		// 	]}
		// 	renderItem={(item, isHighlighted) =>
		// 		<div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
		// 			{item.label}
		// 		</div>
		// 	}
		// 	value={value}
		// 	onChange={(e) => setValue(e.target.value)}
		// 	onSelect={(val) => setValue(val)}
		// />
	)
};

const mapStateToProps = (state: AppStateType) => {
	return {
		officesList: state.officeSelection.officesList,
		productsList: state.officeSelection.productsList
	};
};

export default connect(mapStateToProps, { getOfficesList, officeSelected, redirectToCreateClaim, ...actions })(OfficeSelection);