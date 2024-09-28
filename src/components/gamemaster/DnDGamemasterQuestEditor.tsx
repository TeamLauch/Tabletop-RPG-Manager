import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function DnDGamemasterQuestEditor({
	item,
	edit,
	save,
}: {
	item: any;
	edit: boolean;
	save: (data) => void;
}) {
	const [betweenData, setBetweenData] = useState(item);

	useEffect(() => {
		if (!item) {
			setBetweenData(undefined);
			return;
		}
		if (!edit || !betweenData || item.id != betweenData.id) {
			setBetweenData(item);
		}
	}, [edit, item]);

	if (!betweenData) {
		return (
			<div
				style={{
					flexDirection: "column",
					display: "flex",
					margin: "5px",
					padding: "5px",
					border: "1px solid black",
					borderRadius: "5px",
				}}
			></div>
		);
	}
	return (
		<div
			style={{
				flexDirection: "column",
				display: "flex",
				margin: "5px",
				padding: "5px",
				border: "1px solid black",
				borderRadius: "5px",
			}}
		>
			<EditViewTextField
				value={betweenData.name}
				label="Name"
				style={
					!edit
						? {
								textAlign: "center",
								fontSize: "20pt",
								marginBottom: "10px",
							}
						: undefined
				}
				edit={edit}
				onChange={(e) => {
					setBetweenData((prev) => ({ ...prev, name: e.target.value }));
				}}
			>
				<Typography variant="h4">{betweenData.name}</Typography>
			</EditViewTextField>

			<Typography variant="h5">Typ:</Typography>
			{edit ? (
				<Select
					value={betweenData.qtype ?? "side"}
					onChange={(e) => {
						setBetweenData((prev) => ({ ...prev, qtype: e.target.value }));
					}}
				>
					<MenuItem value="main">Hauptquest</MenuItem>
					<MenuItem value="side">Nebenquest</MenuItem>
				</Select>
			) : (
				<Typography
					sx={{
						textAlign: "left",
						fontSize: "15pt",
						marginTop: "3px",
					}}
					variant="body1"
				>
					{betweenData.qtype == "main" ? "Hauptquest" : "Nebenquest"}
				</Typography>
			)}
			<Typography variant="h5">Beschreibung:</Typography>
			<EditViewTextField
				value={betweenData.description ?? ""}
				label="Beschreibung"
				style={
					!edit
						? {
								textAlign: "left",
								fontSize: "15pt",
								marginTop: "3px",
								whiteSpace: "pre-line",
							}
						: undefined
				}
				edit={edit}
				multiline
				onChange={(e) => {
					setBetweenData((prev) => ({ ...prev, description: e.target.value }));
				}}
			>
				<Typography variant="body1">{betweenData.description}</Typography>
			</EditViewTextField>
			<Typography variant="h5">Geheim Info:</Typography>
			<EditViewTextField
				value={betweenData.gmInfo ?? ""}
				style={
					!edit
						? {
								textAlign: "left",
								fontSize: "15pt",
								marginTop: "3px",
								whiteSpace: "pre-line",
							}
						: undefined
				}
				edit={edit}
				multiline
				onChange={(e) => {
					setBetweenData((prev) => ({ ...prev, gmInfo: e.target.value }));
				}}
			>
				<Typography variant="body1">{betweenData.gmInfo}</Typography>
			</EditViewTextField>
			<Typography variant="h5">Aktiv</Typography>

			<Typography
				sx={{
					textAlign: "left",
					fontSize: "15pt",
					marginTop: "3px",
				}}
				variant="body1"
			>
				{betweenData.active ? "Ja" : "Nein"}
			</Typography>

			<Typography variant="h5">Abgeschlossen</Typography>

			<Typography
				sx={{
					textAlign: "left",
					fontSize: "15pt",
					marginTop: "3px",
				}}
				variant="body1"
			>
				{betweenData.solved ? "Ja" : "Nein"}
			</Typography>

			{edit ? (
				<div
					style={{
						width: "100%",
						margin: "5px",
						display: "flex",
						justifyContent: "right",
					}}
				>
					<Button
						variant="contained"
						color="success"
						onClick={() => {
							save(betweenData);
						}}
					>
						Speichern
					</Button>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

function EditViewTextField(props) {
	if (props.edit) {
		return <TextField {...props} children={undefined}></TextField>;
	}
	return <div {...props}>{props.children}</div>;
}
