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
export default function DnDMoonArrayInput({
	value,
	setValue,
}: Readonly<{
	value: any[];
	setValue: (value: any[]) => void;
}>) {
	const [addValue, setAddValue] = useState<any>({});

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
					<TableCell sx={{ width: "200px" }}>Periode</TableCell>
					<TableCell sx={{ width: "200px" }}>Offset</TableCell>
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
											<Delete></Delete>
										</IconButton>
									</Tooltip>
								</TableCell>
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.period}</TableCell>
								<TableCell>{item.offset}</TableCell>
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
									setAddValue({});
								}}
							>
								<Add></Add>
							</IconButton>
						</Tooltip>
					</TableCell>
					<TableCell>
						<TextField
							fullWidth
							value={addValue.name ?? ""}
							onChange={(e) => {
								setAddValue((prev) => ({ ...prev, name: e.target.value }));
							}}
							size="small"
						></TextField>
					</TableCell>
					<TableCell>
						<TextField
							fullWidth
							value={addValue.period ?? ""}
							onChange={(e) => {
								setAddValue((prev) => ({ ...prev, period: e.target.value }));
							}}
							size="small"
						></TextField>
					</TableCell>
					<TableCell>
						<TextField
							fullWidth
							value={addValue.offset ?? ""}
							onChange={(e) => {
								setAddValue((prev) => ({ ...prev, offset: e.target.value }));
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
