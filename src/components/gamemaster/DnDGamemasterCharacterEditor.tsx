import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function DnDGamemasterCharacterEditor({
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
			<Typography variant="h6">Beschreibung:</Typography>
			<EditViewTextField
				value={betweenData.description ?? ""}
				label="Beschreibung"
				style={
					!edit
						? {
								textAlign: "left",
								fontSize: "15pt",
								marginTop: "3px",
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
			<Typography variant="h6">Herkunft:</Typography>
			<EditViewTextField
				value={betweenData.origin ?? ""}
				label="Beschreibung"
				style={
					!edit
						? {
								textAlign: "left",
								fontSize: "15pt",
								marginTop: "3px",
							}
						: undefined
				}
				edit={edit}
				multiline
				onChange={(e) => {
					setBetweenData((prev) => ({ ...prev, origin: e.target.value }));
				}}
			>
				<Typography variant="body1">{betweenData.origin}</Typography>
			</EditViewTextField>
			<Typography variant="h6">Motive und Ziele:</Typography>
			<EditViewTextField
				value={betweenData.motives ?? ""}
				label="Beschreibung"
				style={
					!edit
						? {
								textAlign: "left",
								fontSize: "15pt",
								marginTop: "3px",
							}
						: undefined
				}
				edit={edit}
				multiline
				onChange={(e) => {
					setBetweenData((prev) => ({ ...prev, motives: e.target.value }));
				}}
			>
				<Typography variant="body1">{betweenData.motives}</Typography>
			</EditViewTextField>
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
