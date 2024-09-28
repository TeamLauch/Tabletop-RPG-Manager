import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import {
	Delete,
	LocationOn,
	RotateLeft,
	SwapHoriz,
	Transform,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import DnDGamemasterPlayerItemCP from "./DnDGamemasterPlayerItemCP";
import { useMemo, useState } from "react";
import DnDContextMenu from "../basic/DnDContextMenu";
import { saveGame, savePlayer } from "@/utils/game";
import { useUsernames } from "@/utils/customHooks";
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
		let ret = [];
		for (let u of users) {
			ret.push(u.username);
		}
		return ret;
	}, [users]);

	const getPlayersById = (ids: any[]) => {
		let p = [];
		for (let p1 of game.playerData) {
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
						onClick={(e) => {
							e.stopPropagation();
							setPopupData({
								players:
									selectedPlayer && selectedPlayer.length > 0
										? getPlayersById(selectedPlayer)
										: getPlayersById([customContext.target]),
								npcs: npcs,
							});
							setCustomContext(undefined);
							setPopupId(3);
						}}
					>
						<ListItemIcon>
							<Transform></Transform>
						</ListItemIcon>
						<ListItemText>Verwandle Spieler</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={
							selectedPlayer.length == 0 &&
							(!customContext.target ||
								!getPlayersById([customContext.target])[0].transformData)
						}
						onClick={async (e) => {
							e.stopPropagation();
							if (selectedPlayer && selectedPlayer.length > 0) {
								for (let p of getPlayersById(selectedPlayer)) {
									await savePlayer(game.id, {
										...p,
										transformData: undefined,
									});
								}
								updateTick();
								setCustomContext(undefined);
								return;
							}
							if (customContext.target) {
								await savePlayer(game.id, {
									...getPlayersById([customContext.target])[0],
									transformData: undefined,
								});
								updateTick();
								setCustomContext(undefined);
							}
						}}
					>
						<ListItemIcon>
							<RotateLeft></RotateLeft>
						</ListItemIcon>
						<ListItemText>Zurückverwandeln</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={selectedPlayer.length == 0 && !customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							if (selectedPlayer && selectedPlayer.length > 0) {
								for (let p of getPlayersById(selectedPlayer)) {
									await savePlayer(game.id, {
										...p,
										disabled: true,
									});
								}
								setSelectedPlayer([]);
								setCustomContext(undefined);
								updateTick();
								return;
							}
							if (customContext.target) {
								await savePlayer(game.id, {
									...getPlayersById([customContext.target])[0],
									disabled: true,
								});
								setCustomContext(undefined);
								updateTick();
							}
						}}
					>
						<ListItemIcon>
							<VisibilityOff></VisibilityOff>
						</ListItemIcon>
						<ListItemText>Spieler ausblenden</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={selectedPlayer.length == 0 && !customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							setPopupData({
								mapData: game.mapData,
								ids: (selectedPlayer.length != 0
									? selectedPlayer
									: [customContext.target]
								).map((item) => ({
									id: item,
									npc: false,
								})),
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
								let playerData = game.playerData.filter(
									(value) => !selectedPlayer.includes(value.id)
								);
								await saveGame({
									...game,
									playerData: playerData,
								});
								updateTick();
								setSelectedPlayer([]);
								setCustomContext(undefined);
								return;
							}
							if (customContext.target) {
								let playerData = game.playerData.filter(
									(value) => value.id != customContext.target
								);
								await saveGame({
									...game,
									playerData: playerData,
								});
								updateTick();
							}
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Delete></Delete>
						</ListItemIcon>
						<ListItemText>Spieler löschen</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							if (customContext.target) {
								setPopupData({
									users: usernames,
									onSave: async (user) => {
										await savePlayer(game.id, {
											...getPlayersById([customContext.target])[0],
											owner: user,
										});
										updateTick();
									},
								});
								setCustomContext(undefined);
								setPopupId(13);
							}
						}}
					>
						<ListItemIcon>
							<SwapHoriz></SwapHoriz>
						</ListItemIcon>
						<ListItemText>Spieler zuteilen</ListItemText>
					</MenuItem>
					<MenuItem
						onClick={async (e) => {
							e.stopPropagation();
							setPopupData({
								players: game.playerData.filter((item: any) => {
									return item && item.disabled;
								}),
							});
							setPopupId(4);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Visibility></Visibility>
						</ListItemIcon>
						<ListItemText>Spieler anzeigen</ListItemText>
					</MenuItem>
				</DnDContextMenu>
			) : (
				<></>
			)}
			{game.playerData ? (
				game.playerData.map((item: any, index: number) => {
					if (!item || item.disabled) {
						return <></>;
					}
					return (
						<DnDGamemasterPlayerItemCP
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
