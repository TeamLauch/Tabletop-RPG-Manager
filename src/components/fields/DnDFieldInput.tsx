import { getPossibilities } from "@/utils/constants";
import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
/**
 *
 * A Field for Inpution Vales. The type tells you what type of input it is
 *
 * @param param0
 * @returns
 */
export default function DnDFieldInput({
	type,
	value,
	setValue,
	constData,
	notFullWidth,
	sx,
	label,
}: Readonly<{
	label?: string;
	sx?: any;
	notFullWidth?: boolean;
	type: string;
	value: any;
	constData: any;
	setValue: (value: any) => void;
}>) {
	const possibilites = getPossibilities(type, constData);

	const val = useMemo(() => {
		if (!possibilites) {
			return null;
		}
		if (type == "attributes") {
			return value;
		}
		if (!value) {
			return undefined;
		}
		for (let p of possibilites) {
			if (type == "dice" && p.name.toLowerCase() == value.toLowerCase()) {
				return p;
			}
			if (p.id == value) {
				return p;
			}
		}
		return null;
	}, [possibilites, value, type]);

	if (type == "none") {
		return <></>;
	}

	const setVal = (newValue: any) => {
		if (!newValue) {
			setValue(null);
			return;
		}
		if (type == "dice") {
			setValue(newValue.name);
			return;
		}
		setValue(newValue.id);
	};

	return (
		<>
			{" "}
			{type == "string" ? (
				<TextField
					sx={sx ?? {}}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					label={label ?? ""}
					fullWidth={!notFullWidth}
					size="small"
					value={value ?? ""}
				></TextField>
			) : type == "boolean" ? (
				<Select
					sx={sx ?? {}}
					size="small"
					value={value ? "Ja" : "Nein"}
					fullWidth
					onChange={(e) => {
						setValue(e.target.value == "Ja");
					}}
				>
					<MenuItem value="Ja">Ja</MenuItem>
					<MenuItem value="Nein">Nein</MenuItem>
				</Select>
			) : type == "number" ? (
				<TextField
					sx={sx ?? {}}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					label={label ?? ""}
					fullWidth={!notFullWidth}
					size="small"
					value={value ?? "0"}
				></TextField>
			) : (
				<Autocomplete
					sx={sx ?? {}}
					fullWidth={!notFullWidth}
					options={possibilites ?? []}
					isOptionEqualToValue={(option, value) => {
						if (type == "attributes") {
							return option.name == value;
						}
						if (type == "dice") {
							return option.name == value.name;
						}
						return option.id == value.id;
					}}
					getOptionLabel={(option: any) => {
						if (typeof option == "string") {
							return option;
						}
						return (
							option.name +
							(type == "spell"
								? option.level != 0
									? ": " + option.level
									: ": Zaubertrick"
								: "")
						);
					}}
					onChange={(_event, newValue: any) => {
						if (type == "attributes") {
							if (!newValue) {
								setValue(undefined);
								return;
							}
							setValue(newValue.name);
							return;
						}
						setVal(newValue);
					}}
					size="small"
					value={val}
					renderInput={(params) => (
						<TextField
							{...params}
							label={label ?? ""}
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			)}
		</>
	);
}
