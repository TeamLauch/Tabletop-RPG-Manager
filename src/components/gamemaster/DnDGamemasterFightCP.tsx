import { useCallback, useMemo, useState } from "react";
import DnDGamemasterDefaulListCP from "./DnDGamemasterDefaultListCP";
import DnDGamemasterNPCItemCP from "./DnDGamemasterNPCItemCP";
import DnDGamemasterPlayerItemCP from "./DnDGamemasterPlayerItemCP";
import MapCP from "../map/MapComponents";
import DnDGameItem from "../game/DnDGameItem";
import DnDGameTextBox from "../characterviewer/DnDGameTextBox";
import {
	IconButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Typography,
} from "@mui/material";
import {
	Add,
	AddModerator,
	ArrowBack,
	Delete,
	HeartBroken,
	PunchClock,
	Start,
	Stop,
	Timer,
} from "@mui/icons-material";
import {
	addEvent,
	addEventToGame,
	saveFight,
	saveNPC,
	savePlayer,
} from "@/utils/game";
import DnDContextMenu from "../basic/DnDContextMenu";

export default function DnDGamemasterFightCP({
	npcs,
	setCurrentPlayerId,
	setCurrentNPCId,
	setCustomContext,
	game,
	setPopupData,
	customContext,
	setPopupId,
	updateTick,
	tick,
}: {
	setCurrentNPCId: any;
	npcs: any;
	setCurrentPlayerId: any;
	setCustomContext: any;
	customContext: any;
	game: any;
	setPopupData: any;
	setPopupId: any;
	updateTick: any;
	tick: any;
}) {
	const currentMap = useMemo(() => {
		if (!game.mapData) {
			return undefined;
		}
		for (let map of game.mapData) {
			if (map.active) {
				return map;
			}
		}

		return undefined;
	}, [game]);

	const [selectedPlayer, setSelectedPlayer] = useState<string[]>([]);

	const players = useMemo(() => {
		if (!currentMap || !currentMap.players) {
			return [];
		}
		let ret = [];
		for (let p of game.playerData) {
			if (!p) {
				continue;
			}
			if (currentMap.players.includes(p.id)) {
				ret.push(p);
			}
		}
		return ret;
	}, [currentMap, game]);

	const npcsOnMap = useMemo(() => {
		if (!currentMap || !currentMap.npcs) {
			return [];
		}
		let ret = [];
		for (let p of game.npcData) {
			if (!p) {
				continue;
			}
			if (currentMap.npcs.includes(p.id)) {
				ret.push(p);
			}
		}
		return ret;
	}, [currentMap, game]);

	const currentFight = useMemo(() => {
		if (!currentMap) {
			return {};
		}
		return currentMap.fight;
	}, [currentMap]);

	const getNPCorPlayerById = (id: string) => {
		if (!game) {
			return undefined;
		}
		for (let p of game.playerData) {
			if (p.id == id) {
				return p;
			}
		}
		for (let p of game.npcData) {
			if (p.id == id) {
				return p;
			}
		}
		return undefined;
	};

	const sortedFighters = useMemo(() => {
		if (!currentFight) {
			return [];
		}

		let s = currentFight.fighter.sort((a, b) => {
			if (a.init > b.init) {
				return -1;
			}
			if (a.init < b.init) {
				return 1;
			}
			if (a.name > b.name) {
				return -1;
			}
			if (a.name < b.name) {
				return 1;
			}
			return 0;
		});
		return s;
	}, [currentFight]);

	const toTimeCode = (time: number) => {
		let min = Math.floor(time / 60);
		let sec = time % 60;

		return min + " min " + sec + " sec";
	};

	const fightTime = useMemo(() => {
		if (!currentFight) {
			return "0 min 0 sec";
		}
		let time = currentFight.time;
		return toTimeCode(time);
	}, [currentFight, sortedFighters.length]);

	if (!currentMap) {
		return <div></div>;
	}

	return (
		<div
			style={{
				width: "98%",
				marginLeft: "0.5%",
				marginTop: "1%",
				flexDirection: "column",
				display: "flex",
				flexWrap: "nowrap",
			}}
			onClick={(e) => {
				setSelectedPlayer([]);
			}}
		>
			{customContext ? (
				<DnDContextMenu posX={customContext.posX} posY={customContext.posY}>
					<MenuItem
						disabled={currentFight}
						onClick={(e) => {
							e.stopPropagation();
							setPopupData({ p: players, n: npcsOnMap, mapId: currentMap.id });
							setPopupId(12);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<AddModerator></AddModerator>
						</ListItemIcon>
						<ListItemText>Kampf starten</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!currentFight}
						onClick={(e) => {
							e.stopPropagation();
							let fighterIDs = [];
							for (let f of sortedFighters) {
								fighterIDs.push(f.id);
							}
							setPopupData({
								p: players.filter((value) => !fighterIDs.includes(value.id)),
								n: npcsOnMap.filter((value) => !fighterIDs.includes(value.id)),
								mapId: currentMap.id,
							});
							setPopupId(12);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Add></Add>
						</ListItemIcon>
						<ListItemText>NPC/Player hinzufügen</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={selectedPlayer.length == 0 && !customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							if (selectedPlayer && selectedPlayer.length > 0) {
								let f = sortedFighters.filter(
									(value) => !selectedPlayer.includes(value.id)
								);
								if (f.length == 0) {
									await saveFight(game, currentMap.id, undefined);
									updateTick();
									setCustomContext(undefined);
									return;
								}
								await saveFight(game, currentMap.id, {
									...currentFight,
									fighter: f,
								});
								updateTick();
								setCustomContext(undefined);
								setSelectedPlayer([]);
								return;
							}
							if (customContext.target) {
								let f = sortedFighters.filter(
									(value) => value.id != customContext.target
								);
								if (f.length == 0) {
									await saveFight(game, currentMap.id, undefined);
									updateTick();
									setCustomContext(undefined);
									return;
								}
								await saveFight(game, currentMap.id, {
									...currentFight,
									fighter: f,
								});
								updateTick();
								setCustomContext(undefined);
							}
						}}
					>
						<ListItemIcon>
							<Delete></Delete>
						</ListItemIcon>
						<ListItemText>NPC/Player löschen</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={selectedPlayer.length == 0 && !customContext.target}
						onClick={(e) => {
							e.stopPropagation();
							let fighterIDs = [];
							for (let f of sortedFighters) {
								fighterIDs.push(f.id);
							}
							setPopupData({
								p: players
									.filter((value) => fighterIDs.includes(value.id))
									.filter((val) =>
										selectedPlayer.length != 0
											? selectedPlayer.includes(val.id)
											: val.id == customContext.target
									),
								n: npcsOnMap
									.filter((value) => fighterIDs.includes(value.id))
									.filter((val) =>
										selectedPlayer.length != 0
											? selectedPlayer.includes(val.id)
											: val.id == customContext.target
									),
								mapId: currentMap.id,
							});
							setPopupId(12);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<PunchClock></PunchClock>
						</ListItemIcon>
						<ListItemText>Initiative ändern</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={selectedPlayer.length == 0 && !customContext.target}
						onClick={(e) => {
							e.stopPropagation();
							setPopupData({
								onSave: async (change) => {
									if (selectedPlayer.length > 0) {
										for (let p of selectedPlayer) {
											let data = getNPCorPlayerById(p);
											data.hp = parseInt(data.hp) + parseInt(change) + "";
											if (parseInt(data.hp) < 0) {
												data.hp = "0";
											}
											if (data.parent) {
												await savePlayer(game.id, data);
											} else {
												await saveNPC(game.id, data);
											}
										}
										updateTick();
										return;
									}
									if (customContext.target) {
										let data = getNPCorPlayerById(customContext.target);
										data.hp = parseInt(data.hp) + parseInt(change) + "";
										if (parseInt(data.hp) < 0) {
											data.hp = "0";
										}
										if (!data.parent) {
											await savePlayer(game.id, data);
										} else {
											await saveNPC(game.id, data);
										}
										updateTick();
										return;
									}
								},
							});
							setPopupId(14);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<HeartBroken></HeartBroken>
						</ListItemIcon>
						<ListItemText>Trefferpunkte ändern</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							let data = getNPCorPlayerById(customContext.target);
							if (!data) {
								return;
							}
							await saveFight(game, currentMap.id, {
								...currentFight,
								events: [
									...currentFight.events,
									{
										name: "Konzentration von " + data.name,
										startTime: currentFight.time,
									},
								],
							});
							updateTick();
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Timer></Timer>
						</ListItemIcon>
						<ListItemText>Starte Konzentration</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!currentFight}
						onClick={async (e) => {
							e.stopPropagation();
							await saveFight(
								addEventToGame(game, {
									name: "Kampf wurde beendet",
									etype: "fight",
								}),
								currentMap.id,
								undefined
							);
							updateTick();
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Stop></Stop>
						</ListItemIcon>
						<ListItemText>Beende Kampf</ListItemText>
					</MenuItem>
				</DnDContextMenu>
			) : (
				<></>
			)}
			<div
				style={{
					border: "1px solid rgba(0, 0, 0, 0.3)",
					boxShadow: "3px 3px rgba(0,0,0,0.25)",
					borderRadius: "10px",
					backgroundColor: "#F5F5F5",
					display: "flex",
					flexDirection: "column",
					flexWrap: "wrap",
					padding: "5px",
				}}
			>
				<div
					style={{
						width: "100%",
						display: "flex",
						height: "40px",
						flexDirection: "row",
						justifyContent: "center",
						justifyItems: "center",
					}}
				>
					<IconButton
						onClick={async (e) => {
							e.stopPropagation();
							let f = { ...currentFight };
							if (!f) {
								return;
							}
							f["turn"] = f["turn"] - 1;
							f["time"] -= 6;
							if (f["turn"] < 0) {
								f["turn"] = f["fighter"].length - 1;
								f["round"] = f["round"] - 1;
							}
							await saveFight(game, currentMap.id, f);
							updateTick();
						}}
					>
						<ArrowBack></ArrowBack>
					</IconButton>
					<IconButton
						onClick={async (e) => {
							e.stopPropagation();
							let f = { ...currentFight };
							if (!f) {
								return;
							}
							f["turn"] = f["turn"] + 1;
							f["time"] += 6;
							if (f["turn"] >= f["fighter"].length) {
								f["turn"] = 0;
								f["round"] = f["round"] + 1;
							}
							await saveFight(game, currentMap.id, f);
							updateTick();
						}}
					>
						<Start></Start>
					</IconButton>
					<Typography
						sx={{ marginTop: "5px", marginLeft: "40px", fontSize: "20px" }}
					>
						Runde {currentFight ? currentFight["round"] ?? "0" : "0"} | Zeit{" "}
						{fightTime}
					</Typography>
				</div>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr 1fr",
						gap: "10px",
						gridAutoRows: "min-content",
					}}
				>
					{sortedFighters.map((item, index) => {
						let data = getNPCorPlayerById(item.id);
						return (
							<div
								key={item.id + "_fight_item"}
								onContextMenu={
									setCustomContext
										? (e) => {
												e.preventDefault();
												setCustomContext({
													posX: e.pageX,
													posY: e.pageY,
													target: data.id,
												});
												e.stopPropagation();
											}
										: undefined
								}
								onClick={(e) => {
									e.stopPropagation();
									if (e.ctrlKey) {
										setCustomContext(undefined);
										if (selectedPlayer.includes(item.id)) {
											setSelectedPlayer(
												selectedPlayer.filter((value) => value != item.id)
											);
										} else {
											setSelectedPlayer((prev) => [...prev, item.id]);
										}
										return;
									}
									if (data.parent) {
										setCurrentNPCId(data.id);
										return;
									}
									setCurrentPlayerId(data.id);
								}}
								style={{
									cursor: "pointer",
									border: "1px solid black",
									boxShadow: "2px 2px rgba(0,0,0,0.25)",
									borderRadius: "10px",
									display: "flex",
									flexDirection: "column",
									textAlign: "left",
									backgroundColor: selectedPlayer.includes(item.id)
										? currentFight.turn == index
											? "#FADAFA"
											: "#DADAFA"
										: currentFight.turn == index
											? "#FADADA"
											: undefined,
								}}
							>
								<div
									style={{
										textAlign: "center",
										fontSize: "20pt",
										marginBottom: "10px",
									}}
								>
									<div>
										<b>{data.name + " (" + item.init + ")"}</b>
										<br />
										<div style={{ fontSize: "15pt" }}>
											{data.owner}{" "}
											{data.transformData && data.transformData.name ? (
												<>
													<br />
													<div style={{ fontSize: "10pt" }}>
														Gestalt: {data.transformData.name}
													</div>
												</>
											) : (
												<></>
											)}
										</div>
									</div>
								</div>
								<div>HP: {data.hp}</div>
								<div>RK: {data.rk}</div>
								{data.hg ? <div>HG: {data.hg}</div> : <></>}
							</div>
						);
					})}
				</div>
			</div>
			{currentFight ? (
				<div
					style={{
						marginTop: "10px",
						border: "1px solid rgba(0, 0, 0, 0.3)",
						boxShadow: "3px 3px rgba(0,0,0,0.25)",
						borderRadius: "10px",
						backgroundColor: "#F5F5F5",
						display: "flex",
						flexDirection: "column",
						flexWrap: "wrap",
						padding: "5px",
					}}
				>
					<div
						style={{
							fontSize: "18pt",
							textAlign: "center",
						}}
					>
						<b>Events</b>
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								setPopupData({
									onSave: async (event) => {
										await saveFight(game, currentMap.id, {
											...currentFight,
											events: currentFight.events
												? [...currentFight.events, event]
												: [event],
										});
										updateTick();
									},
									time: currentFight.time,
								});
								setPopupId(15);
								setCustomContext(undefined);
							}}
						>
							<Add></Add>
						</IconButton>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: "10px",
							gridAutoRows: "min-content",
						}}
					>
						{currentFight.events ? (
							currentFight.events.map((item, index) => {
								return (
									<div
										key={"event_" + index}
										style={{
											cursor: "pointer",
											border: "1px solid black",
											boxShadow: "2px 2px rgba(0,0,0,0.25)",
											borderRadius: "10px",
											display: "flex",
											flexDirection: "column",
											textAlign: "left",
										}}
									>
										<div
											style={{
												textAlign: "center",
												fontSize: "20pt",
												marginBottom: "10px",
											}}
										>
											<div>
												<b>{item.name}</b>
												<IconButton
													onClick={async (e) => {
														e.stopPropagation();
														await saveFight(game, currentMap.id, {
															...currentFight,
															events: currentFight.events.filter(
																(item, i) => i != index
															),
														});
														updateTick();
														setCustomContext(undefined);
													}}
												>
													<Delete></Delete>
												</IconButton>
											</div>
										</div>
										<div>
											Zeit: {toTimeCode(currentFight.time - item.startTime)}
										</div>
									</div>
								);
							})
						) : (
							<></>
						)}
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
