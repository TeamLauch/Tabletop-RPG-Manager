import { ATTRIBUTES } from "@/utils/constants";
import { MenuItem, Select, TextField, Typography } from "@mui/material";
import {
	getFieldData,
	updateFieldArrayFunction,
	updateFieldFunction,
} from "@/utils/dataHelper";
import DnDFieldInput from "./DnDFieldInput";
import DnDFieldArrayInput from "./DnDFieldArrayInput";
import { Field } from "@/utils/types";
/**
 * Input Field for Data to be Saved into a DATA JSON
 * Type of the Field is determint by the field Parameter
 *  -> field.type = Type
 *
 * @param field Field
 * @param setData Save Value to Data
 * @param data Data for Datahandler
 * @param constData Constans from Database like Spells, etc
 */
export default function DnDFieldValueEditor({
	field,
	setData,
	data,
	constData,
}: {
	field: Field;
	setData: any;
	data: any;
	constData: any;
}) {
	if (field.type == "number" || field.type == "string") {
		return (
			<TextField
				sx={{ margin: 2, width: "30%" }}
				multiline={field.multiline}
				size="small"
				label={field.title}
				disabled={field.disabled}
				value={getFieldData(data, field.location)}
				onChange={(e) => {
					updateFieldFunction(
						data,
						field.location,
						e.target.value,
						setData,
						true
					);
				}}
			></TextField>
		);
	}
	if (field.type == "choice") {
		return (
			<Select
				value={getFieldData(data, field.location) ?? "none"}
				onChange={(e) => {
					updateFieldFunction(
						data,
						field.location,
						e.target.value,
						setData,
						true
					);
				}}
				size="small"
				sx={{ margin: 2, width: "30%" }}
			>
				<MenuItem value="none" disabled>
					{field.title}
				</MenuItem>
				{field.choices ? (
					field.choices.map((item) => {
						if (typeof item != "string") {
							return (
								<MenuItem
									value={item.value}
									key={field.location + "_" + item.value}
								>
									{item.name}
								</MenuItem>
							);
						}
						return (
							<MenuItem value={item} key={field.location + "_" + item}>
								{item}
							</MenuItem>
						);
					})
				) : (
					<></>
				)}
			</Select>
		);
	}
	if (field.type == "weapon") {
		return (
			<div
				style={{
					width: "100%",
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap",
				}}
			>
				<TextField
					label="Name"
					sx={{ width: "30%" }}
					size="small"
					value={getFieldData(data, field.location + ".name")}
					onChange={(e) => {
						updateFieldFunction(
							data,
							field.location + ".name",
							e.target.value,
							setData,
							true
						);
						updateFieldFunction(
							data,
							field.location + ".ubung",
							true,
							setData,
							true
						);
					}}
				></TextField>
				<TextField
					label="Reichweite"
					sx={{ width: "20%" }}
					size="small"
					value={getFieldData(data, field.location + ".name")}
					onChange={(e) => {
						updateFieldFunction(
							data,
							field.location + ".range",
							e.target.value,
							setData,
							true
						);
						updateFieldFunction(
							data,
							field.location + ".ubung",
							true,
							setData,
							true
						);
					}}
				></TextField>
				<Select
					label="Attribut"
					sx={{ width: "10%" }}
					size="small"
					value={getFieldData(data, field.location + ".name")}
					onChange={(e) => {
						updateFieldFunction(
							data,
							field.location + ".attribute",
							e.target.value,
							setData,
							true
						);
						updateFieldFunction(
							data,
							field.location + ".ubung",
							true,
							setData,
							true
						);
					}}
				>
					{ATTRIBUTES.map((item) => {
						return (
							<MenuItem
								value={item.shortName}
								key={item.shortName + "_select_att_weapon_" + field.location}
							>
								{item.name}
							</MenuItem>
						);
					})}
				</Select>
				<TextField
					label="Schaden"
					sx={{ width: "20%" }}
					size="small"
					value={getFieldData(data, field.location + ".name")}
					onChange={(e) => {
						updateFieldFunction(
							data,
							field.location + ".damage",
							e.target.value,
							setData,
							true
						);
						updateFieldFunction(
							data,
							field.location + ".ubung",
							true,
							setData,
							true
						);
					}}
				></TextField>
				<Select
					label="Schadensart"
					sx={{ width: "20%" }}
					size="small"
					value={getFieldData(data, field.location + ".name")}
					onChange={(e) => {
						updateFieldFunction(
							data,
							field.location + ".damageType",
							e.target.value,
							setData,
							true
						);
						updateFieldFunction(
							data,
							field.location + ".ubung",
							true,
							setData,
							true
						);
					}}
				>
					{constData.damageTypes.map((item: any) => {
						return (
							<MenuItem
								value={item.name}
								key={item.name + "_select_dam_weapon_" + field.location}
							>
								{item.name}
							</MenuItem>
						);
					})}
				</Select>
				<TextField
					label="Beschreibung"
					sx={{ width: "100%" }}
					size="small"
					value={getFieldData(data, field.location + ".name")}
					onChange={(e) => {
						updateFieldFunction(
							data,
							field.location + ".description",
							e.target.value,
							setData,
							true
						);
						updateFieldFunction(
							data,
							field.location + ".ubung",
							true,
							setData,
							true
						);
					}}
				></TextField>
			</div>
		);
	}
	if (field.type.endsWith("[]")) {
		return (
			<div style={{ width: "100%" }}>
				<Typography variant="h4">{field.title}</Typography>
				<DnDFieldArrayInput
					constData={constData}
					setValue={(value: any[]) => {
						updateFieldArrayFunction(
							data,
							field.location,
							value,
							true,
							setData,
							true
						);
					}}
					type={field.type.replace("[]", "")}
					value={getFieldData(data, field.location)}
				></DnDFieldArrayInput>
			</div>
		);
	}

	return (
		<DnDFieldInput
			sx={{ margin: 2, width: "30%" }}
			notFullWidth
			constData={constData}
			setValue={(value: any) => {
				updateFieldFunction(data, field.location, value, setData, true);
			}}
			type={field.type}
			value={getFieldData(data, field.location)}
			label={field.title}
		></DnDFieldInput>
	);
}
