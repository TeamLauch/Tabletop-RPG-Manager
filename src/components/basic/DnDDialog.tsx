import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormLabel,
	MenuItem,
	Paper,
	Select,
	styled,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import parse from "html-react-parser";
const DnDDialogSideBarContainer = styled("div")({
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gridGap: "5px",
	width: "100%",
	gridRow: "1fr",
	minHeight: "56vh",
	padding: "5px",
	overflowY: "auto",
});

const DnDDialogSideBarItem = styled("div")({
	display: "flex",
	flexDirection: "column",
	height: "100%",
	overflowY: "auto",
});
const DnDDialogSideBarMultiItem = styled("div")({
	display: "flex",
	alignContent: "center",
	alignItems: "center",
	justifyContent: "center",
	cursor: "pointer",
	fontSize: "15pt",
	borderColor: "black",
	borderRadius: "5px",
	borderStyle: "solid",
	overflowWrap: "break-word",
	wordBreak: "break-word",
	textAlign: "center",
	borderWidth: "1px",
	height: "100%",
});
const DnDDialogSideBarMultiContainer = styled("div")({
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, 100px)",
	gridAutoRows: "95px",
	gridGap: "10px",
	height: "100%",
});

/**
 *
 * @param title Title of the Question
 * @param type Type of the Question -> Single, Multi, Multi-X and Input
 * @param choices Choices => Ignored if type == input
 * @param description Description of the Question
 * @param onNext Opens next Question
 * @param onBack Opens last Question => can be null => No going back
 * @param defaulValue Default value uf Input fields => useless for other types
 * @returns A Dialog to Choose from Multiple Answers or input your own
 */
export default function DnDDialog({
	title,
	type,
	choices,
	description,
	choiceDescription,
	onNext,
	choiceDescriptionType,
	onBack,
	defaultValue,
}: {
	title: string;
	type: string;
	choices: any[];
	choiceDescriptionType: "none" | "tooltip" | "sidebar";
	description: string;
	choiceDescription: (choice) => string;
	onNext: (selection: string[] | string) => void;
	onBack?: () => void;
	defaultValue?: string | string[];
}) {
	const [selection, setSelection] = useState<any>(
		defaultValue ?? (type == "singel" || type == "input" ? "" : [])
	);
	const [sideDescription, setSideDescription] = useState<{
		title: string;
		text: string;
	}>();
	const [unlimitedSelection, setUnlimitedSelection] = useState<boolean>(false);

	useEffect(() => {
		setSelection(
			defaultValue ?? (type == "singel" || type == "input" ? "" : [])
		);
	}, [defaultValue, type, choices]);

	const isChecked = (data: string[], key: string) => {
		return data.includes(key);
	};
	if (!type) {
		return <></>;
	}

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "80vh",
				transition: "all 0.5s ease-out",
			}}
		>
			<Paper
				elevation={3}
				sx={{
					padding: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: "100%",
					maxWidth: choiceDescriptionType != "sidebar" ? 400 : "80vw",
					marginTop: "5vh",
					height: choiceDescriptionType != "sidebar" ? undefined : "70vh",
					maxHeight: "70vh",
					transition: "all 0.5s ease-out",
				}}
			>
				<Typography component="h1" variant="h3">
					{title}
				</Typography>

				<Typography sx={{ color: "gray", textAlign: "left" }} variant="body1">
					{description}
				</Typography>
				{choiceDescriptionType != "sidebar" ? (
					<FormControl
						variant="standard"
						sx={{ m: 3, width: "80%", overflowY: "auto" }}
					>
						{type == "single" ? (
							<Select
								size="small"
								label="Size"
								fullWidth
								value={selection}
								onChange={(e) => {
									setSelection(e.target.value);
								}}
							>
								{choices.map((item) => {
									if (typeof item == "string") {
										return (
											<MenuItem key={"select_" + item} value={item}>
												{item}
											</MenuItem>
										);
									}
									return (
										<MenuItem key={"select_" + item.id} value={item.id}>
											{item.name}
										</MenuItem>
									);
								})}
								<MenuItem value="" sx={{ display: "none" }} disabled></MenuItem>
							</Select>
						) : type == "multi" ? (
							choices.map((item: any) => {
								if (typeof item != "string") {
									return (
										<FormControlLabel
											key={"check_" + item.id}
											control={
												<Checkbox
													checked={isChecked(selection, item.id)}
													value={item.id}
													onChange={(e) => {
														let newSelection;

														if (e.target.checked) {
															// Add the item to selection
															newSelection = [...selection, item.id];
														} else {
															// Remove the item from selection
															newSelection = selection.filter(
																(i: string) => i !== item.id
															);
														}

														setSelection(newSelection);
													}}
												></Checkbox>
											}
											label={item.name}
										></FormControlLabel>
									);
								}
								return (
									<FormControlLabel
										key={"check_" + item}
										control={
											<Checkbox
												checked={isChecked(selection, item)}
												value={item}
												onChange={(e) => {
													let newSelection;

													if (e.target.checked) {
														// Add the item to selection
														newSelection = [...selection, item];
													} else {
														// Remove the item from selection
														newSelection = selection.filter(
															(i: string) => i !== item
														);
													}

													setSelection(newSelection);
												}}
											></Checkbox>
										}
										label={item}
									></FormControlLabel>
								);
							})
						) : type.toLocaleLowerCase().startsWith("multimax-") ? (
							<>
								<FormLabel>
									Wähle {Number.parseInt(type.substring("multimax-".length))}
								</FormLabel>
								{choices.map((item: any) => {
									if (typeof item != "string") {
										return (
											<FormControlLabel
												key={"check_" + item.id}
												control={
													<Checkbox
														disabled={
															!unlimitedSelection &&
															!selection.includes(item.id) &&
															selection.length >=
																Number.parseInt(
																	type.substring("multimax-".length)
																)
														}
														checked={isChecked(selection, item.id)}
														value={item.id}
														onChange={(e) => {
															let newSelection;

															if (e.target.checked) {
																// Add the item to selection
																newSelection = [...selection, item.id];
															} else {
																// Remove the item from selection
																newSelection = selection.filter(
																	(i: string) => i !== item.id
																);
															}

															setSelection(newSelection);
														}}
													></Checkbox>
												}
												label={item.name}
											></FormControlLabel>
										);
									}
									return (
										<FormControlLabel
											key={"check_" + item}
											control={
												<Checkbox
													disabled={
														!unlimitedSelection &&
														!selection.includes(item) &&
														selection.length >=
															Number.parseInt(
																type.substring("multimax-".length)
															)
													}
													checked={isChecked(selection, item)}
													value={item}
													onChange={(e) => {
														let newSelection;

														if (e.target.checked) {
															// Add the item to selection
															newSelection = [...selection, item];
														} else {
															// Remove the item from selection
															newSelection = selection.filter(
																(i: string) => i !== item
															);
														}

														setSelection(newSelection);
													}}
												></Checkbox>
											}
											label={item}
										></FormControlLabel>
									);
								})}
							</>
						) : type == "input" ? (
							<TextField
								size="small"
								value={selection}
								onChange={(e) => {
									setSelection(e.target.value);
								}}
							></TextField>
						) : (
							<>Error-Unknown Type {type}</>
						)}
						{type.toLocaleLowerCase().startsWith("multimax-") ? (
							<FormControlLabel
								control={
									<Checkbox
										checked={unlimitedSelection}
										onChange={(e) => {
											setUnlimitedSelection(!unlimitedSelection);
										}}
									></Checkbox>
								}
								label="Unlimitierte Auswahl aktivieren"
							></FormControlLabel>
						) : (
							<></>
						)}
					</FormControl>
				) : (
					<DnDDialogSideBarContainer>
						<DnDDialogSideBarItem>
							{type == "single" ? (
								<DnDDialogSideBarMultiContainer>
									{choices.map((item) => {
										if (typeof item == "string") {
											return (
												<DnDDialogSideBarMultiItem
													key={"select_" + item}
													style={{
														backgroundColor:
															selection == item ? "#DADADA" : undefined,
													}}
													onClick={() => {
														setSelection(item);
														setSideDescription({
															title: item,
															text: choiceDescription(item),
														});
													}}
												>
													{item}
												</DnDDialogSideBarMultiItem>
											);
										}
										return (
											<DnDDialogSideBarMultiItem
												key={"select_" + item.id}
												style={{
													backgroundColor:
														selection == item.id ? "#DADADA" : undefined,
												}}
												onClick={() => {
													setSelection(item.id);
													setSideDescription({
														title: item.name,
														text: choiceDescription(item),
													});
												}}
											>
												{item.name}
											</DnDDialogSideBarMultiItem>
										);
									})}
								</DnDDialogSideBarMultiContainer>
							) : (
								<></>
							)}
							{type == "multi" || type.startsWith("multimax-") ? (
								<DnDDialogSideBarMultiContainer>
									{choices.map((item) => {
										let max =
											type.startsWith("multimax-") && !unlimitedSelection
												? parseInt(type.split("-")[1])
												: -1;
										if (typeof item == "string") {
											return (
												<DnDDialogSideBarMultiItem
													key={"select_" + item}
													style={{
														cursor:
															max > 0 &&
															Array.isArray(selection) &&
															!selection.includes(item) &&
															selection.length >= max
																? "default"
																: undefined,
														transition: "all 0.3s ease-in",
														backgroundColor:
															Array.isArray(selection) &&
															selection.includes(item)
																? sideDescription &&
																	sideDescription.title == item
																	? "#EADAEA"
																	: "#DADADA"
																: max > 0 &&
																	  Array.isArray(selection) &&
																	  !selection.includes(item) &&
																	  selection.length >= max
																	? sideDescription &&
																		sideDescription.title == item
																		? "#FADAFAA4"
																		: "#DADADA64"
																	: sideDescription &&
																		  sideDescription.title == item
																		? "#FADAFA"
																		: undefined,
													}}
													onClick={() => {
														setSideDescription({
															title: item,
															text: choiceDescription(item),
														});
														if (
															Array.isArray(selection) &&
															selection.includes(item)
														) {
															setSelection(selection.filter((i) => i != item));
														} else if (
															Array.isArray(selection) &&
															!selection.includes(item)
														) {
															if (max > 0 && selection.length >= max) {
																return;
															}
															setSelection((prev) => [...prev, item]);
														} else {
															setSelection([item]);
														}
													}}
												>
													{item}
												</DnDDialogSideBarMultiItem>
											);
										}
										return (
											<DnDDialogSideBarMultiItem
												key={"select_" + item.id}
												style={{
													cursor:
														max > 0 &&
														Array.isArray(selection) &&
														!selection.includes(item.id) &&
														selection.length >= max
															? "default"
															: undefined,
													transition: "all 0.5 ease-out",
													backgroundColor:
														Array.isArray(selection) &&
														selection.includes(item.id)
															? sideDescription &&
																sideDescription.title == item.name
																? "#EADAEA"
																: "#DADADA"
															: max > 0 &&
																  Array.isArray(selection) &&
																  !selection.includes(item.id) &&
																  selection.length >= max
																? sideDescription &&
																	sideDescription.title == item.name
																	? "#FADAFAA4"
																	: "#DADADA64"
																: sideDescription &&
																	  sideDescription.title == item.name
																	? "#FADAFA"
																	: undefined,
												}}
												onClick={() => {
													setSideDescription({
														title: item.name,
														text: choiceDescription(item),
													});
													if (
														Array.isArray(selection) &&
														selection.includes(item.id)
													) {
														setSelection(selection.filter((i) => i != item.id));
													} else if (
														Array.isArray(selection) &&
														!selection.includes(item.id)
													) {
														if (max > 0 && selection.length >= max) {
															return;
														}
														setSelection((prev) => [...prev, item.id]);
													} else {
														setSelection([item.id]);
													}
												}}
											>
												{item.name}
											</DnDDialogSideBarMultiItem>
										);
									})}
									{type.startsWith("multimax-") ? (
										<DnDDialogSideBarMultiItem
											key={"unlockAll"}
											style={{
												transition: "all 0.5 ease-out",
												backgroundColor: unlimitedSelection
													? "#DADADA"
													: undefined,
											}}
											onClick={() => {
												setUnlimitedSelection(!unlimitedSelection);
											}}
										>
											Unbegrenzte Auswahl
										</DnDDialogSideBarMultiItem>
									) : (
										<></>
									)}
								</DnDDialogSideBarMultiContainer>
							) : (
								<></>
							)}
						</DnDDialogSideBarItem>
						<DnDDialogSideBarItem>
							<Typography variant="h4" sx={{ textAlign: "center" }}>
								{sideDescription ? sideDescription.title : undefined}
							</Typography>
							<Typography variant="body1">
								{sideDescription ? parse(sideDescription.text) : undefined}
							</Typography>
						</DnDDialogSideBarItem>
					</DnDDialogSideBarContainer>
				)}
				<div
					style={{
						display: "flex",
						justifyContent: "space-around",
						width: "80%",
						margin: 5,
					}}
				>
					<Button
						variant="contained"
						onClick={() => {
							onBack ? onBack() : () => {};
						}}
						disabled={onBack == null}
					>
						Back
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							onNext(selection);
						}}
					>
						Next
					</Button>
				</div>
			</Paper>
		</div>
	);
}
