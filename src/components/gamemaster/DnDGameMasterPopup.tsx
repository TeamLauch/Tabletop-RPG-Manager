import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Button,
	Checkbox,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useItems } from "@/utils/customHooks";
import DnDPopUpMenu from "../basic/DnDPopupMenu";
import { Casino, CheckBox } from "@mui/icons-material";
import { getFieldData, updateFieldFunction } from "@/utils/dataHelper";
import { ATTRIBUTES } from "@/utils/constants";
/**
 *
 * Popup for Managing and Setting
 *
 * @parma id
 * * 0 => Neuer NPC
 * * 1 => Zeige NPC
 * * 2 => Neue NPC Gruppe
 * * 3 => Verwandle
 * * 4 => Zeige Spieler
 * * 5 => Add Item
 * * 6 => Edit Item
 * * 7 => Free
 * * 8 => Create Map
 * * 9 => Create Note
 * * 10 => Move Player to Map
 * * 11 => Change Token Color
 * * 12 => Add Fight
 * * 13 => Player selection
 */
export default function DnDGameMasterPopup({
	id,
	data,
	onSave,
	onClose,
}: {
	id: number;
	data: any;
	onSave: (data: any) => void;
	onClose: () => void;
}) {
	const [localData, setLocalData] = useState<any>();
	const [inputValues, setInputValues] = useState<any>({});

	useEffect(() => {
		setLocalData({});
		setInputValues({});
	}, [data]);

	const getFighterFromId = (fighter: any, id: any) => {
		if (!fighter) {
			return undefined;
		}
		for (let f of fighter) {
			if (f.id == id) {
				return f;
			}
		}
		return undefined;
	};

	const items = useItems();

	switch (id) {
		case 0:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Register NPC"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<Autocomplete
							fullWidth
							sx={{ marginBottom: "10px" }}
							options={data.npcs}
							isOptionEqualToValue={(option, value) => {
								return option.name == value.name;
							}}
							getOptionLabel={(option: any) => option.name}
							inputValue={inputValues.npcAuto ?? ""}
							onInputChange={(event, newInputValue) => {
								if (!event) {
									return;
								}
								setInputValues((prev) => ({
									...prev,
									npcAuto: newInputValue,
								}));
							}}
							onChange={(event, newValue: any) => {
								setLocalData({
									...localData,
									npc: newValue,
								});
							}}
							size="small"
							value={localData.npc ?? { name: "" }}
							renderInput={(params) => (
								<TextField
									{...params}
									label="NPC"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<TextField
							sx={{ marginBottom: "10px" }}
							fullWidth
							size="small"
							value={localData.name ?? ""}
							onChange={(e) => {
								setLocalData({
									...localData,
									name: e.target.value,
								});
							}}
						></TextField>
						<Button
							sx={{ marginBottom: "10px" }}
							fullWidth
							size="small"
							variant="contained"
							onClick={async () => {
								await onSave(localData);
							}}
						>
							Hinzufügen
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 1:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Show NPC"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<Autocomplete
							fullWidth
							sx={{ marginBottom: "10px" }}
							options={data.npcs}
							isOptionEqualToValue={(option, value) => {
								return option.name == value.name;
							}}
							getOptionLabel={(option: any) => option.name}
							onChange={(event, newValue: any) => {
								setLocalData({
									...localData,
									npc: newValue,
								});
							}}
							inputValue={inputValues.npcAuto ?? ""}
							onInputChange={(event, newInputValue) => {
								if (!event) {
									return;
								}
								setInputValues((prev) => ({
									...prev,
									npcAuto: newInputValue,
								}));
							}}
							size="small"
							value={localData.npc ?? { name: "" }}
							renderInput={(params) => (
								<TextField
									{...params}
									label="NPC"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave(localData);
							}}
						>
							Zeigen
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 2:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Register NPC"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<Autocomplete
							fullWidth
							sx={{ marginBottom: "10px" }}
							options={data.npcs}
							isOptionEqualToValue={(option, value) => {
								return option.name == value.name;
							}}
							getOptionLabel={(option: any) => option.name}
							onChange={(event, newValue: any) => {
								setLocalData({
									...localData,
									npc: newValue,
								});
							}}
							inputValue={inputValues.npcAuto ?? ""}
							onInputChange={(event, newInputValue) => {
								if (!event) {
									return;
								}
								setInputValues((prev) => ({
									...prev,
									npcAuto: newInputValue,
								}));
							}}
							size="small"
							value={localData.npc ?? { name: "" }}
							renderInput={(params) => (
								<TextField
									{...params}
									label="NPC"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<TextField
							sx={{ marginBottom: "10px" }}
							fullWidth
							size="small"
							value={localData.name ?? ""}
							onChange={(e) => {
								setLocalData({
									...localData,
									name: e.target.value,
								});
							}}
						></TextField>
						<TextField
							sx={{ marginBottom: "10px" }}
							fullWidth
							label="Anzahl"
							size="small"
							value={localData.amount ?? ""}
							onChange={(e) => {
								setLocalData({
									...localData,
									amount: e.target.value,
								});
							}}
						></TextField>
						<Button
							sx={{ marginBottom: "10px" }}
							fullWidth
							size="small"
							variant="contained"
							onClick={async () => {
								await onSave(localData);
							}}
						>
							Hinzufügen
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 3:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Verwandle Player"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<Autocomplete
							fullWidth
							sx={{ marginBottom: "10px" }}
							options={data.npcs}
							isOptionEqualToValue={(option, value) => {
								return option.name == value.name;
							}}
							getOptionLabel={(option: any) => option.name}
							onChange={(event, newValue: any) => {
								setLocalData({
									...localData,
									npc: newValue,
									players: data.players,
								});
							}}
							inputValue={inputValues.npcAuto ?? ""}
							onInputChange={(event, newInputValue) => {
								if (!event) {
									return;
								}
								setInputValues((prev) => ({
									...prev,
									npcAuto: newInputValue,
								}));
							}}
							size="small"
							value={localData.npc ?? { name: "" }}
							renderInput={(params) => (
								<TextField
									{...params}
									label="NPC"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave(localData);
							}}
						>
							Verwandle
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 4:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Zeige Spieler"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<Autocomplete
							fullWidth
							sx={{ marginBottom: "10px" }}
							options={data.players}
							isOptionEqualToValue={(option, value) => {
								return option.owner == value.owner;
							}}
							getOptionLabel={(option: any) => option.owner}
							onChange={(event, newValue: any) => {
								setLocalData({
									...localData,
									player: newValue,
								});
							}}
							inputValue={inputValues.npcAuto ?? ""}
							onInputChange={(event, newInputValue) => {
								if (!event) {
									return;
								}
								setInputValues((prev) => ({
									...prev,
									npcAuto: newInputValue,
								}));
							}}
							size="small"
							value={localData.player ?? { owner: "" }}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Spieler"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave(localData);
							}}
						>
							Zeigen
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 5:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Erstelle Item"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<Autocomplete
							fullWidth
							sx={{ marginBottom: "10px", marginLeft: "3px" }}
							options={[{ name: "custom", id: "-1" }, ...items]}
							isOptionEqualToValue={(option, value) => {
								return option.id == value;
							}}
							inputValue={inputValues.items ?? ""}
							onInputChange={(event, newInputValue) => {
								if (!event) {
									return;
								}
								setInputValues((prev) => ({
									...prev,
									items: newInputValue,
								}));
							}}
							getOptionLabel={(option: any) => {
								if (typeof option == "string") {
									for (let item of items) {
										if (item.id == option) {
											return item.name;
										}
									}
									return "Custom";
								}
								return option.name;
							}}
							onChange={(event, newValue: any) => {
								setLocalData((prev: any) => ({
									...prev,
									equip: newValue.equip,
									data: newValue.data,
									type: newValue.type,
									parent: newValue.id,
									name: newValue.name,
									description: newValue.description,
									gmInfo: newValue.secret,
								}));
							}}
							size="small"
							value={localData.parent ?? "-1"}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Parent Item"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Select
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.type ?? "none"}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									type: e.target.value,
								}));
							}}
						>
							<MenuItem value="none" disabled>
								Typ
							</MenuItem>
							<MenuItem value="item">Item</MenuItem>
							<MenuItem value="weapon">Waffe</MenuItem>
						</Select>
						<TextField
							label="Name"
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.name ?? ""}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									name: e.target.value,
								}));
							}}
						/>
						<TextField
							label="Beschreibung"
							multiline
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.description ?? ""}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									description: e.target.value,
								}));
							}}
						/>
						<TextField
							label="Geheime Infos"
							multiline
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.gmInfo ?? ""}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									gmInfo: e.target.value,
								}));
							}}
						/>
						{localData.type == "weapon" ? (
							<Accordion sx={{ marginBottom: "10px" }}>
								<AccordionSummary>Waffendaten</AccordionSummary>
								<AccordionDetails>
									<TextField
										label="Schaden"
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={getFieldData(localData, "data.weapon.damage") ?? ""}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.damage",
												e.target.value,
												setLocalData,
												true
											);
										}}
									/>
									<TextField
										label="Reichweite"
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={getFieldData(localData, "data.weapon.range") ?? ""}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.range",
												e.target.value,
												setLocalData,
												true
											);
										}}
									/>
									<Select
										label="Schaden"
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={
											getFieldData(localData, "data.weapon.weaponType") ?? ""
										}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.weaponType",
												e.target.value,
												setLocalData,
												true
											);
										}}
									>
										<MenuItem value="Nahkampfwaffe">Nahkampfwaffe</MenuItem>
										<MenuItem value="Fernkampfwaffe">Fernkampfwaffe</MenuItem>
									</Select>
									<Select
										label="Attribut"
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={
											getFieldData(localData, "data.weapon.attribute") ?? ""
										}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.attribute",
												e.target.value,
												setLocalData,
												true
											);
										}}
									>
										{ATTRIBUTES.map((item) => {
											return (
												<MenuItem
													key={"atta_" + item.shortName}
													value={item.name}
												>
													{item.name}
												</MenuItem>
											);
										})}
									</Select>
									<TextField
										label="Beschreibung"
										multiline
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={
											getFieldData(localData, "data.weapon.description") ?? ""
										}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.description",
												e.target.value,
												setLocalData,
												true
											);
										}}
									/>
								</AccordionDetails>
							</Accordion>
						) : (
							<></>
						)}
						<TextField
							label="Anzahl"
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.amount ?? ""}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									amount: e.target.value,
								}));
							}}
						/>
						<Select
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.allwaysFree ?? "none"}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									allwaysFree: e.target.value,
								}));
							}}
						>
							<MenuItem value="none">Immer Verfügbar</MenuItem>
							<MenuItem value="true">Ja</MenuItem>
							<MenuItem value="false">Nein</MenuItem>
						</Select>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave(localData);
							}}
						>
							Speichern
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 6:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Bearbeite Item"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<Autocomplete
							fullWidth
							inputValue={inputValues.items ?? ""}
							onInputChange={(event, newInputValue) => {
								if (!event) {
									return;
								}
								setInputValues((prev) => ({
									...prev,
									items: newInputValue,
								}));
							}}
							sx={{ marginBottom: "10px", marginLeft: "3px" }}
							options={[{ name: "custom", id: "-1" }, ...items]}
							isOptionEqualToValue={(option, value) => {
								return option.id == value;
							}}
							getOptionLabel={(option: any) => {
								if (typeof option == "string") {
									for (let item of items) {
										if (item.id == option) {
											return item.name;
										}
									}
									return "Custom";
								}
								return option.name;
							}}
							onChange={(event, newValue: any) => {
								if (!newValue || !newValue.id || newValue.id == "-1") {
									setLocalData((prev: any) => ({
										...prev,
										parent: "-1",
										type: "item",
									}));
									return;
								}
								setLocalData((prev: any) => ({
									...prev,
									parent: newValue.id,
									name: newValue.name,
									equip: newValue.equip,
									data: newValue.data,
									type: newValue.type,
									description: newValue.description,
									gmInfo: newValue.secret,
								}));
							}}
							size="small"
							value={localData.parent ?? data.parent}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Parent Item"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Select
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.type ?? data.type}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									type: e.target.value,
								}));
							}}
						>
							<MenuItem value="none" disabled>
								Typ
							</MenuItem>
							<MenuItem value="item">Item</MenuItem>
							<MenuItem value="weapon">Waffe</MenuItem>
						</Select>
						<TextField
							label="Name"
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.name ?? data.name}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									name: e.target.value,
								}));
							}}
						/>
						<TextField
							label="Beschreibung"
							multiline
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.description ?? data.description}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									description: e.target.value,
								}));
							}}
						/>
						<TextField
							label="Geheime Infos"
							multiline
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.gmInfo ?? data.gmInfo}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									gmInfo: e.target.value,
								}));
							}}
						/>
						{localData.type == "weapon" ||
						(!localData.type && data.type == "weapon") ? (
							<Accordion sx={{ marginBottom: "10px" }}>
								<AccordionSummary>Waffendaten</AccordionSummary>
								<AccordionDetails>
									<TextField
										label="Schaden"
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={
											getFieldData(localData, "data.weapon.damage") ??
											getFieldData(data, "data.weapon.damage") ??
											""
										}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.damage",
												e.target.value,
												setLocalData,
												true
											);
										}}
									/>
									<TextField
										label="Reichweite"
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={
											getFieldData(localData, "data.weapon.range") ??
											getFieldData(data, "data.weapon.range") ??
											""
										}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.range",
												e.target.value,
												setLocalData,
												true
											);
										}}
									/>
									<Select
										label="Schaden"
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={
											getFieldData(localData, "data.weapon.weaponType") ??
											getFieldData(data, "data.weapon.weaponType") ??
											""
										}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.weaponType",
												e.target.value,
												setLocalData,
												true
											);
										}}
									>
										<MenuItem value="Nahkampfwaffe">Nahkampfwaffe</MenuItem>
										<MenuItem value="Fernkampfwaffe">Fernkampfwaffe</MenuItem>
									</Select>
									<Select
										label="Attribut"
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={
											getFieldData(localData, "data.weapon.attribute") ??
											getFieldData(data, "data.weapon.attribute") ??
											""
										}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.attribute",
												e.target.value,
												setLocalData,
												true
											);
										}}
									>
										{ATTRIBUTES.map((item) => {
											return (
												<MenuItem
													key={"atta_" + item.shortName}
													value={item.name}
												>
													{item.name}
												</MenuItem>
											);
										})}
									</Select>
									<TextField
										label="Beschreibung"
										multiline
										fullWidth
										size="small"
										sx={{ marginBottom: "10px" }}
										value={
											getFieldData(localData, "data.weapon.description") ??
											getFieldData(data, "data.weapon.description") ??
											""
										}
										onChange={(e) => {
											updateFieldFunction(
												localData,
												"data.weapon.description",
												e.target.value,
												setLocalData,
												true
											);
										}}
									/>
								</AccordionDetails>
							</Accordion>
						) : (
							<></>
						)}
						<TextField
							label="Anzahl"
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.amount ?? data.amount}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									amount: e.target.value,
								}));
							}}
						/>
						<Select
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.allwaysFree ?? data.allwaysFree}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									allwaysFree: e.target.value,
								}));
							}}
						>
							<MenuItem value="none" disabled>
								Immer Verfügbar
							</MenuItem>
							<MenuItem value="true">Ja</MenuItem>
							<MenuItem value="false">Nein</MenuItem>
						</Select>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave({
									...data,
									...localData,
									data: {
										...data.data,
										...localData.data,
									},
									id: data.id,
								});
							}}
						>
							Speichern
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 8:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Create Map"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<TextField
							label="Name"
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.name ?? ""}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									name: e.target.value,
								}));
							}}
						/>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave(localData);
							}}
						>
							Speichern
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 9:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Create Map"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<TextField
							label="Titel"
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.title ?? ""}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									title: e.target.value,
								}));
							}}
						/>
						<TextField
							label="Beschreibung"
							multiline
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							value={localData.description ?? ""}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									description: e.target.value,
								}));
							}}
						/>

						<Select
							size="small"
							value={localData.type ?? "note"}
							sx={{ marginBottom: "10px" }}
							onChange={(e) => {
								setLocalData((prev: any) => ({
									...prev,
									type: e.target.value,
								}));
							}}
						>
							<MenuItem value={"note"}>Notiz</MenuItem>
							<MenuItem value={"effect"}>Effekt</MenuItem>
							<MenuItem value={"event"}>Event</MenuItem>
						</Select>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave({
									mapId: data.id,
									note: {
										type: "note",
										title: "",
										description: "",
										...localData,
									},
								});
							}}
						>
							Speichern
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 10:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Move Player/NPC"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<Autocomplete
							fullWidth
							sx={{ marginBottom: "10px", marginLeft: "3px" }}
							options={data.mapData}
							isOptionEqualToValue={(option: any, value) => {
								if (!value.id) {
									return option.id == "-1";
								}
								return option.id == value.id;
							}}
							inputValue={inputValues.maps ?? ""}
							onInputChange={(event, newInputValue) => {
								if (!event) {
									return;
								}
								setInputValues((prev) => ({
									...prev,
									maps: newInputValue,
								}));
							}}
							getOptionLabel={(option: any) => {
								return option.name;
							}}
							onChange={(event, newValue: any) => {
								setLocalData(newValue);
							}}
							size="small"
							value={localData ?? { id: "-1" }}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Map"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave({
									mapId: localData.id,
									ids: data.ids,
								});
							}}
						>
							Speichern
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 11:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Color of Token"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<TextField
							fullWidth
							sx={{ marginBottom: "10px", marginLeft: "3px" }}
							onChange={(event) => {
								setLocalData({ color: event.target.value });
							}}
							size="small"
							value={localData.color ?? ""}
						/>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave({
									mapId: data.map,
									id: data.id,
									color: localData.color,
								});
							}}
						>
							Speichern
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 12:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Kampf starten"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						{data.n.length ? <b>NPCs:</b> : <></>}
						{data.n.map((item) => {
							return (
								<div
									key={item.id + "_Check"}
									style={{
										display: "flex",
										flexDirection: "row",
										marginBottom: "5px",
									}}
								>
									<Checkbox
										size="small"
										checked={
											localData && localData.used
												? localData.used.includes(item.id)
												: false
										}
										onChange={(e, checked) => {
											let u = localData.used;
											let f = localData.fighter;
											if (!u && checked) {
												u = [item.id];
												f = [
													{
														id: item.id,
														name: item.name,
														owner: item.owner,
														init: "wurf:[1W20+" + (item.initiative ?? 0) + "]",
													},
												];
												setLocalData((prev) => ({
													...prev,
													used: u,
													fighter: f,
												}));
												return;
											}
											if (!u && !checked) {
												return;
											}
											if (!Array.isArray(f)) {
												return;
											}
											if (checked) {
												u = [...u, item.id];
												f = [
													...f,
													{
														id: item.id,
														name: item.name,
														owner: item.owner,
														init: "wurf:[1W20+" + (item.initiative ?? 0) + "]",
													},
												];
												setLocalData((prev) => ({
													...prev,
													used: u,
													fighter: f,
												}));
											} else {
												let u1 = [];
												for (let u2 of u) {
													if (u2 != item.id) {
														u1.push(u2);
													}
												}
												let f1 = [];
												for (let f2 of f) {
													if (f2.id != item.id) {
														f1.push(f2);
													}
												}
												setLocalData((prev) => ({
													...prev,
													used: u1,
													fighter: f1,
												}));
											}
										}}
									></Checkbox>
									<Typography sx={{ width: "60%" }}>{item.name}</Typography>
									<TextField
										size="small"
										sx={{ width: "20%" }}
										disabled={!getFighterFromId(localData.fighter, item.id)}
										value={
											getFighterFromId(localData.fighter, item.id) &&
											!getFighterFromId(
												localData.fighter,
												item.id
											).init.startsWith("wurf")
												? getFighterFromId(localData.fighter, item.id).init
												: ""
										}
										onChange={(e) => {
											let f = localData.fighter;
											console.log(localData);
											let f1 = [];
											for (let f2 of f) {
												if (f2.id == item.id) {
													f1.push({ ...f2, init: e.target.value });
													continue;
												}
												f1.push(f2);
											}
											setLocalData((prev) => ({
												...prev,
												fighter: f1,
											}));
										}}
									></TextField>
									<Checkbox
										size="small"
										sx={{ width: "20%" }}
										disabled={!getFighterFromId(localData.fighter, item.id)}
										icon={<Casino></Casino>}
										value={
											getFighterFromId(localData.fighter, item.id) &&
											getFighterFromId(
												localData.fighter,
												item.id
											).init.startsWith("wurf")
										}
										checked={
											getFighterFromId(localData.fighter, item.id) &&
											getFighterFromId(
												localData.fighter,
												item.id
											).init.startsWith("wurf")
										}
										onChange={(e, checked) => {
											if (checked) {
												let f = localData.fighter;
												let f1 = [];
												for (let f2 of f) {
													if (f2.id == item.id) {
														f2 = {
															...f2,
															init:
																"wurf:[1W20+" + (item.initiative ?? 0) + "]",
														};
													}
													f1.push(f2);
												}
												setLocalData((prev) => ({
													...prev,
													fighter: f1,
												}));
											} else {
												let f = localData.fighter;

												let f1 = [];
												for (let f2 of f) {
													if (f2.id == item.id) {
														f2 = { ...f2, init: "" };
													}
													f1.push(f2);
												}
												setLocalData((prev) => ({
													...prev,
													fighter: f1,
												}));
											}
										}}
									></Checkbox>
								</div>
							);
						})}

						{data.p.length ? <b>Players:</b> : <></>}
						{data.p.map((item) => {
							return (
								<div
									key={item.id + "_Check"}
									style={{
										display: "flex",
										flexDirection: "row",
										marginBottom: "5px",
									}}
								>
									<Checkbox
										size="small"
										checked={
											localData && localData.used
												? localData.used.includes(item.id)
												: false
										}
										onChange={(e, checked) => {
											let u = localData.used;
											let f = localData.fighter;
											if (!u && checked) {
												u = [item.id];
												f = [
													{
														id: item.id,
														name: item.name,
														owner: item.owner,
														init: "wurf:[1W20+" + (item.initiative ?? 0) + "]",
													},
												];
												setLocalData((prev) => ({
													...prev,
													used: u,
													fighter: f,
												}));
												return;
											}
											if (!u && !checked) {
												return;
											}
											if (!Array.isArray(f)) {
												return;
											}
											if (checked) {
												u = [...u, item.id];
												f = [
													...f,
													{
														id: item.id,
														name: item.name,
														owner: item.owner,
														init: "wurf:[1W20+" + (item.initiative ?? 0) + "]",
													},
												];
												setLocalData((prev) => ({
													...prev,
													used: u,
													fighter: f,
												}));
											} else {
												let u1 = [];
												for (let u2 of u) {
													if (u2 != item.id) {
														u1.push(u2);
													}
												}
												let f1 = [];
												for (let f2 of f) {
													if (f2.id != item.id) {
														f1.push(f2);
													}
												}
												setLocalData((prev) => ({
													...prev,
													used: u1,
													fighter: f1,
												}));
											}
										}}
									></Checkbox>
									<Typography sx={{ width: "60%" }}>{item.name}</Typography>
									<TextField
										size="small"
										sx={{ width: "20%" }}
										disabled={!getFighterFromId(localData.fighter, item.id)}
										value={
											getFighterFromId(localData.fighter, item.id) &&
											!getFighterFromId(
												localData.fighter,
												item.id
											).init.startsWith("wurf")
												? getFighterFromId(localData.fighter, item.id).init
												: ""
										}
										onChange={(e) => {
											let f = localData.fighter;
											console.log(localData);
											let f1 = [];
											for (let f2 of f) {
												if (f2.id == item.id) {
													f1.push({ ...f2, init: e.target.value });
													continue;
												}
												f1.push(f2);
											}
											setLocalData((prev) => ({
												...prev,
												fighter: f1,
											}));
										}}
									></TextField>
									<Checkbox
										size="small"
										sx={{ width: "20%" }}
										disabled={!getFighterFromId(localData.fighter, item.id)}
										icon={<Casino></Casino>}
										value={
											getFighterFromId(localData.fighter, item.id) &&
											getFighterFromId(
												localData.fighter,
												item.id
											).init.startsWith("wurf")
										}
										checked={
											getFighterFromId(localData.fighter, item.id) &&
											getFighterFromId(
												localData.fighter,
												item.id
											).init.startsWith("wurf")
										}
										onChange={(e, checked) => {
											if (checked) {
												let f = localData.fighter;
												let f1 = [];
												for (let f2 of f) {
													if (f2.id == item.id) {
														f2 = {
															...f2,
															init:
																"wurf:[1W20+" + (item.initiative ?? 0) + "]",
														};
													}
													f1.push(f2);
												}
												setLocalData((prev) => ({
													...prev,
													fighter: f1,
												}));
											} else {
												let f = localData.fighter;

												let f1 = [];
												for (let f2 of f) {
													if (f2.id == item.id) {
														f2 = { ...f2, init: "" };
													}
													f1.push(f2);
												}
												setLocalData((prev) => ({
													...prev,
													fighter: f1,
												}));
											}
										}}
									></Checkbox>
								</div>
							);
						})}
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								console.log(localData);
								await onSave({
									mapId: data.mapId,
									fighter: localData.fighter,
								});
							}}
						>
							Speichern
						</Button>
					</div>
				</DnDPopUpMenu>
			);

		case 13:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Übertrage NPC/Spieler"
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "90%",
							marginLeft: "5%",
							marginRight: "5%",
						}}
					>
						<Autocomplete
							fullWidth
							sx={{ marginBottom: "10px", marginLeft: "3px" }}
							options={data.users}
							onChange={(event, newValue: any) => {
								setLocalData(newValue);
							}}
							inputValue={inputValues.user ?? ""}
							onInputChange={(event, newInputValue) => {
								if (!event) {
									return;
								}
								setInputValues((prev) => ({
									...prev,
									user: newInputValue,
								}));
							}}
							size="small"
							value={typeof localData == "object" ? "Niemand" : localData}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Benutzer"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Button
							fullWidth
							size="small"
							sx={{ marginBottom: "10px" }}
							variant="contained"
							onClick={async () => {
								await onSave({
									user: typeof localData == "object" ? "Niemand" : localData,
									onSave: data.onSave,
								});
							}}
						>
							Speichern
						</Button>
					</div>
				</DnDPopUpMenu>
			);
		case 14:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Trefferpunkte ändern"
				>
					<TextField
						size="small"
						value={localData.change ?? ""}
						onChange={(e) => {
							setLocalData((prev) => ({ ...prev, change: e.target.value }));
						}}
					></TextField>
					<Button
						fullWidth
						size="small"
						sx={{ marginBottom: "10px" }}
						variant="contained"
						onClick={async () => {
							await onSave({
								change: localData.change,
								onSave: data.onSave,
							});
						}}
					>
						Speichern
					</Button>
				</DnDPopUpMenu>
			);
		case 15:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Event hinzufügen"
				>
					<TextField
						size="small"
						value={localData.name ?? ""}
						onChange={(e) => {
							setLocalData((prev) => ({ ...prev, name: e.target.value }));
						}}
						label={"Name"}
					></TextField>
					<Button
						fullWidth
						size="small"
						sx={{ marginBottom: "10px" }}
						variant="contained"
						onClick={async () => {
							await onSave({
								name: localData.name,
								time: data.time,
								onSave: data.onSave,
							});
						}}
					>
						Speichern
					</Button>
				</DnDPopUpMenu>
			);
		case 16:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Zeit ändern"
				>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<TextField
							size="small"
							value={localData.hours ?? data.hours + ""}
							onChange={(e) => {
								setLocalData((prev) => ({ ...prev, hours: e.target.value }));
							}}
							label={"Stunden"}
						></TextField>
						:{" "}
						<TextField
							size="small"
							value={localData.minutes ?? data.minutes + ""}
							onChange={(e) => {
								setLocalData((prev) => ({ ...prev, minutes: e.target.value }));
							}}
							label={"Minuten"}
						></TextField>
					</div>

					<Button
						fullWidth
						size="small"
						sx={{ marginBottom: "10px" }}
						variant="contained"
						onClick={async () => {
							await onSave({
								hours: localData.hours ?? data.hours,
								minutes: localData.minutes ?? data.minutes,
								onSave: data.onSave,
							});
						}}
					>
						Speichern
					</Button>
				</DnDPopUpMenu>
			);
		case 17:
			return (
				<DnDPopUpMenu
					onClose={() => {
						onClose();
					}}
					title="Ort ändern"
				>
					<TextField
						size="small"
						value={localData.name ?? data.name}
						onChange={(e) => {
							setLocalData((prev) => ({ ...prev, name: e.target.value }));
						}}
						label={"Ortsname"}
					></TextField>
					<Button
						fullWidth
						size="small"
						sx={{ marginBottom: "10px" }}
						variant="contained"
						onClick={async () => {
							await onSave({
								name: localData.name ?? data.name,
							});
						}}
					>
						Speichern
					</Button>
				</DnDPopUpMenu>
			);
		default:
			return <></>;
	}
}
