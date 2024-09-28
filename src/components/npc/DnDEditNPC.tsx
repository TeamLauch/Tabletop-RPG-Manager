import { NPC_DEFAULT_FIELDS, getCombinedFieldsNPC } from "@/utils/constants";
import { Delete } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import {
	Button,
	IconButton,
	Paper,
	Tab,
	Tooltip,
	Typography,
	styled,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { useOpenConstants } from "@/utils/customHooks";
import DnDCharacterCoreTab from "../character/DnDCharacterCoreTab";
import { DnDEditPaper } from "../basic/DnDStyledComponents";

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

/**
 *
 * @param npc NPC data for creation empty
 * @param onSave Handles save
 * @param onClose Hanldes close
 * @returns
 */
export default function DnDEditNPC({
	npc,
	onSave,
	onClose,
}: {
	npc: any;
	onSave: (data: any) => void;
	onClose: () => void;
}) {
	const [tabs, setTabs] = useState<string[]>([]);
	const [fields, setFields] = useState<any[]>([]);
	const [currentNPC, setCurrentNPC] = useState<any>({});
	const [tab, setTab] = useState<string>("Basis");

	const getFieldsForTab = (tab: string) => {
		let f = [];
		for (let field of fields) {
			if (field.tab == tab) {
				f.push(field);
			}
		}
		return f;
	};

	const getTabsFromFields = (fields: any[]) => {
		let tabs: string[] = [];
		for (let field of fields) {
			if (!tabs.includes(field.tab)) {
				tabs.push(field.tab);
			}
		}
		return tabs;
	};

	useEffect(() => {
		if (!npc) {
			setFields(NPC_DEFAULT_FIELDS);
			setTabs(getTabsFromFields(NPC_DEFAULT_FIELDS));
			setCurrentNPC({
				name: "",
				hp: 0,
				rk: 0,
				data: {},
				volk: "",
				attributes: {},
				fields: [],
			});
			return;
		}
		let fields = getCombinedFieldsNPC(npc.fields);
		setFields(fields);
		setTabs(getTabsFromFields(fields));
		setCurrentNPC(npc);
	}, [npc]);

	const constData = useOpenConstants();

	const del = async () => {
		const res = await axios.post("/api/npc/deleteNPC", { id: npc.id });
		onSave(undefined);
	};

	const handleFileUpload = async (event: any) => {
		if (!npc) {
			return;
		}
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append("file", file);

		formData.append("id", npc.id);

		// Send formData to server-side endpoint
		const response = await fetch("/api/file/uploadNPC", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
		} else {
			// Handle error
		}
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
						{npc ? "Bearbeite" : "Erstelle"} NPC {currentNPC.name}
						<Tooltip title="NPC löschen">
							<IconButton
								onClick={async () => {
									await del();
								}}
							>
								<Delete></Delete>
							</IconButton>
						</Tooltip>
						{npc && npc.id ? (
							<Tooltip title="Avatar Hochladen">
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
										"tabDeff_npc_" + (npc ? npc.name : "newNPC") + "_" + item
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
								key={"tab_npc_" + (npc ? npc.name : "newNPC") + "_" + item}
								constData={constData}
								character={currentNPC}
								setCharacter={setCurrentNPC}
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
							await onSave(currentNPC);
						}}
					>
						Speichern
					</Button>
				</div>
			</DnDEditPaper>
		</>
	);
}
