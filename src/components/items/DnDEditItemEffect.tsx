import { Add, Delete } from "@mui/icons-material";
import {
	Checkbox,
	IconButton,
	Table,
	TableCell,
	TableContainer,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { useState } from "react";

export default function DnDEditItemEffect({
	value,
	setValue,
	title,
}: {
	value: any[];
	setValue: (newValue) => void;
	title: string;
}) {
	const [addValue, setAddValue] = useState<any>({ location: "", command: "" });
	return (
		<div style={{ width: "100%" }}>
			<Typography variant="h4">{title}</Typography>
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
						<TableCell sx={{ width: "400px" }}>Location</TableCell>
						<TableCell sx={{ width: "400px" }}>Command</TableCell>
						<TableCell sx={{ width: "100px" }}>Array</TableCell>
						<TableCell sx={{}} />
					</TableRow>
					{value.map((item: any, index: any) => {
						return (
							<TableRow key={item + "qendnwida" + index}>
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
								<TableCell>{item.location}</TableCell>
								<TableCell>{item.command}</TableCell>
								<TableCell>{item.array ? <b>JA</b> : <b>NEIN</b>}</TableCell>
							</TableRow>
						);
					})}
					<TableRow key={"addqdqawdsqa"}>
						<TableCell>
							<Tooltip title="Hinzufügen">
								<IconButton
									onClick={() => {
										if (!Array.isArray(value)) {
											setValue([addValue]);
											setAddValue({ location: "", command: "" });
											return;
										}

										setValue([...value, addValue]);
										setAddValue({ location: "", command: "" });
									}}
								>
									{" "}
									<Add></Add>
								</IconButton>
							</Tooltip>
						</TableCell>
						<TableCell>
							<TextField
								onChange={(e) => {
									setAddValue((prev) => ({
										...prev,
										location: e.target.value,
									}));
								}}
								label="Location"
								fullWidth
								size="small"
								value={addValue.location}
							></TextField>
						</TableCell>
						<TableCell>
							<TextField
								onChange={(e) => {
									setAddValue((prev) => ({
										...prev,
										command: e.target.value,
									}));
								}}
								label="Command"
								fullWidth
								size="small"
								value={addValue.command}
							></TextField>
						</TableCell>
						<TableCell>
							<Checkbox
								onChange={(e) => {
									setAddValue((prev) => ({
										...prev,
										array: e.target.checked,
									}));
								}}
								size="small"
								checked={addValue.array ?? false}
							></Checkbox>
						</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</Table>
			</TableContainer>
		</div>
	);
}
