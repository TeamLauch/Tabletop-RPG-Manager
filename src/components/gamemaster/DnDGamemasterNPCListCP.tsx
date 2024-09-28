import {
	IconButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Tooltip,
} from "@mui/material";
import {
	Add,
	Delete,
	LocationOn,
	RotateLeft,
	SwapHoriz,
	Transform,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import DnDGamemasterDefaulListCP from "./DnDGamemasterDefaultListCP";
import DnDGamemasterPlayerItemCP from "./DnDGamemasterPlayerItemCP";
import { useMemo, useState } from "react";
import DnDContextMenu from "../basic/DnDContextMenu";
import { deleteNPC, saveGame, saveNPC, savePlayer } from "@/utils/game";
import { useUsernames } from "@/utils/customHooks";
import DnDGamemasterNPCItemCP from "./DnDGamemasterNPCItemCP";
/**
 * A List of all Players in the Game
 *
 * @param npcs List of all NPCs
 * @param updateTick Updates all Data from Database
 * @param game Game Data
 * @param setPopupData Updates Data for Popup
 * @param setPopupId Chooses Current Popup to Show
 * @param setCurrentPlayerId Opens Character Viewer for given Player ID
 */
export default function DnDGamemasterPlayerListCP({
	npcs,
	updateTick,
	game,
	setPopupData,
	setPopupId,
	setCurrentPlayerId,
	customContext,
	setCustomContext,
}: {
	updateTick: any;
	setCurrentPlayerId: any;
	npcs: any;
	game: any;
	setCustomContext: any;
	customContext: any;
	setPopupData: any;
	setPopupId: any;
}) {
	const [selectedPlayer, setSelectedPlayer] = useState<string[]>([]);

	const users = useUsernames();
	const usernames = useMemo(() => {
		let ret = ["Niemand"];
		for (let u of users) {
			ret.push(u.username);
		}
		return ret;
	}, [users]);

	const getPlayersById = (ids: any[]) => {
		let p = [];
		for (let p1 of game.npcData) {
			if (!p1) {
				continue;
			}
			if (ids.includes(p1.id)) {
				p.push(p1);
			}
		}
		return p;
	};

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				gap: "10px",
				gridRow: "auto",
			}}
			onClick={(e) => {
				if (!e.ctrlKey) {
					setSelectedPlayer([]);
				}
			}}
		>
			{customContext ? (
				<DnDContextMenu posX={customContext.posX} posY={customContext.posY}>
					<MenuItem
						disabled={selectedPlayer.length == 0 && !customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							if (selectedPlayer && selectedPlayer.length > 0) {
								for (let p of getPlayersById(selectedPlayer)) {
									await saveNPC(game.id, {
										...p,
										hidden: true,
									});
								}
								updateTick();
								setSelectedPlayer([]);
								setCustomContext(undefined);
								return;
							}
							if (customContext.target) {
								await saveNPC(game.id, {
									...getPlayersById([customContext.target])[0],
									hidden: true,
								});
								updateTick();
							}
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<VisibilityOff></VisibilityOff>
						</ListItemIcon>
						<ListItemText>NPC ausblenden</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={selectedPlayer.length == 0 && !customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							setPopupData({
								mapData: game.mapData,
								ids:
									selectedPlayer.length != 0
										? selectedPlayer.map((item) => ({
												id: item,
												npc: true,
											}))
										: [{ id: customContext.target, npc: true }],
							});
							setPopupId(10);
						}}
					>
						<ListItemIcon>
							<LocationOn></LocationOn>
						</ListItemIcon>
						<ListItemText>Auf Karte setzen</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={selectedPlayer.length == 0 && !customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							if (selectedPlayer && selectedPlayer.length > 0) {
								for (let n of selectedPlayer) {
									await deleteNPC(game.id, n);
								}
								updateTick();
								setSelectedPlayer([]);
								setCustomContext(undefined);
								return;
							}
							if (customContext.target) {
								await deleteNPC(game.id, customContext.target);
								updateTick();
							}
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Delete></Delete>
						</ListItemIcon>
						<ListItemText>NPC löschen</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={selectedPlayer.length == 0 && !customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							if (selectedPlayer && selectedPlayer.length > 0) {
								setPopupData({
									users: usernames,
									onSave: async (user) => {
										for (let npc of getPlayersById(selectedPlayer)) {
											await saveNPC(game.id, {
												...npc,
												owner: user == "Niemand" ? undefined : user,
											});
										}
										updateTick();
									},
								});
								setPopupId(13);
								setCustomContext(undefined);
								return;
							}
							if (customContext.target) {
								setPopupData({
									users: usernames,
									onSave: async (user) => {
										await saveNPC(game.id, {
											...getPlayersById([customContext.target])[0],
											owner: user == "Niemand" ? undefined : user,
										});
										updateTick();
									},
								});
								setPopupId(13);
							}
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<SwapHoriz></SwapHoriz>
						</ListItemIcon>
						<ListItemText>NPC zuteilen</ListItemText>
					</MenuItem>
					<MenuItem
						onClick={async (e) => {
							e.stopPropagation();
							setPopupData({
								npcs: game.npcData.filter((item: any) => {
									return item && item.hidden;
								}),
							});
							setPopupId(1);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Visibility></Visibility>
						</ListItemIcon>
						<ListItemText>NPC anzeigen</ListItemText>
					</MenuItem>
					<MenuItem
						onClick={async (e) => {
							e.stopPropagation();
							setPopupData({
								npcs: npcs.sort((a, b) => {
									if (a.name < b.name) {
										return -1;
									}
									if (a.name > b.name) {
										return 1;
									}
									return 0;
								}),
							});
							setPopupId(0);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Add></Add>
						</ListItemIcon>
						<ListItemText>NPC hinzufügen</ListItemText>
					</MenuItem>
					<MenuItem
						onClick={async (e) => {
							e.stopPropagation();
							setPopupData({
								npcs: npcs.sort((a, b) => {
									if (a.name < b.name) {
										return -1;
									}
									if (a.name > b.name) {
										return 1;
									}
									return 0;
								}),
							});
							setPopupId(2);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Add></Add>
						</ListItemIcon>
						<ListItemText>NPC Gruppe hinzufügen</ListItemText>
					</MenuItem>
				</DnDContextMenu>
			) : (
				<></>
			)}
			{game.npcData ? (
				game.npcData.map((item: any, index: number) => {
					if (!item || item.hidden) {
						return <></>;
					}
					return (
						<DnDGamemasterNPCItemCP
							setCustomContext={setCustomContext}
							onClick={(e) => {
								setCustomContext(undefined);
								if (e.ctrlKey) {
									if (selectedPlayer.includes(item.id)) {
										setSelectedPlayer(
											selectedPlayer.filter((value) => value != item.id)
										);
									} else {
										setSelectedPlayer((prev) => [...prev, item.id]);
									}
									return;
								}
								setCurrentPlayerId(item.id);
								e.stopPropagation();
							}}
							style={{
								backgroundColor: selectedPlayer.includes(item.id)
									? "#DADAFA"
									: undefined,
							}}
							item={item}
							key={item.id + "view"}
						/>
					);
				})
			) : (
				<></>
			)}
		</div>
	);
}
