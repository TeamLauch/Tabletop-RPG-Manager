import { ATTRIBUTES, getPossibilities } from "@/utils/constants";
import { Add, Delete } from "@mui/icons-material";
import {
	Tooltip,
	Autocomplete,
	IconButton,
	MenuItem,
	Select,
	Table,
	TableCell,
	TableContainer,
	TableRow,
	TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
/**
 *
 * A Component for Editing a Field with a Array Type.
 *
 * @param type Type of the Field
 * @param value Array of Values inside the Table
 * @param setValue saves changes
 * @param constData Data like spells
 * @returns
 */
export default function DnDFieldArrayInput({
	type,
	value,
	setValue,
	constData,
}: Readonly<{
	type: string;
	value: any[];
	constData: any;
	setValue: (value: any[]) => void;
}>) {
	const possibilites = getPossibilities(type, constData);
	const [addValue, setAddValue] = useState<any>(null);

	const resolveSpellName = (id: string) => {
		for (let s of constData.spells) {
			if (s.id == id) {
				return s.name;
			}
		}
		return id;
	};

	const filterPossibilities = useCallback(() => {
		let a: any[] = [];
		if (!possibilites) {
			return [];
		}
		if (!value) {
			return possibilites;
		}
		for (let p of possibilites) {
			if (type == "spell") {
				if (!value.includes(p.id)) {
					a.push(p);
				}
				continue;
			}
			if (!value.includes(p.name)) {
				a.push(p);
			}
		}
		return a;
	}, [possibilites, value]);

	useEffect(() => {
		if (type == "weapon") {
			setAddValue({});
		}
	}, [type]);

	return (
		<TableContainer
			style={{
				marginTop: 10,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				width: "100%", // Set width to 100%
			}}
		>
			<Table>
				<TableRow sx={{ textAlign: "center" }}>
					<TableCell sx={{ width: "80px" }}>Aktionen</TableCell>
					<TableCell sx={{ width: type != "weapon" ? "400px" : "90%" }}>
						Name
					</TableCell>
					<TableCell sx={{}} />
				</TableRow>
				{Array.isArray(value) ? (
					value.map((item: any, index: any) => {
						return (
							<TableRow key={item + "qendnwi" + index}>
								<TableCell>
									<Tooltip title="Löschen">
										<IconButton
											onClick={() => {
												setValue(
													value.filter((item: any, i: any) => {
														return i != index;
													})
												);
											}}
										>
											{" "}
											<Delete></Delete>
										</IconButton>
									</Tooltip>
								</TableCell>
								{type == "weapon" ? (
									<>
										<TableCell>
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
													value={item ? item.name ?? "" : ""}
													onChange={(e) => {
														let newValue = [...value];
														newValue[index] = {
															...newValue[index],
															name: e.target.value,
														};
														setValue(newValue);
													}}
												></TextField>
												<TextField
													label="Reichweite"
													sx={{ width: "20%" }}
													size="small"
													value={item ? item.range ?? "" : ""}
													onChange={(e) => {
														let newValue = [...value];
														newValue[index] = {
															...newValue[index],
															range: e.target.value,
														};
														setValue(newValue);
													}}
												></TextField>
												<Select
													label="Attribut"
													sx={{ width: "10%" }}
													size="small"
													value={item ? item.attribute ?? "none" : "none"}
													onChange={(e) => {
														let newValue = [...value];
														newValue[index] = {
															...newValue[index],
															attribute: e.target.value,
														};
														setValue(newValue);
													}}
												>
													<MenuItem value="none" disabled>
														Attribut
													</MenuItem>
													{ATTRIBUTES.map((item) => {
														return (
															<MenuItem
																value={item.shortName}
																key={
																	item.shortName + "_select_att_weapon_wdmowdd"
																}
															>
																{item.shortName}
															</MenuItem>
														);
													})}
												</Select>
												<TextField
													label="Schaden"
													sx={{ width: "20%" }}
													size="small"
													value={item ? item.damage ?? "" : ""}
													onChange={(e) => {
														let newValue = [...value];
														newValue[index] = {
															...newValue[index],
															damage: e.target.value,
														};
														setValue(newValue);
													}}
												></TextField>
												<Select
													label="Waffentyp"
													sx={{ width: "20%" }}
													size="small"
													value={item ? item.weaponType ?? "none" : "none"}
													onChange={(e) => {
														let newValue = [...value];
														newValue[index] = {
															...newValue[index],
															weaponType: e.target.value,
														};
														setValue(newValue);
													}}
												>
													<MenuItem value="none" disabled>
														Waffentyp
													</MenuItem>
													<MenuItem value="near">Nahkampfwaffe</MenuItem>
													<MenuItem value="fern">Fernkampfwaffe</MenuItem>
												</Select>
												<TextField
													label="Beschreibung"
													sx={{ width: "100%" }}
													size="small"
													value={item ? item.description ?? "" : ""}
													onChange={(e) => {
														let newValue = [...value];
														newValue[index] = {
															...newValue[index],
															description: e.target.value,
														};
														setValue(newValue);
													}}
												></TextField>
											</div>
										</TableCell>
									</>
								) : type != "spell" ? (
									<TableCell>{item}</TableCell>
								) : (
									<TableCell>{resolveSpellName(item)}</TableCell>
								)}
								<TableCell></TableCell>
							</TableRow>
						);
					})
				) : (
					<></>
				)}
				<TableRow key={"addqdqawdsqa"}>
					<TableCell>
						<Tooltip title="Hinzufügen">
							<IconButton
								onClick={() => {
									if (!addValue) {
										return;
									}
									if (!Array.isArray(value)) {
										if (type == "spell") {
											setValue([addValue.id]);
											setAddValue(undefined);
											return;
										}
										setValue([
											type != "string" && type != "weapon"
												? addValue.name
												: addValue,
										]);
										setAddValue(type != "weapon" ? undefined : {});
										return;
									}
									if (type == "spell") {
										setValue([...value, addValue.id]);
										setAddValue(undefined);
										return;
									}
									setValue([
										...value,
										type != "string" && type != "weapon"
											? addValue.name
											: addValue,
									]);
									setAddValue(type != "weapon" ? undefined : {});
								}}
							>
								{" "}
								<Add></Add>
							</IconButton>
						</Tooltip>
					</TableCell>
					<TableCell>
						{type == "string" ? (
							<TextField
								onChange={(e) => {
									setAddValue(e.target.value);
								}}
								label="Text"
								fullWidth
								size="small"
								value={addValue ?? ""}
							></TextField>
						) : type == "weapon" ? (
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
									value={addValue ? addValue.name ?? "" : ""}
									onChange={(e) => {
										setAddValue((prev: any) => ({
											...prev,
											name: e.target.value,
											ubung: true,
										}));
									}}
								></TextField>
								<TextField
									label="Reichweite"
									sx={{ width: "20%" }}
									size="small"
									value={addValue ? addValue.range ?? "" : ""}
									onChange={(e) => {
										setAddValue((prev: any) => ({
											...prev,
											range: e.target.value,
											ubung: true,
										}));
									}}
								></TextField>
								<Select
									label="Attribut"
									sx={{ width: "10%" }}
									size="small"
									value={addValue ? addValue.attribute ?? "none" : "none"}
									onChange={(e) => {
										setAddValue((prev: any) => ({
											...prev,
											attribute: e.target.value,
											ubung: true,
										}));
									}}
								>
									<MenuItem value="none" disabled>
										Attribut
									</MenuItem>
									{ATTRIBUTES.map((item) => {
										return (
											<MenuItem
												value={item.name}
												key={item.shortName + "_select_att_weapon_wdmowdd"}
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
									value={addValue ? addValue.damage ?? "" : ""}
									onChange={(e) => {
										setAddValue((prev: any) => ({
											...prev,
											damage: e.target.value,
											ubung: true,
										}));
									}}
								></TextField>
								<Select
									label="Waffentyp"
									sx={{ width: "20%" }}
									size="small"
									value={addValue ? addValue.weaponType ?? "none" : "none"}
									onChange={(e) => {
										setAddValue((prev: any) => ({
											...prev,
											weaponType: e.target.value,
											ubung: true,
										}));
									}}
								>
									<MenuItem value="none" disabled>
										Waffentyp
									</MenuItem>
									<MenuItem value="near">Nahkampfwaffe</MenuItem>
									<MenuItem value="fern">Fernkampfwaffe</MenuItem>
								</Select>
								<TextField
									label="Beschreibung"
									sx={{ width: "100%" }}
									size="small"
									value={addValue ? addValue.description ?? "" : ""}
									onChange={(e) => {
										setAddValue((prev: any) => ({
											...prev,
											description: e.target.value,
											ubung: true,
										}));
									}}
								></TextField>
							</div>
						) : (
							<Autocomplete
								options={filterPossibilities()}
								isOptionEqualToValue={(option, value) => {
									if (!value) {
										return false;
									}
									if (type == "spell") {
										return option.id == value.id;
									}
									return option.name == value.name;
								}}
								getOptionLabel={(option: any) => {
									if (!option) {
										return "";
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
								onChange={(event, newValue: any) => {
									setAddValue(newValue);
								}}
								size="small"
								value={addValue}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Searchable Select"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						)}
					</TableCell>
					<TableCell></TableCell>
				</TableRow>
			</Table>
		</TableContainer>
	);
}
