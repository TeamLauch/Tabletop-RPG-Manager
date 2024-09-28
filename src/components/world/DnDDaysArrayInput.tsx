import { ATTRIBUTES, getPossibilities } from "@/utils/constants";
import { Add, ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";
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
export default function DnDDaysArrayInput({
	value,
	setValue,
}: Readonly<{
	value: any[];
	setValue: (value: any[]) => void;
}>) {
	const [addValue, setAddValue] = useState<any>("");

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
					<TableCell sx={{ width: "400px" }}>Name</TableCell>
					<TableCell sx={{}} />
				</TableRow>
				{Array.isArray(value) ? (
					value.map((item: any, index: any) => {
						return (
							<TableRow key={item + "qendnwi" + index}>
								<TableCell>
									<Tooltip title="Vorreihen">
										<IconButton
											disabled={index == 0}
											onClick={() => {
												let newVal = [...value];
												newVal[index - 1] = newVal[index];
												newVal[index] = value[index - 1];
												setValue(newVal);
											}}
										>
											<ArrowUpward></ArrowUpward>
										</IconButton>
									</Tooltip>
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
											<Delete></Delete>
										</IconButton>
									</Tooltip>
									<Tooltip title="Nachreihen">
										<IconButton
											disabled={index == value.length - 1}
											onClick={() => {
												let newVal = [...value];
												newVal[index + 1] = newVal[index];
												newVal[index] = value[index + 1];
												setValue(newVal);
											}}
										>
											<ArrowDownward></ArrowDownward>
										</IconButton>
									</Tooltip>
								</TableCell>
								<TableCell>{item}</TableCell>
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
									setValue([...value, addValue]);
									setAddValue("");
								}}
							>
								<Add></Add>
							</IconButton>
						</Tooltip>
					</TableCell>
					<TableCell>
						<TextField
							fullWidth
							value={addValue}
							onChange={(e) => {
								setAddValue(e.target.value);
							}}
							size="small"
						></TextField>
					</TableCell>
					<TableCell></TableCell>
				</TableRow>
			</Table>
		</TableContainer>
	);
}