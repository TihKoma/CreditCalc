// import React from 'react';
// import TextField from '@material-ui/core/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';

import React, { ChangeEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { officeType } from "../../../../store/officeSelection-reducer";

type propsType = {
	autoCompleteItems: officeType[],

	onOfficeChange: (e: React.ChangeEvent<{}>, value: officeType | null) => void
};

const OfficeAutocomplete: React.FC<propsType> = ({ autoCompleteItems, onOfficeChange }) => {
	//@ts-ignore
	const handleOnChange = ({ target }) => console.log(target.value);
	// const onAutocompleteChange = (e: ChangeEvent<{}>) => {
	// 	console.log('changed');
	// 	// console.log(e.currentTarget);
	// 	// let index = e.target.selectedIndex;
	// 	// let optionElement = e.target.childNodes[index];
	// 	//@ts-ignore
	// 	let index = e.target.getAttribute('data-option-index');
	// 	console.log(index);
	// };

	return (
		<Autocomplete
			id="combo-box-office"
			options={autoCompleteItems}
			getOptionLabel={option => option.name}
			// renderOption={renderOption}
			style={{ width: '300px', marginLeft: '20px' }}
			onChange={onOfficeChange}
			
			// renderTags={(value, getTagProps) => {
			// 	console.log(value);
			// 	return value.map((option, index) => <div>{option.name}</div>)
			// }
			// }
			renderInput={params => (
				<TextField
					{...params}
					label=""
					variant="outlined"
					fullWidth
					onChange={handleOnChange}
				/>
			)}
		/>
	);
};

export default OfficeAutocomplete;


// const ModalBtn = () => {
// 	const [open, setOpen] = React.useState(false);

// 	const handleOpen = (event: any) => {
// 		setOpen(true);
// 	};

// 	const handleClose = () => {
// 		console.log("modal handleClose");
// 		setOpen(false);
// 	};

// 	return (
// 		<div>
// 			<button type="button" onClick={handleOpen}>
// 				Open Modal (not working)
//       </button>
// 			<br />
// 			<Modal
// 				open={open}
// 				onClose={handleClose}
// 				onClick={event => event.stopPropagation()}
// 				onMouseDown={event => event.stopPropagation()}
// 				onFocus={event => {
// 					console.log("modal focus");
// 				}}
// 			>
// 				<div>
// 					<h2 style={{ color: "red" }}>This one doesn't work</h2>
// 					<p>Text field is not available</p>
// 					<TextField label="Filled" variant="filled" /> <br />
// 					<br />
// 					<FixedTags nested={true} />
// 				</div>
// 			</Modal>
// 		</div>
// 	);
// };
// //@ts-ignore
// const FixedTags = function ({ nested }) {
// 	return (
// 		<Autocomplete
// 			onFocus={() => console.log("autocomplete focus", nested)}
// 			multiple
// 			options={autoCompleteItems}
// 			getOptionLabel={option => option.title}
// 			defaultValue={[autoCompleteItems[1], autoCompleteItems[2]]}
// 			renderTags={(value, getTagProps) =>
// 				value.map((option, index) => <div>{option.title}</div>)
// 			}
// 			style={{ width: 500 }}
// 			renderInput={params => (
// 				<TextField
// 					{...params}
// 					onClick={() => console.log("Autocomplete TextField click", nested)}
// 					label="Fixed tag"
// 					variant="outlined"
// 					placeholder="items..."
// 				/>
// 			)}
// 		/>
// 	);
// };

// const autoCompleteItems = [
// 	{ title: "The Shawshank Redemption", year: 1994 },
// 	{ title: "The Godfather", year: 1972 },
// 	{ title: "The Godfather: Part II", year: 1974 },
// 	{ title: "The Dark Knight", year: 2008 },
// 	{ title: "12 Angry Men", year: 1957 }
// ];
