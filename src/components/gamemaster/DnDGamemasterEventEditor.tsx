import { useWorld } from "@/utils/customHooks";
import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function DnDGamemasterEventEditor({
	item,
	edit,
	game,
	save,
	tick,
}: {
	item: any;
	edit: boolean;

	game: any;
	tick: any;
	save: (data) => void;
}) {
	const [betweenData, setBetweenData] = useState(item);

	const world = useWorld(
		game && game.worldData ? game.worldData.id : undefined,
		tick
	);
	const convertDateStringToDate = (dateString: string) => {
		if (!world) {
			return 0;
		}
		let daysPerYear = 0;
		for (let m of world.month) {
			daysPerYear += parseInt(m.days);
		}
		let year = parseInt(dateString.split(".")[2]);
		let month = parseInt(dateString.split(".")[1]);
		let day = parseInt(dateString.split(".")[0]);
		let d = year * daysPerYear + day;
		for (let i = 1; i < month; i++) {
			d += parseInt(world.month[i - 1].days);
		}

		return d;
	};

	const convertDateToString = (date: number) => {
		if (!world) {
			return date;
		}
		let daysPerYear = 0;
		for (let m of world.month) {
			daysPerYear += parseInt(m.days);
		}
		let year = Math.floor(date / daysPerYear);
		date = date % daysPerYear;

		if (date == 0) {
			return { day: 1, month: 1, year: year };
		}
		let i = 0;
		let month = 1;
		let day = 1;
		for (let m of world.month) {
			i++;
			if (date - parseInt(m.days) > 0) {
				date -= parseInt(m.days);
				continue;
			}
			month = i;
			day = date;
			break;
		}

		return day + "." + month + "." + year;
	};

	const convertTimeToString = (time: number) => {
		let hours = Math.floor(time / 60);
		let minutes = time % 60;
		return (
			(hours < 10 ? "0" : "") +
			hours +
			":" +
			(minutes < 10 ? "0" : "") +
			minutes
		);
	};
	const convertStringToTime = (timeString: string) => {
		let hours = parseInt(timeString.split(":")[0]);
		let minutes = parseInt(timeString.split(":")[1]);
		return hours * 60 + minutes;
	};

	useEffect(() => {
		if (!item) {
			setBetweenData(undefined);
			return;
		}
		if (!edit || !betweenData || item.id != betweenData.id) {
			setBetweenData({
				...item,
				time: convertTimeToString(parseInt(item.time)),
				date: convertDateToString(parseInt(item.date)),
			});
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
					value={betweenData.etype ?? "side"}
					onChange={(e) => {
						setBetweenData((prev) => ({ ...prev, etype: e.target.value }));
					}}
				>
					<MenuItem value="quest">Quest</MenuItem>
					<MenuItem value="action">Aktion</MenuItem>
					<MenuItem value="fight">Kampf</MenuItem>
					<MenuItem value="rast">Rast</MenuItem>
					<MenuItem value="other">Sonstiges</MenuItem>
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
					{betweenData.etype == "quest"
						? "Quest"
						: betweenData.etype == "action"
							? "Aktion"
							: betweenData.etype == "fight"
								? "Kampf"
								: betweenData.etype == "rast"
									? "Rast"
									: "Sonstiges"}
				</Typography>
			)}
			{betweenData.etype == "rast" ? (
				<Typography variant="h5">Rast-Art:</Typography>
			) : (
				<></>
			)}
			{betweenData.etype == "rast" ? (
				edit ? (
					<Select
						value={betweenData.rtype}
						onChange={(e) => {
							setBetweenData((prev) => ({ ...prev, rtype: e.target.value }));
						}}
					>
						<MenuItem value="short">Kurze Rast</MenuItem>
						<MenuItem value="long">Lange Rast</MenuItem>
					</Select>
				) : (
					<Typography
						sx={{
							textAlign: "left",
							fontSize: "15pt",
							marginTop: "3px",
						}}
					>
						{betweenData.rtype == "short" ? "Kurze Rast" : "Lange Rast"}
					</Typography>
				)
			) : (
				<></>
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
			<Typography variant="h5">Datum</Typography>
			<EditViewTextField
				value={betweenData.date ?? ""}
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
				onChange={(e) => {
					setBetweenData((prev) => ({ ...prev, date: e.target.value }));
				}}
			>
				<Typography
					sx={{
						textAlign: "left",
						fontSize: "15pt",
						marginTop: "3px",
					}}
					variant="body1"
				>
					{betweenData.date}
				</Typography>
			</EditViewTextField>
			<Typography variant="h5">Uhrzeit</Typography>
			<EditViewTextField
				value={betweenData.time ?? ""}
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
				onChange={(e) => {
					setBetweenData((prev) => ({ ...prev, time: e.target.value }));
				}}
			>
				<Typography
					sx={{
						textAlign: "left",
						fontSize: "15pt",
						marginTop: "3px",
					}}
					variant="body1"
				>
					{betweenData.time}
				</Typography>
			</EditViewTextField>
			{betweenData.etype == "rast" ? (
				<Typography
					sx={{
						textAlign: "left",
						fontSize: "15pt",
						marginTop: "3px",
					}}
				>
					{betweenData.used ? "Durchgeführt" : "Offen"}
				</Typography>
			) : (
				<></>
			)}
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
							save({
								...betweenData,
								time: convertStringToTime(betweenData.time) + "",
								date: convertDateStringToDate(betweenData.date) + "",
							});
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
