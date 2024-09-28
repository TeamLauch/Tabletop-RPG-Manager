import { createCharacterForFill, fillCharacterSheet } from "@/utils/pdfFill";
import {
	Delete,
	Download,
	CompareArrows,
	UploadFile,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ImageIcon from "@mui/icons-material/Image";
import {
	Button,
	FormControl,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Tab,
	Tooltip,
	Typography,
	styled,
	css,
	Backdrop,
	InputLabel,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ATTRIBUTES, getCombinedFields } from "@/utils/constants";
import { useOpenConstants, useUsernames } from "@/utils/customHooks";
import { deleteCharacter } from "@/utils/character";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import DnDCharacterCoreTab from "./DnDCharacterCoreTab";
import { DnDEditPaper } from "../basic/DnDStyledComponents";

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

const ModalContent = styled("div")(
	({ theme }) => css`
		font-family: "IBM Plex Sans", sans-serif;
		font-weight: 500;
		text-align: start;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 8px;
		overflow: hidden;
		background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
		border-radius: 8px;
		border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
		box-shadow: 0 4px 12px
			${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
		padding: 24px;
		color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

		& .modal-title {
			margin: 0;
			line-height: 1.5rem;
			margin-bottom: 8px;
		}

		& .modal-description {
			margin: 0;
			line-height: 1.5rem;
			font-weight: 400;
			color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
			margin-bottom: 4px;
		}
	`
);
const StyledBackdrop = styled(Backdrop)`
	z-index: -1;
	position: fixed;
	inset: 0;
	-webkit-tap-highlight-color: transparent;
`;

const Modal = styled(BaseModal)`
	position: fixed;
	z-index: 1300;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

/**
 *
 * @param character Character Data
 * @param w Margin NavBar
 * @param save Saves Character to Database
 * @param close Abort Function
 * @returns A Componentn for Editing Characters
 */
export default function DnDEditCharacter({
	character,
	save,
	close,
}: {
	character: any;
	save: (character: any) => void;
	close: () => void;
}) {
	const [tabs, setTabs] = useState<string[]>([]);
	const [fields, setFields] = useState<any[]>([]);
	const [currentCharacter, setCurrentCharacter] = useState<any>({});
	const [tab, setTab] = useState<string>("Basis");
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const usernames = useUsernames();
	const [selected, setSelected] = useState<string | undefined>(undefined);

	const handleTransfere = async (id: any, username: any) => {
		const res = await axios.post("/api/character/transfereCharacter", {
			id: id,
			newOwner: username,
		});
		if (res.status == 200) {
			window.location.href = "/ownCharacters";
		} else {
			console.log("error while transfering character");
		}
	};

	/**
	 *
	 * @param event Event of the Input
	 */
	const handleFileUpload = async (event: any) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append("file", file);
		formData.append("id", character.id);

		// Send formData to server-side endpoint
		const response = await fetch("/api/file/uploadCha", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
		} else {
			// Handle error
		}
	};

	/**
	 *
	 * @param tab Name of the Tab
	 * @returns All Fields of this Tab
	 */
	const getFieldsForTab = (tab: string) => {
		let f = [];
		for (let field of fields) {
			if (field.tab == tab) {
				f.push(field);
			}
		}
		return f;
	};

	/**
	 *
	 * @param fields Array of Fields
	 * @returns Returns the Names of all Tabs the Fields are in
	 */
	const getTabsFromFields = (fields: any[]) => {
		let tabs: string[] = [];
		for (let field of fields) {
			if (!tabs.includes(field.tab)) {
				tabs.push(field.tab);
			}
		}
		return tabs;
	};

	/**
	 * Setup for all States
	 */
	useEffect(() => {
		if (!character) {
			return;
		}
		let fields = getCombinedFields(character.fields);
		setFields(fields);
		setTabs(getTabsFromFields(fields));
		setCurrentCharacter(character);
	}, [character]);

	const constData = useOpenConstants();
	const [outputPdfBytes, setOutputPdfBytes] = useState<any>(null);

	/**
	 * Creates and Downloads Character PDF
	 */
	const downloadPDF = () => {
		const blob = new Blob([outputPdfBytes], { type: "application/pdf" });
		const url = URL.createObjectURL(blob);

		// Create a temporary anchor element
		const link = document.createElement("a");
		link.href = url;
		link.download = "filled-pdf.pdf";

		// Simulate a click on the anchor to trigger the download
		link.click();

		// Remove the temporary anchor elem
	};

	if (!constData || !tabs || !fields) {
		return <></>;
	}

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
						Bearbeite Charakter {currentCharacter.characterName}
						<Tooltip title="Charakter Löschen">
							<IconButton
								onClick={async () => {
									await deleteCharacter(character.id);
									close();
								}}
							>
								<Delete></Delete>
							</IconButton>
						</Tooltip>
						<Tooltip title="Charakter JSON herunterladen">
							<IconButton
								onClick={(e) => {
									const blob = new Blob([JSON.stringify(character)], {
										type: "text/json",
									});

									const link = document.createElement("a");
									link.download = character.id + ".json";
									link.href = window.URL.createObjectURL(blob);
									document.body.append(link);
									link.click();
									document.body.removeChild(link);
								}}
							>
								<Download></Download>
							</IconButton>
						</Tooltip>
						<Tooltip title="Charakter JSON upload">
							<IconButton role={undefined} tabIndex={-1} component="label">
								<UploadFile></UploadFile>
								<VisuallyHiddenInput
									type="file"
									onChange={(event) => {
										const file = event.target.files[0]; // Get the first selected file
										if (file) {
											const reader = new FileReader();

											// Define what happens when the file is read successfully
											reader.onload = (e) => {
												const content = e.target.result;
												if (typeof content != "string") {
													return;
												}
												setCurrentCharacter((prev) => ({
													...JSON.parse(content),
													id: prev.id,
													createdBy: prev.createdBy,
													createdAt: prev.createdAt,
												}));
											};

											// Read the file as text
											reader.readAsText(file);
										}
									}}
								/>
							</IconButton>
						</Tooltip>
						{character.id ? (
							<Tooltip title="Avatar Ändern/Hochladen">
								<IconButton role={undefined} tabIndex={-1} component="label">
									<ImageIcon></ImageIcon>
									<VisuallyHiddenInput
										type="file"
										onChange={handleFileUpload}
									/>
								</IconButton>
							</Tooltip>
						) : (
							<></>
						)}
						<Tooltip title="Charakter Transferieren" disableInteractive>
							<IconButton onClick={handleOpen}>
								<CompareArrows></CompareArrows>
							</IconButton>
						</Tooltip>
						<Modal
							aria-labelledby="unstyled-modal-title"
							aria-describedby="unstyled-modal-description"
							open={open}
							onClose={handleClose}
							slots={{ backdrop: StyledBackdrop }}
						>
							<ModalContent sx={{ width: 400 }}>
								<h2 id="unstyled-modal-title" className="modal-title">
									Benutzer für Transfere Wählen
								</h2>
								<p>Aktueller Eigentümer: {currentCharacter.ownerId}</p>
								<FormControl fullWidth>
									<InputLabel id="UserSelect">Benutzer wählen</InputLabel>
									<Select
										labelId="UserSelect"
										id="UserSelect"
										value={selected}
										label="Benutzer wählen"
										onChange={(e) => setSelected(e.target.value)}
									>
										{usernames.map((item: any) => (
											<MenuItem key={item.username} value={item.username}>
												{item.username}
											</MenuItem>
										))}
									</Select>
									<br></br>
									<Button
										onClick={() =>
											handleTransfere(currentCharacter.id, selected)
										}
										variant="outlined"
									>
										Charakter Transferieren
									</Button>
									<br></br>
									<Button
										onClick={handleClose}
										color="error"
										variant="outlined"
										size="medium"
									>
										Abbrechen
									</Button>
								</FormControl>
							</ModalContent>
						</Modal>
						<Button
							disabled={character.data.level == "20"}
							onClick={() => {
								window.location.href = "/levelUpCharacter/" + character.id;
							}}
						>
							Level UP
						</Button>
					</Typography>
				</div>
				<TabContext value={tab}>
					<TabList
						onChange={(e, newValue) => {
							setTab(newValue);
						}}
					>
						{tabs.map((item) => {
							return (
								<Tab
									key={
										"tabDeff_character_" + character.characterName + "_" + item
									}
									label={item}
									value={item}
								></Tab>
							);
						})}
					</TabList>
					{tabs.map((item) => {
						return (
							<DnDCharacterCoreTab
								key={"tab_character_" + character.characterName + "_" + item}
								constData={constData}
								character={currentCharacter}
								setCharacter={setCurrentCharacter}
								fields={getFieldsForTab(item)}
								tabValue={item}
							></DnDCharacterCoreTab>
						);
					})}
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
							await save(currentCharacter);
						}}
					>
						Speichern
					</Button>
				</div>
			</DnDEditPaper>
		</>
	);
}
