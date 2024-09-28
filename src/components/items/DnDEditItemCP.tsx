import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
	Button,
	IconButton,
	Paper,
	Tab,
	Tooltip,
	Typography,
} from "@mui/material";
import { useState } from "react";
import DnDCharacterCoreTab from "../character/DnDCharacterCoreTab";
import { useOpenConstants } from "@/utils/customHooks";
import DnDEditItemEffect from "./DnDEditItemEffect";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { DnDEditPaper } from "../basic/DnDStyledComponents";

export default function DnDEditItemCP({
	item,
	onSave,
	onExit,
}: {
	item: any;
	onSave: (itemData: any) => void;
	onExit: () => void;
}) {
	const [itemData, setItemData] = useState<any>(
		item ?? {
			name: "",
			description: "",
			type: "item",
			secret: "",
			custom: true,
			equip: "no",
			data: {},
		}
	);
	const [tab, setTab] = useState("basic");

	const constData = useOpenConstants();

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
						{item ? "Bearbeite" : "Erstelle"} Item {itemData.name}
						<Tooltip title="Lösche Item">
							<IconButton
								onClick={async () => {
									await axios.post("/api/item/deleteItem", { id: item.id });
									onExit();
								}}
							>
								<Delete></Delete>
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
						{itemData.type == "weapon" ? (
							<Tab label="Waffe" value="weapon"></Tab>
						) : (
							<></>
						)}
						<Tab label="Spezial Fähigkeiten" value="spezial"></Tab>
					</TabList>
					<DnDCharacterCoreTab
						character={itemData}
						setCharacter={setItemData}
						constData={constData}
						fields={[
							{
								location: "id",
								description: "",
								tab: "",
								title: "ID",
								type: "string",
								disabled: item ? true : false,
							},
							{
								location: "name",
								description: "",
								tab: "",
								title: "Name",
								type: "string",
							},
							{
								location: "type",
								description: "",
								tab: "",
								choices: [
									{
										value: "item",
										name: "Item",
									},
									{
										value: "weapon",
										name: "Waffe",
									},
								],
								title: "Typ",
								type: "choice",
							},
							{
								location: "equip",
								description: "",
								tab: "",
								choices: [
									{ value: "no", name: "Kein Slot" },
									{ value: "armor", name: "Rüstung" },
									{ value: "hand", name: "Hand" },
								],
								type: "choice",
								title: "Ausrüstungsplatz",
							},
							{
								location: "description",
								description: "",
								tab: "",
								title: "Beschreibung",
								type: "string",
								multiline: true,
							},
							{
								location: "secret",
								description: "",
								tab: "",
								title: "Geheime Infos",
								type: "string",
								multiline: true,
							},
							{
								location: "data.value",
								description: "",
								tab: "",
								title: "Wert",
								type: "string",
								multiline: true,
							},
							{
								location: "data.group",
								description: "",
								tab: "",
								title: "Item Gruppe",
								type: "string",
							},
						]}
						tabValue="basic"
					></DnDCharacterCoreTab>
					{itemData.type == "weapon" ? (
						<DnDCharacterCoreTab
							character={itemData}
							setCharacter={setItemData}
							constData={constData}
							fields={[
								{
									location: "data.weapon.damage",
									description: "",
									tab: "",
									title: "Schaden",
									type: "string",
								},
								{
									location: "data.weapon.range",
									description: "",
									tab: "",
									title: "Reichweite",
									type: "string",
								},
								{
									location: "data.weapon.weaponType",
									description: "",
									tab: "",
									choices: ["Nahkampfwaffe", "Fernkampfwaffe"],
									title: "Typ",
									type: "choice",
								},
								{
									location: "data.weapon.attribute",
									description: "",
									tab: "",
									title: "Waffenattribut",
									type: "attributes",
								},

								{
									location: "data.weapon.description",
									description: "",
									tab: "",
									title: "Beschreibung",
									type: "string",
									multiline: true,
								},
							]}
							tabValue="weapon"
						></DnDCharacterCoreTab>
					) : (
						<></>
					)}
					<TabPanel value="spezial">
						<DnDEditItemEffect
							title="Ausrüsten"
							value={itemData.data.onEquip ?? []}
							setValue={(newValue) => {
								setItemData((prev) => ({
									...prev,
									data: {
										...prev.data,
										onEquip: newValue,
									},
								}));
							}}
						></DnDEditItemEffect>
						<DnDEditItemEffect
							title="Kurze Rast"
							value={itemData.data.onShortRest ?? []}
							setValue={(newValue) => {
								setItemData((prev) => ({
									...prev,
									data: {
										...prev.data,
										onShortRest: newValue,
									},
								}));
							}}
						></DnDEditItemEffect>
						<DnDEditItemEffect
							title="Lange Rast"
							value={itemData.data.onLongRest ?? []}
							setValue={(newValue) => {
								setItemData((prev) => ({
									...prev,
									data: {
										...prev.data,
										onLongRest: newValue,
									},
								}));
							}}
						></DnDEditItemEffect>

						<DnDEditItemEffect
							title="Ablegen"
							value={itemData.data.onUnequip ?? []}
							setValue={(newValue) => {
								setItemData((prev) => ({
									...prev,
									data: {
										...prev.data,
										onUnequip: newValue,
									},
								}));
							}}
						></DnDEditItemEffect>
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
							onExit();
						}}
						sx={{ marginRight: 2 }}
					>
						Abbrechen
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={async () => {
							await onSave(itemData);
						}}
					>
						Speichern
					</Button>
				</div>
			</DnDEditPaper>
		</>
	);
}
