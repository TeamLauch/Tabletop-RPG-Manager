import { Add, Delete } from "@mui/icons-material";
import {
	Button,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Tab,
	Table,
	TableCell,
	TableContainer,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DnDEditPaper } from "../basic/DnDStyledComponents";
import { useOpenConstants } from "@/utils/customHooks";
import DnDCharacterCoreTab from "../character/DnDCharacterCoreTab";

/**
 * @param close Abort Function
 * @param save Save Function
 * @param w Margin for NavBar
 * @param s Spell if null => creation mode
 * @returns Edit or Create a Spell
 */
export default function DnDEditSpellComponent({
	s,
	save,
	close,
}: {
	s: any;
	save: any;
	close: any;
}) {
	const [spell, setSpell] = useState({
		name: "",
		classes: [""],
		level: 0,
		duration: "unmittelbar",
		castingTime: "1 Aktion",
		range: "1,5 m",
		material: "",
		ritual: false,
		school: "none",
		description: "",
		components: "V, ",
	});
	const [tab, setTab] = useState("basic");

	const constData = useOpenConstants();

	useEffect(() => {
		if (!s) return;
		setSpell(s);
	}, [s]);

	return (
		<DnDEditPaper
			sx={{
				display: "flex",
				width: "95%",
				zIndex: 9,
				marginTop: "2%",
				minHeight: "80%",
				marginLeft: "2.5%",
				flexDirection: "column",
			}}
		>
			<div style={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
				<Typography component="h1" variant="h3">
					Bearbeite Zauber {spell.name}
				</Typography>
			</div>
			<TabContext value={tab}>
				<TabList
					onChange={(e, newValue) => {
						setTab(newValue);
					}}
				>
					<Tab label="Basis" value="basic"></Tab>
					<Tab label="Klassen" value="class"></Tab>
				</TabList>
				<DnDCharacterCoreTab
					character={spell}
					constData={constData}
					fields={[
						{
							location: "name",
							description: "",
							tab: "",
							title: "Name",
							type: "string",
						},
						{
							location: "level",
							description: "",
							tab: "",
							title: "Level",
							type: "string",
						},
						{
							location: "duration",
							description: "",
							tab: "",
							title: "Dauer",
							type: "string",
						},
						{
							location: "castingTime",
							description: "",
							tab: "",
							title: "Vorbereitungszeit",
							type: "string",
						},
						{
							location: "range",
							description: "",
							tab: "",
							title: "Reichweite",
							type: "string",
						},
						{
							location: "material",
							description: "",
							tab: "",
							title: "Material",
							type: "string",
						},
						{
							location: "components",
							description: "",
							tab: "",
							title: "Komponenten",
							type: "string",
						},
						{
							location: "school",
							description: "",
							tab: "",
							title: "Magieschule",
							type: "string",
						},
						{
							location: "ritual",
							description: "",
							tab: "",
							title: "Ritual",
							type: "boolean",
						},
						{
							location: "description",
							description: "",
							tab: "",
							title: "Beschreibung",
							type: "string",
							multiline: true,
						},
					]}
					setCharacter={setSpell}
					tabValue="basic"
				></DnDCharacterCoreTab>
				<DnDCharacterCoreTab
					character={spell}
					constData={constData}
					fields={[
						{
							location: "classes",
							description: "",
							tab: "",
							title: "Klassen",
							type: "string[]",
						},
					]}
					setCharacter={setSpell}
					tabValue="class"
				></DnDCharacterCoreTab>
			</TabContext>

			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					marginTop: 2,
					marginRight: "0.5%",
					marginBottom: "0.5%",
				}}
			>
				<Button
					variant="outlined"
					onClick={() => {
						close();
					}}
					sx={{ marginRight: 2 }}
				>
					Abbrechen
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={async () => {
						await save(spell);
					}}
				>
					Speichern
				</Button>
			</div>
		</DnDEditPaper>
	);
}
