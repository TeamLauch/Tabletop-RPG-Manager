import {
	useClasses,
	useGameItems,
	useGameWorld,
	useOpenConstants,
	useVolk,
} from "@/utils/customHooks";
import { useMemo, useState } from "react";
import DnDCharacterSheetPopup from "./DnDCharacterSheetPopup";
import { DEFAULT_POPUPS, DEFAULT_WIDGET } from "@/utils/characterSheet";
import { Button, Fab, IconButton, Tooltip, Typography } from "@mui/material";
import {
	getFieldData,
	performItemCommands,
	updateField,
	updateFieldArray,
} from "@/utils/dataHelper";
import {
	LocalFireDepartment,
	LocalLibrary,
	Note,
	Notes,
	Person,
	Settings,
} from "@mui/icons-material";
import DnDPopUpMenu from "../basic/DnDPopupMenu";
import DnDPlayerOverrideMenu from "./DnDPlayerOverrideMenu";
import { Popup, Widget } from "@/utils/types";
import DnDCharacterFightView from "./fight/DnDCharacterFightView";
import DnDCharacterSheetBasic from "./basic/DnDCharacterSheetBasic";
import { savePlayer } from "@/utils/game";
import styled from "@emotion/styled";
import DnDCharacterRoleplaySheetCP from "./roleplay/DnDCharacterRoleplaySheetCP";

export const DnDBasicSheetWidgetContainer = styled("div")({
	textAlign: "center",
	fontSize: "25pt",
	borderRadius: "5px",
	backgroundColor: "#F5F5F5A6",
	backdropFilter: "blur(8px)",
	boxShadow: "3px 2px 1px 1px #F5F5F586",
	transition: "height 0.5s ease-out",
	margin: "5px",
	padding: "5px",
});

export const DnDCharacterSheetDescriptionText = styled("div")({
	fontSize: "14pt",
	textAlign: "left",
	color: "#878787",
});

export const DnDCharacterSheetBodyText = styled("div")({
	backgroundColor: "#F5F5F5A6",
	textAlign: "center",
	fontSize: "20pt",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	minHeight: "40pt",
});

export const DnDCharacterSheetTextBox = styled("div")({
	marginBottom: "5px",
	border: "1px solid black",
	fontSize: "16pt",
	borderRadius: "4px",
	minHeight: "25px",
});

export default function DnDCharacterSheetCP({
	tick,
	setUpdateTick,
	player,
	character,
	gameId,
	save,
	title,
}: {
	tick: number;
	save: (gameId: any, data: any) => void;
	gameId: any;
	setUpdateTick: any;
	player: any;
	title?: any;
	character: any;
}) {
	const constData = useOpenConstants();
	const classes = useClasses(character.classes);
	const race = useVolk(character.volk);
	const items = useGameItems(tick, gameId, "free");
	const [openOverride, setOpenOverride] = useState(false);

	const { world, worldData } = useGameWorld(gameId, tick);
	const [currentPopupId, setCurrentPopupId] = useState<string>();
	const [openAttributes, setOpenAttributes] = useState<any>();
	const [tabId, setTabId] = useState("basic");

	const popups = useMemo(() => {
		let p: Popup[] = DEFAULT_POPUPS;
		if (classes) {
			for (let c of classes) {
				if (c.registerPopup) {
					p = c.registerPopup(p) ?? p;
				}
			}
		}
		if (race) {
			for (let c of race) {
				if (c.registerPopup) {
					p = c.registerPopup(p) ?? p;
				}
			}
		}
		return p;
	}, [classes, race]);

	const widgets = useMemo(() => {
		let w: Widget[] = DEFAULT_WIDGET;
		if (classes) {
			for (let c of classes) {
				if (c.registerCharacterWidget) {
					w = c.registerCharacterWidget(w) ?? w;
				}
			}
		}
		if (race) {
			for (let c of race) {
				if (c.registerCharacterWidget) {
					w = c.registerCharacterWidget(w) ?? w;
				}
			}
		}
		if (classes) {
			for (let c of classes) {
				if (c.modifiyCharacterWidget) {
					w = c.modifiyCharacterWidget(w) ?? w;
				}
			}
		}
		if (race) {
			for (let c of race) {
				if (c.modifiyCharacterWidget) {
					w = c.modifiyCharacterWidget(w) ?? w;
				}
			}
		}
		return w;
	}, [classes, race]);

	const currentPopup = useMemo(() => {
		if (!popups) {
			return undefined;
		}
		for (let p of popups) {
			if (p.id == currentPopupId) {
				return p;
			}
		}
		return undefined;
	}, [currentPopupId, popups]);

	const openPopup = (id: string, openAttributes: any) => {
		setCurrentPopupId(id);
		setOpenAttributes(openAttributes);
	};

	return (
		<div
			onKeyDown={(e) => {
				if (e.ctrlKey && e.key == "o") {
					e.stopPropagation();
					e.preventDefault();
					openPopup(undefined, undefined);
					setOpenOverride(true);
				}
			}}
		>
			<DnDBasicSheetWidgetContainer
				style={{
					display: "flex",
					margin: "10px",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Button
					sx={{ marginLeft: "1%" }}
					onClick={async () => {
						let p = player;
						for (let c of classes) {
							if (c.onShortRest) {
								p =
									c.onShortRest(
										p,
										character,
										getFieldData,
										updateFieldArray,
										updateField
									) ?? p;
							}
						}
						for (let c of race) {
							if (c.onShortRest) {
								p =
									c.onShortRest(
										p,
										character,
										getFieldData,
										updateFieldArray,
										updateField
									) ?? p;
							}
						}
						if (
							p.equipment &&
							p.equipment.armor &&
							p.equipment.armor.data.onShortRest
						) {
							p = performItemCommands(
								p,
								character,
								p.equipment.armor.data.onShortRest
							);
						}

						if (
							p.equipment &&
							p.equipment.hand_l &&
							p.equipment.hand_l.data.onShortRest
						) {
							p = performItemCommands(
								p,
								character,
								p.equipment.hand_l.data.onShortRest
							);
						}

						if (
							p.equipment &&
							p.equipment.hand_r &&
							p.equipment.hand_r.data.onShortRest
						) {
							p = performItemCommands(
								p,
								character,
								p.equipment.hand_r.data.onShortRest
							);
						}
						p.name = character.characterName;

						await save(gameId, p);
					}}
				>
					Kurze Rast
				</Button>
				<Typography variant="h4">
					Characterbogen {title ?? player.name}
					<IconButton
						sx={{ margin: "5px" }}
						onClick={() => {
							openPopup("basic_field_command", {});
						}}
					>
						<Settings></Settings>
					</IconButton>
				</Typography>
				<Button
					sx={{ marginRight: "1%" }}
					onClick={async () => {
						let p = player;
						p.hp =
							getFieldData(player, "transformData.hp") ??
							getFieldData(character, "hp");
						if (classes) {
							for (let c of classes) {
								if (c.onLongRest) {
									p =
										c.onLongRest(
											p,
											character,
											getFieldData,
											updateFieldArray,
											updateField
										) ?? p;
								}
							}
						}
						if (race) {
							for (let c of race) {
								if (c.onLongRest) {
									p =
										c.onLongRest(
											p,
											character,
											getFieldData,
											updateFieldArray,
											updateField
										) ?? p;
								}
							}
						}
						if (
							p.equipment &&
							p.equipment.armor &&
							p.equipment.armor.data.onLongRest
						) {
							p = performItemCommands(
								p,
								character,
								p.equipment.armor.data.onLongRest
							);
						}

						if (
							p.equipment &&
							p.equipment.hand_l &&
							p.equipment.hand_l.data.onLongRest
						) {
							p = performItemCommands(
								p,
								character,
								p.equipment.hand_l.data.onLongRest
							);
						}

						if (
							p.equipment &&
							p.equipment.hand_r &&
							p.equipment.hand_r.data.onLongRest
						) {
							p = performItemCommands(
								p,
								character,
								p.equipment.hand_r.data.onLongRest
							);
						}
						p.name = character.characterName ?? p.name;
						await save(gameId, p);
					}}
				>
					Lange Rast
				</Button>
			</DnDBasicSheetWidgetContainer>
			{tabId == "fight" ? (
				<DnDCharacterFightView
					character={character}
					gameId={gameId}
					constData={constData}
					savePlayer={async (playerData: any) => {
						await save(gameId, playerData);
						setUpdateTick();
					}}
					openPopup={openPopup}
					player={player}
					tick={tick}
					widgets={widgets}
					updateTick={setUpdateTick}
				></DnDCharacterFightView>
			) : (
				<></>
			)}
			{tabId == "basic" ? (
				<DnDCharacterSheetBasic
					character={character}
					constData={constData}
					gameId={gameId}
					items={items}
					openPopup={openPopup}
					player={player}
					savePlayer={save}
					setOpenOverride={setOpenOverride}
					setUpdateTick={setUpdateTick}
					widgets={widgets}
				></DnDCharacterSheetBasic>
			) : (
				<></>
			)}
			{tabId == "roleplay" ? (
				<DnDCharacterRoleplaySheetCP
					character={character}
					constData={constData}
					world={world}
					worldData={worldData}
					tick={tick}
					gameId={gameId}
					openPopup={openPopup}
					player={player}
					savePlayer={async (playerData) => {
						await savePlayer(gameId, playerData);
					}}
					updateTick={setUpdateTick}
					widgets={widgets}
				></DnDCharacterRoleplaySheetCP>
			) : (
				<></>
			)}
			{openOverride ? (
				<DnDPopUpMenu
					onClose={() => {
						setOpenOverride(false);
					}}
					title="Override Values"
				>
					<DnDPlayerOverrideMenu
						character={character}
						player={player}
						savePlayer={async (player: any) => {
							await save(gameId, player);
							setUpdateTick();
						}}
					></DnDPlayerOverrideMenu>
				</DnDPopUpMenu>
			) : (
				<></>
			)}
			<div
				style={{
					position: "fixed",
					bottom: "20px",
					right: "20px",
					zIndex: 1,
					display: "flex",
					flexDirection: "row",
					flexWrap: "nowrap",
				}}
			>
				<Tooltip title="Charakterbogen">
					<Fab
						disabled={tabId == "basic"}
						sx={{
							marginLeft: "5px",
							marginRight: "5px",
							transition: "ease-in-out 1s",
						}}
						onClick={() => {
							setTabId("basic");
						}}
					>
						<LocalLibrary></LocalLibrary>
					</Fab>
				</Tooltip>

				<Tooltip title="Roleplay">
					<Fab
						disabled={tabId == "roleplay"}
						sx={{
							marginLeft: "5px",
							marginRight: "5px",
							transition: "ease-in-out 1s",
						}}
						onClick={() => {
							setTabId("roleplay");
						}}
					>
						<Person></Person>
					</Fab>
				</Tooltip>
				<Tooltip title="Kampf">
					<Fab
						disabled={tabId == "fight"}
						sx={{
							marginLeft: "5px",
							marginRight: "5px",
							transition: "ease-in-out 1s",
						}}
						onClick={() => {
							setTabId("fight");
						}}
					>
						<LocalFireDepartment></LocalFireDepartment>
					</Fab>
				</Tooltip>
			</div>

			<DnDCharacterSheetPopup
				characterData={character}
				constData={constData}
				worldData={world}
				saveLabel={currentPopup ? currentPopup.saveLabel : undefined}
				openAttributes={openAttributes}
				id={currentPopup ? currentPopupId : undefined}
				onClose={() => {
					openPopup(undefined, undefined);
				}}
				openPopup={openPopup}
				playerData={player}
				savePlayer={async (playerData: any) => {
					await save(gameId, playerData);
				}}
				defaultData={currentPopup ? currentPopup.defaultData : undefined}
				title={currentPopup ? currentPopup.title : undefined}
				children={currentPopup ? currentPopup.children : undefined}
				onSave={
					currentPopup && currentPopup.onSave ? currentPopup.onSave : undefined
				}
				style={currentPopup ? currentPopup.style : undefined}
			></DnDCharacterSheetPopup>
		</div>
	);
}
