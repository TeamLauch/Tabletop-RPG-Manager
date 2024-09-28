import { getFieldData, resolveToValue } from "@/utils/dataHelper";
import DnDGameTextBox from "./DnDGameTextBox";
import {
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import parse from "html-react-parser";
import Image from "next/image";

export default function DnDCharacterSheetPopupField({
	id,
	title,
	style,
	type,
	values,
	onClick,
	onChange,
	playerData,
	openPopup,
	constData,
	characterData,
	popupData,
	setPopupData,
	worldData,
}: {
	id: string;
	type: string;
	values: any;
	worldData: any;
	onClick?: (
		popupData: any,
		openPopup: (id: string, openAttributes: any) => void,
		index?: number
	) => any;
	onChange?: (event: any, popupData: any, index?: number) => any;
	title?: string;
	style?: any;
	openPopup: (id: string, openAttributes: any) => void;
	playerData: any;
	constData: any;
	characterData: any;
	popupData: any;
	setPopupData: any;
}) {
	switch (type.toLowerCase()) {
		case "array":
			<div style={style}>
				{values.map((item, index) => {
					return (
						<DnDCharacterSheetPopupField
							characterData={characterData}
							constData={constData}
							worldData={worldData}
							id={item.id}
							openPopup={openPopup}
							playerData={playerData}
							popupData={popupData}
							setPopupData={setPopupData}
							type={item.type}
							values={
								item.values
									? item.values(
											popupData,
											playerData,
											characterData,
											getFieldData,
											resolveToValue,
											constData
										)
									: undefined
							}
							key={item.id + "sub" + id}
							onChange={
								item.onChange
									? item.onChange
									: (p: any, openPopup: any, i?: any) => {
											setPopupData((prev: any) => ({
												...prev,
												...onChange(p, popupData, index),
											}));
										}
							}
							onClick={
								item.onClick
									? item.onClick
									: (p: any, openPopup: any, i?: any) => {
											setPopupData((prev: any) => ({
												...prev,
												...onClick(p, popupData, index),
											}));
										}
							}
							style={item.style}
							title={item.title}
						></DnDCharacterSheetPopupField>
					);
				})}
			</div>;

		case "multiselect":
			if (!values) {
				return <></>;
			}
			return (
				<FormGroup sx={style}>
					<FormLabel>Wähle {popupData[id + "max"]}</FormLabel>
					{values.map((item) => {
						if (!item) {
							return;
						}
						return (
							<FormControlLabel
								key={id + item.id}
								disabled={
									!popupData[id + "_overrule"] &&
									popupData[id + "max"] &&
									popupData[id] &&
									popupData[id].length >= popupData[id + "max"] &&
									!popupData[id].includes(item.value)
								}
								control={
									<Checkbox
										checked={
											popupData[id] ? popupData[id].includes(item.value) : false
										}
										value={item.value}
										onChange={(event, checked) => {
											if (onChange) {
												setPopupData((prev: any) => ({
													...prev,
													...onChange(event, popupData),
												}));
												return;
											}
											if (!popupData[id]) {
												if (checked) {
													setPopupData((prev: any) => ({
														...prev,
														[id]: [event.target.value],
													}));
												} else {
													setPopupData((prev: any) => ({
														...prev,
														[id]: [],
													}));
												}
												return;
											}
											if (checked) {
												setPopupData((prev: any) => ({
													...prev,
													[id]: [...prev[id], event.target.value],
												}));
											} else {
												let i = [];
												for (let a of popupData[id]) {
													if (a != event.target.value) {
														i.push(a);
													}
												}
												setPopupData((prev: any) => ({
													...prev,
													[id]: i,
												}));
											}
										}}
										name={item.name}
									/>
								}
								label={item.name}
							/>
						);
					})}
					{popupData[id + "max"] ? (
						<FormControlLabel
							control={
								<Checkbox
									checked={popupData[id + "_overrule"]}
									value={id + "_overrule"}
									onChange={(event, checked) => {
										setPopupData((prev: any) => ({
											...prev,
											[id + "_overrule"]: checked,
										}));
									}}
									name={"Unbegrenzte Auswahl"}
								/>
							}
							label={"Unbegrenzte Auswahl"}
						/>
					) : (
						<></>
					)}
				</FormGroup>
			);
		case "text":
			return (
				<div
					style={{
						...style,
					}}
					onClick={
						onClick
							? () => {
									setPopupData((prev: any) => ({
										...prev,
										...onClick(popupData, openPopup),
									}));
								}
							: undefined
					}
				>
					{title ? (
						<>
							<b>{title}</b>
							<br />
						</>
					) : (
						<></>
					)}
					<Typography
						variant="body1"
						sx={{
							whiteSpace: "pre-line",
						}}
					>
						{values}
					</Typography>
				</div>
			);
		case "textfield":
			return (
				<TextField
					size="small"
					sx={style}
					label={title}
					value={popupData[id]}
					onClick={
						onClick
							? () => {
									setPopupData((prev: any) => ({
										...prev,
										...onClick(popupData, openPopup),
									}));
								}
							: undefined
					}
					onChange={(e: any) => {
						if (!onChange) {
							setPopupData((prev) => ({
								...prev,
								[id]: e.target.value,
							}));
							return;
						}
						setPopupData((prev: any) => ({
							...prev,
							...onChange(e, popupData),
						}));
					}}
				></TextField>
			);
		case "textarea":
			return (
				<TextField
					size="small"
					sx={style}
					label={title}
					value={popupData[id]}
					multiline
					onClick={
						onClick
							? () => {
									setPopupData((prev: any) => ({
										...prev,
										...onClick(popupData, openPopup),
									}));
								}
							: undefined
					}
					onChange={(e: any) => {
						if (!onChange) {
							setPopupData((prev) => ({
								...prev,
								[id]: e.target.value,
							}));
							return;
						}
						setPopupData((prev: any) => ({
							...prev,
							...onChange(e, popupData),
						}));
					}}
				></TextField>
			);
		case "boolean":
			return (
				<Select
					sx={style}
					size="small"
					value={popupData[id] ? "Ja" : "Nein"}
					defaultValue={"none"}
					onClick={
						onClick
							? () => {
									setPopupData((prev: any) => ({
										...prev,
										...onClick(popupData, openPopup),
									}));
								}
							: undefined
					}
					onChange={(e: any) => {
						if (!onChange) {
							setPopupData((prev) => ({
								...prev,
								[id]: e.target.value == "Ja",
							}));
							return;
						}
						setPopupData((prev: any) => ({
							...prev,
							...onChange(e, popupData),
						}));
					}}
				>
					<MenuItem disabled value="none">
						{title}
					</MenuItem>
					<MenuItem value="Ja">Ja</MenuItem>
					<MenuItem value="Nein">Nein</MenuItem>
				</Select>
			);

		case "image":
			return <img src={values} alt="" style={{ width: "100%" }}></img>;
		case "spezial_location":
			return (
				<div
					style={{
						width: "100%",
						alignItems: "center",
						borderRadius: "5px",
						alignContent: "center",
						justifyContent: "center",
						display: "flex",
						textAlign: "center",
						position: "relative",
						color: "white",
					}}
				>
					<img
						alt=""
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							borderRadius: "5px",
						}}
						src={"/api/file/getImage?type=map&id=" + worldData.id}
					></img>
					{worldData.playerPosition ? (
						<div
							style={{
								width: "5px",
								height: "5px",
								backgroundColor: "red",
								borderRadius: "5px",
								marginLeft: "-2.5px",
								marginTop: "-2.5px",
								left: worldData.playerPosition.x,
								top: worldData.playerPosition.y,
								position: "absolute",
							}}
						></div>
					) : (
						<></>
					)}
				</div>
			);
		case "select":
			return (
				<Select
					sx={style}
					size="small"
					value={popupData[id] ?? "none"}
					defaultValue={"none"}
					onClick={
						onClick
							? () => {
									setPopupData((prev: any) => ({
										...prev,
										...onClick(popupData, openPopup),
									}));
								}
							: undefined
					}
					onChange={(e: any) => {
						if (!onChange) {
							setPopupData((prev) => ({
								...prev,
								[id]: e.target.value,
							}));
							return;
						}
						setPopupData((prev: any) => ({
							...prev,
							...onChange(e, popupData),
						}));
					}}
				>
					{title ? (
						<MenuItem disabled value="none">
							{title}
						</MenuItem>
					) : (
						<></>
					)}
					{values.map((item: any) => {
						if (typeof item == "string") {
							return (
								<MenuItem key={item} value={item}>
									{item}
								</MenuItem>
							);
						}
						return (
							<MenuItem key={item.value} value={item.value}>
								{item.label}
							</MenuItem>
						);
					})}
				</Select>
			);
		case "button":
			return (
				<Button
					sx={style}
					size="small"
					variant={values[0] ?? undefined}
					color={values[1] ?? undefined}
					onClick={
						onClick
							? () => {
									setPopupData((prev: any) => ({
										...prev,
										...onClick(popupData, openPopup),
									}));
								}
							: undefined
					}
				>
					{title}
				</Button>
			);
		case "spell":
			return (
				<>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							marginTop: "5px",
						}}
					>
						<Typography variant="h2">{popupData.name}</Typography>
					</div>
					<Typography variant="h5">
						Level:{" "}
						<b>{popupData.level == 0 ? "Zaubertrick" : popupData.level}</b>
					</Typography>
					<Typography variant="h5">
						Schule: <b>{popupData.school}</b>
					</Typography>
					<Typography variant="h5">
						Ritual: <b>{popupData.ritual ? "ja" : "nein"}</b>
					</Typography>
					<Typography variant="h5">
						Ausführzeit: <b>{popupData.castingTime}</b>
					</Typography>
					<Typography variant="h5">
						Reichweite: <b>{popupData.range}</b>
					</Typography>
					<Typography variant="h5">
						Dauer: <b>{popupData.duration}</b>
					</Typography>
					<Typography variant="h5">
						Komponenten: <b>{popupData.components}</b>
					</Typography>
					{popupData.material ? (
						<Typography variant="h5">
							Material: <b>{popupData.material}</b>
						</Typography>
					) : (
						<></>
					)}
					<Typography variant="h5">Beschreibung:</Typography>
					<Typography variant="h6">
						{typeof popupData.description == "string"
							? parse(popupData.description)
							: popupData.description}
					</Typography>
				</>
			);
		case "gtext":
			return (
				<DnDGameTextBox
					backgroundColor={values[0]}
					text={title}
					style={style}
					onClick={
						onClick
							? () => {
									setPopupData((prev: any) => ({
										...prev,
										...onClick(popupData, openPopup),
									}));
								}
							: undefined
					}
				></DnDGameTextBox>
			);
		case "field":
			if (!values) {
				return <></>;
			}
			return (
				<DnDCharacterSheetPopupField
					id={values.id}
					characterData={characterData}
					constData={constData}
					openPopup={openPopup}
					playerData={playerData}
					worldData={worldData}
					popupData={popupData}
					setPopupData={setPopupData}
					type={values.type}
					values={
						values.values
							? values.values(
									popupData,
									playerData,
									characterData,
									getFieldData,
									constData
								)
							: undefined
					}
					onChange={values.onChange}
					onClick={values.onClick}
					style={values.style}
					title={values.title}
				></DnDCharacterSheetPopupField>
			);
		default:
			return <></>;
	}
}
