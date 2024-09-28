import { Close, Delete, Edit } from "@mui/icons-material";
import { IconButton, Paper, Tooltip, Typography } from "@mui/material";
import parse from "html-react-parser";
import { DnDEditPaper } from "../basic/DnDStyledComponents";

export default function DnDSpellPanel({
	spell,
	close,
	edit,
	onDelete,
}: {
	spell: any;
	close: any;
	edit: any;
	onDelete: any;
}) {
	const mapClassesName = () => {
		let s = "";
		spell.classes.forEach((item: any) => {
			s += item + ", ";
		});
		s = s.trimEnd().slice(0, -1);
		return s;
	};

	return (
		<DnDEditPaper
			sx={{
				display: "block",
				width: "95%",
				marginLeft: "2.5%",
				zIndex: 9,
				marginTop: "2%",
				minHeight: "80%",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					marginTop: "5px",
				}}
			>
				<Tooltip title="Zauber bearbeiten">
					<IconButton
						onClick={() => {
							edit();
						}}
					>
						<Edit></Edit>
					</IconButton>
				</Tooltip>
				{spell.custom ? (
					<Tooltip title="Zauber löschen">
						<IconButton
							onClick={() => {
								onDelete();
							}}
						>
							<Delete></Delete>
						</IconButton>
					</Tooltip>
				) : (
					<div></div>
				)}

				<Tooltip title="Close">
					<IconButton
						onClick={() => {
							close();
						}}
					>
						<Close></Close>
					</IconButton>
				</Tooltip>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					marginTop: "5px",
				}}
			>
				<Typography variant="h2">{spell.name}</Typography>
			</div>
			<Typography variant="h5">
				Level: <b>{spell.level == 0 ? "Zaubertrick" : spell.level}</b>
			</Typography>
			<Typography variant="h5">
				Schule: <b>{spell.school}</b>
			</Typography>
			<Typography variant="h5">
				Ritual: <b>{spell.ritual ? "ja" : "nein"}</b>
			</Typography>
			<Typography variant="h5">
				Ausführzeit: <b>{spell.castingTime}</b>
			</Typography>
			<Typography variant="h5">
				Reichweite: <b>{spell.range}</b>
			</Typography>
			<Typography variant="h5">
				Dauer: <b>{spell.duration}</b>
			</Typography>
			<Typography variant="h5">
				Komponenten: <b>{spell.components}</b>
			</Typography>
			{spell.material ? (
				<Typography variant="h5">
					Material: <b>{spell.material}</b>
				</Typography>
			) : (
				<></>
			)}
			<Typography variant="h5">Beschreibung:</Typography>
			<Typography variant="h6">{parse(spell.description)}</Typography>
		</DnDEditPaper>
	);
}
