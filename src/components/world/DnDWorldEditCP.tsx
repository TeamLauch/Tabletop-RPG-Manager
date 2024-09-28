import { Delete } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
	Button,
	IconButton,
	Paper,
	styled,
	Tab,
	Tooltip,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import DnDCharacterCoreTab from "../character/DnDCharacterCoreTab";
import { useOpenConstants } from "@/utils/customHooks";
import DnDMoonArrayInput from "./DnDMoonArrayInput";
import DnDMonthArrayInput from "./DnDMonthArrayInput";
import DnDDaysArrayInput from "./DnDDaysArrayInput";
import { DnDEditPaper } from "../basic/DnDStyledComponents";
import ImageIcon from "@mui/icons-material/Image";

/**
 * Hidden Imput for Uploading Files
 */
const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export default function DnDWorldEditCP({
	data,
	onSave,
	onClose,
}: {
	data?: any;
	onSave: (data: any) => void;
	onClose: () => void;
}) {
	const [localData, setLocalData] = useState(data ?? {});
	const [tab, setTab] = useState("basic");
	const constData = useOpenConstants();

	useEffect(() => {
		setLocalData(data ?? {});
	}, [data]);

	const handleFileUpload = async (event: any) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", data.id);

		// Send formData to server-side endpoint
		const response = await fetch("/api/file/uploadMap", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
		} else {
			// Handle error
		}
	};

	return (
		<>
			<DnDEditPaper
				sx={{
					display: "flex",
					width: "98%",
					marginLeft: "1%",
					zIndex: 9,
					marginTop: "3%",
					minHeight: "80%",
					flexDirection: "column",
				}}
			>
				<div
					style={{ display: "flex", justifyContent: "center", marginTop: 2 }}
				>
					<Typography component="h1" variant="h3">
						{data ? "Bearbeite" : "Erstelle"} Item {localData.name ?? ""}
						<Tooltip title="Lösche Item">
							<IconButton
								onClick={async () => {
									await axios.post("/api/world/deleteWorld", {
										id: localData.id,
									});
									onClose();
								}}
							>
								<Delete></Delete>
							</IconButton>
						</Tooltip>
						<Tooltip title="Map hochladen">
							<IconButton role={undefined} tabIndex={-1} component="label">
								<ImageIcon></ImageIcon>
								<VisuallyHiddenInput
									type="file"
									onChange={async (e) => {
										await handleFileUpload(e);
									}}
								/>
							</IconButton>
						</Tooltip>
					</Typography>
				</div>
				<TabContext value={tab}>
					<TabList
						onChange={(e, newValue) => {
							setTab(newValue);
						}}
					>
						<Tab label="Basis" value="basic"></Tab>
						<Tab label="Tage" value="days"></Tab>
						<Tab label="Monate" value="month"></Tab>
						<Tab label="Monde" value="moons"></Tab>
					</TabList>
					<DnDCharacterCoreTab
						character={localData}
						setCharacter={setLocalData}
						constData={constData}
						fields={[
							{
								location: "id",
								description: "",
								tab: "",
								title: "ID",
								type: "string",
								disabled: data ? true : false,
							},
							{
								location: "name",
								description: "",
								tab: "",
								title: "Name",
								type: "string",
							},
						]}
						tabValue="basic"
					></DnDCharacterCoreTab>
					<TabPanel value="days">
						<DnDDaysArrayInput
							value={localData.days ?? []}
							setValue={(data) => {
								setLocalData((prev) => ({
									...prev,
									days: data,
								}));
							}}
						></DnDDaysArrayInput>
					</TabPanel>
					<TabPanel value="month">
						<DnDMonthArrayInput
							value={localData.month ?? []}
							setValue={(data) => {
								setLocalData((prev) => ({
									...prev,
									month: data,
								}));
							}}
						></DnDMonthArrayInput>
					</TabPanel>
					<TabPanel value="moons">
						<DnDMoonArrayInput
							value={localData.moons ?? []}
							setValue={(data) => {
								setLocalData((prev) => ({
									...prev,
									moons: data,
								}));
							}}
						></DnDMoonArrayInput>
					</TabPanel>
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
							onClose();
						}}
						sx={{ marginRight: 2 }}
					>
						Abbrechen
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={async () => {
							await onSave(localData);
						}}
					>
						Speichern
					</Button>
				</div>
			</DnDEditPaper>
		</>
	);
}
