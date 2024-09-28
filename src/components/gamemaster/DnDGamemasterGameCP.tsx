import {
	Button,
	FormControl,
	Icon,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { useState } from "react";
import {
	addEvent,
	addEventToGame,
	addNoteToMap,
	createMap,
	deleteGame,
	moveNPCToMap,
	movePlayerToMap,
	saveFight,
	saveGame,
	saveItem,
	saveNPC,
	savePlayer,
	setColorOfToken,
} from "@/utils/game";
import {
	Delete,
	Edit,
	LocalFireDepartment,
	Map,
	Note,
	Person4,
	RotateLeft,
} from "@mui/icons-material";
import { generateUUID } from "three/src/math/MathUtils";
import {
	useCharacter,
	useNPC,
	useNPCPlayer,
	useNPCs,
	usePlayer,
	useUsernames,
} from "@/utils/customHooks";
import DnDGameMasterPopup from "./DnDGameMasterPopup";
import DnDGamemasterMapsCP from "./DnDGamemasterMapsCP";
import DnDGamemasterNPCListCP from "./DnDGamemasterNPCListCP";
import DnDGamemasterItemsListCP from "./DnDGamemasterItemsListCP";
import DnDGamemasterPlayerListCP from "./DnDGamemasterPlayerListCP";
import DnDModal from "../basic/DnDModal";
import axios from "axios";
import { User } from "@prisma/client";
import DnDCharacterSheetCP from "../characterviewer/DnDCharacterSheetCP";
import DnDGamemasterFightCP from "./DnDGamemasterFightCP";
import { resolveToValue } from "@/utils/dataHelper";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DnDGamemasterCharacterCP from "./DnDGamemasterCharacterCP";
import DnDGamemasterCalenderCP from "./DnDGamemasterCalenderCP";
import DnDGamemasterQuestEditor from "./DnDGamemasterQuestEditor";
import DnDGamemasterQuestCP from "./DnDGamemasterQuestCP";
import DnDGamemasterEventCP from "./DnDGamemasterEventCP";
import { randomUUID } from "crypto";

/**
 *
 * @param game GameData
 * @param w Margin Left
 * @returns A Panel for Managing a Game as a GameMaster
 */
export default function DnDGamemasterGameCP({
	game,
	updateTick,
	tick,
	id,
	open,
	setOpen,
	user,
}: {
	game: any;
	updateTick: () => void;
	tick: number;
	id: any;
	open: any;
	setOpen: any;
	user: any;
}) {
	const [currentPlayerId, setCurrentPlayerId] = useState("-1");
	const [currentNPCId, setCurrentNPCId] = useState("-1");
	const [customContext, setCustomContext] = useState<any>();

	const staticGame = game;
	const player = usePlayer(game.id, tick, currentPlayerId);
	const character = useCharacter(player ? player.id : "");

	const npcPlayer = useNPCPlayer(game.id, currentNPCId, tick);
	const npc = useNPC(tick, npcPlayer ? npcPlayer.parent ?? "" : "");
	const npcs = useNPCs();

	const [selected, setSelected] = useState<string | undefined>(undefined);
	let error: string = "";
	let addableUsers: User[] = [];
	const usernames = useUsernames();

	const [popupId, setPopupId] = useState(-1);
	const [popupData, setPopupData] = useState<any>();

	const [tab, setTab] = useState("1");

	const handleOpen = () => {
		setOpen(true);
	};

	const handleDelete = async (gamemasterToRemove: string) => {
		const lastIndex = staticGame.gamemasters.length;
		if (open == true && lastIndex > 1 && gamemasterToRemove != user.user) {
			if (gamemasterToRemove != staticGame.gamemaster) {
				await axios.post("/api/game/removeGamemaster", {
					id: game.id,
					gamemasterToRemove: gamemasterToRemove,
				});
				setOpen(false);
				updateTick();
				setOpen(true);
			} else {
				error =
					"Es ist nicht möglich den Owner eines Spiels als Gamemaster zu entfernen";
			}
		} else {
			error =
				"es ist nicht möglich sich selbst zu entfernen, bzw den letzten Gamemaster zu entfernen";
		}
	};

	const handleAdd = async () => {
		if (open == true && selected != null) {
			if (game.gamemasters.indexOf(selected) == -1) {
				await axios.post("/api/game/addGamemaster", {
					id: game.id,
					newGamemaster: selected,
				});
				const index = addableUsers.findIndex((x) => x.username == selected);
				if (index > -1) {
					addableUsers.splice(index, 1);
				}
				setSelected(null);
				setOpen(false);
				updateTick();
				setOpen(true);
			} else {
				error = "User ist bereits ein Gamemaster für dieses Spiel";
			}
		} else {
			error = "Bitte User auswählen";
		}
	};

	usernames.forEach((i) => {
		if (game.gamemasters.indexOf(i) == -1) {
			addableUsers.push(i);
		}
	});

	/**
	 * Saves Data Inputed inside the Popup according to the ID of the Popup
	 *
	 * @param data Data given by the Popup
	 * @returns
	 */
	async function savePopup(data: any) {
		switch (popupId) {
			case 0:
				let npc = data.npc;
				if (!npc) {
					return;
				}
				await saveNPC(game.id, {
					diceAmount: npc.data.dice ? npc.data.dice.amount ?? 0 : 0,
					id: generateUUID(),
					parent: npc.id,
					rk: npc.rk,
					hg: npc.data.hg ?? "",
					volk: npc.volk ?? "",
					name: data.name ?? npc.name,
					hp: npc.hp,
					spells: [],
					items: [],
					weapons: npc.data.weapons ?? [],
					hidden: false,
					spellSlots: {
						"1":
							npc.data.magic && npc.data.magic.slot
								? Number.parseInt(npc.data.magic.slot["1"] ?? 0)
								: 0,
						"2":
							npc.data.magic && npc.data.magic.slot
								? Number.parseInt(npc.data.magic.slot["2"] ?? 0)
								: 0,
						"3":
							npc.data.magic && npc.data.magic.slot
								? Number.parseInt(npc.data.magic.slot["3"] ?? 0)
								: 0,
						"4":
							npc.data.magic && npc.data.magic.slot
								? Number.parseInt(npc.data.magic.slot["4"] ?? 0)
								: 0,
						"5":
							npc.data.magic && npc.data.magic.slot
								? Number.parseInt(npc.data.magic.slot["5"] ?? 0)
								: 0,
						"6":
							npc.data.magic && npc.data.magic.slot
								? Number.parseInt(npc.data.magic.slot["6"] ?? 0)
								: 0,
						"7":
							npc.data.magic && npc.data.magic.slot
								? Number.parseInt(npc.data.magic.slot["7"] ?? 0)
								: 0,
						"8":
							npc.data.magic && npc.data.magic.slot
								? Number.parseInt(npc.data.magic.slot["8"] ?? 0)
								: 0,
						"9":
							npc.data.magic && npc.data.magic.slot
								? Number.parseInt(npc.data.magic.slot["9"] ?? 0)
								: 0,
					},
				});
				break;
			case 1:
				if (!data.npc) {
					return;
				}
				await saveNPC(game.id, {
					...data.npc,
					hidden: false,
				});
				break;
			case 2:
				for (let a = 1; a <= parseInt(data.amount); a++) {
					let npc = data.npc;
					if (!npc) {
						return;
					}
					await saveNPC(game.id, {
						diceAmount: npc.data.dice ? npc.data.dice.amount ?? 0 : 0,
						id: generateUUID(),
						parent: npc.id,
						rk: npc.rk,
						hg: npc.data.hg ?? "",
						volk: npc.volk ?? "",
						name: (data.name ?? npc.name) + " " + a,
						hp: npc.hp,
						spells: [],
						items: [],
						weapons: npc.data.weapons ?? [],
						hidden: false,
						spellSlots: {
							"1":
								npc.data.magic && npc.data.magic.slot
									? Number.parseInt(npc.data.magic.slot["1"] ?? 0)
									: 0,
							"2":
								npc.data.magic && npc.data.magic.slot
									? Number.parseInt(npc.data.magic.slot["2"] ?? 0)
									: 0,
							"3":
								npc.data.magic && npc.data.magic.slot
									? Number.parseInt(npc.data.magic.slot["3"] ?? 0)
									: 0,
							"4":
								npc.data.magic && npc.data.magic.slot
									? Number.parseInt(npc.data.magic.slot["4"] ?? 0)
									: 0,
							"5":
								npc.data.magic && npc.data.magic.slot
									? Number.parseInt(npc.data.magic.slot["5"] ?? 0)
									: 0,
							"6":
								npc.data.magic && npc.data.magic.slot
									? Number.parseInt(npc.data.magic.slot["6"] ?? 0)
									: 0,
							"7":
								npc.data.magic && npc.data.magic.slot
									? Number.parseInt(npc.data.magic.slot["7"] ?? 0)
									: 0,
							"8":
								npc.data.magic && npc.data.magic.slot
									? Number.parseInt(npc.data.magic.slot["8"] ?? 0)
									: 0,
							"9":
								npc.data.magic && npc.data.magic.slot
									? Number.parseInt(npc.data.magic.slot["9"] ?? 0)
									: 0,
						},
					});
				}
				break;
			case 3:
				if (!data.players || !data.npc) {
					return;
				}
				for (let p of data.players) {
					await savePlayer(game.id, {
						...p,
						hp: data.npc.hp,
						spellSlots: data.npc.data.magic
							? data.npc.data.magic.slot ?? undefined
							: undefined,
						transformData: {
							hp: data.npc.hp,
							rk: data.npc.rk,
							name: data.npc.name,
							weapons: data.npc.data.weapons ?? [],
							attributes: {
								...data.npc.attributes,
								kon: undefined,
							},
							spellText:
								data.npc.data.magic && data.npc.data.magic.text
									? data.npc.data.magic.text
									: undefined,
							legend: data.npc.data.legend ?? undefined,
							conditionImmunity: data.npc.data.conditionImmunity ?? [],
							damageResistance: data.npc.data.damageResistance ?? [],
							damageEmpfind: data.npc.data.damageEmpfind ?? [],
							damageImmunity: data.npc.data.damageImmunity ?? [],
							ubungsBonus: data.npc.ubungsBonus,
							abilities: data.npc.abilities ?? [],
							ubungRW: data.npc.ubungRW,
							ubungAB: data.npc.ubungAB,
							bewegungsrate: data.npc.data.bewegungsrate,
							spellSlots: data.npc.data.magic
								? data.npc.data.magic.slot ?? undefined
								: undefined,
							spells: data.npc.data.magic
								? data.npc.data.magic.spells ?? []
								: [],
							allwaysSpells: data.npc.data.magic
								? data.npc.data.magic.allwaysSpells ?? []
								: [],
							tricks: data.npc.data.magic
								? data.npc.data.magic.tricks ?? []
								: [],
							traits: data.npc.data.traits ?? undefined,
							actions: data.npc.data.actions ?? undefined,
						},
					});
				}

				break;
			case 4:
				if (!data.player) {
					return;
				}
				await savePlayer(game.id, {
					...data.player,
					disabled: false,
				});
				break;
			case 5:
				if (!data || !data.name) {
					return;
				}
				await saveItem(game.id, {
					...data,
					id: generateUUID(),
				});
				break;
			case 6:
				if (!data || !data.id) {
					return;
				}
				await saveItem(game.id, data);
				break;
			case 7:
				if (!data || !data.game) {
					return;
				}
				await saveGame(data.game);
				break;
			case 8:
				if (!data || !data.name) {
					return;
				}
				await createMap(game, data.name);
				break;
			case 9:
				if (!data || !data.mapId || !data.note) {
					return;
				}
				await addNoteToMap(game, data.mapId, data.note);
				break;
			case 10:
				if (!data || !data.mapId || !data.ids) {
					return;
				}
				for (let id of data.ids) {
					console.log(id);
					if (id.npc) {
						await moveNPCToMap(game, data.mapId, id.id);
						continue;
					}

					await movePlayerToMap(game, data.mapId, id.id);
				}
				break;
			case 11:
				if (!data || !data.mapId || !data.id || !data.color) {
					return;
				}
				await setColorOfToken(data.mapId, game, data.id, data.color);
				break;
			case 12:
				if (!data || !data.mapId || !data.fighter) {
					return;
				}
				let newF = [];
				for (let f of data.fighter) {
					if (f.init.startsWith("wurf")) {
						newF.push({
							...f,
							init: Number.parseInt(resolveToValue({}, f.init)),
						});
						continue;
					}
					newF.push({
						...f,
						init: Number.parseInt(f.init),
					});
				}
				let currentFight = undefined;
				for (let m of game.mapData) {
					if (m.id == data.mapId) {
						currentFight = m.fight;
					}
				}
				if (currentFight) {
					let f1 = [];
					await saveFight(game, data.mapId, {
						...currentFight,
						fighter: [...newF, ...currentFight.fighter].filter(
							(value, index, self) =>
								index == self.findIndex((t) => t.id == value.id)
						),
					});
					break;
				}
				await saveFight(
					addEventToGame(game, {
						name: "Kampf wurde gestartet",
						etype: "fight",
					}),
					data.mapId,
					{
						round: 1,
						turn: 0,
						events: [],
						time: 0,
						fighter: newF,
					}
				);
				break;
			case 13:
				if (!data || !data.user || !data.onSave) {
					return;
				}
				data.onSave(data.user);
				break;
			case 14:
				if (!data || !data.change) {
					break;
				}
				data.onSave(data.change);
				break;
			case 15:
				if (!data || !data.time || !data.name) {
					break;
				}
				data.onSave({ name: data.name, startTime: data.time });
				break;
			case 16:
				if (!data) {
					break;
				}
				data.onSave(data);
				break;
			case 17:
				if (!data || !data.name) {
					break;
				}
				await saveGame({
					...game,
					worldData: { ...game.worldData, locationPlayer: data.name },
				});
		}
		setPopupData({});
		setPopupId(-1);
		updateTick();
	}

	if (currentNPCId != "-1" && npc) {
		return (
			<>
				<Button
					onClick={() => {
						setCurrentNPCId("-1");
					}}
				>
					Zurück
				</Button>
				<DnDCharacterSheetCP
					save={async (game: any, data: any) => {
						await saveNPC(game, data);
						updateTick();
					}}
					tick={tick}
					character={npc}
					gameId={game.id}
					player={npcPlayer}
					setUpdateTick={() => {
						updateTick();
					}}
				></DnDCharacterSheetCP>
			</>
		);
	}

	if (currentPlayerId != "-1" && character) {
		return (
			<>
				<Button
					onClick={() => {
						setCurrentPlayerId("-1");
					}}
				>
					Zurück
				</Button>
				<DnDCharacterSheetCP
					save={async (game: any, data: any) => {
						await savePlayer(game, data);
						updateTick();
					}}
					tick={tick}
					character={character}
					gameId={game.id}
					player={player}
					setUpdateTick={() => {
						updateTick();
					}}
				></DnDCharacterSheetCP>
			</>
		);
	}

	return (
		<div
			onContextMenu={(e) => {
				setCustomContext({
					posX: e.pageX,
					posY: e.pageY,
				});
				e.stopPropagation();
				e.preventDefault();
			}}
			onClick={(e) => {
				setCustomContext(undefined);
			}}
		>
			{/** TODO DELETE THIS AND MAKE IT TO POPUP */}
			<div>
				<DnDModal
					open={open}
					onClose={() => setOpen(false)}
					disableCommit={true}
					closeLable={"schließen"}
					children={
						<div>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									marginTop: "1em",
									marginBottom: "1em",
								}}
							>
								<Typography variant="h4">Gamemaster Bearbeiten</Typography>
							</div>
							<div style={{ marginBottom: "1em" }}>Gamemaster Hinzufügen</div>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									width: "80%",
									marginRight: "auto",
									marginLeft: "auto",
								}}
							>
								<FormControl fullWidth>
									<InputLabel id="UserSelect">Benutzer wählen</InputLabel>
									<Select
										labelId="UserSelect"
										id="UserSelect"
										value={selected}
										label="Benutzer wählen"
										onChange={(e) => setSelected(e.target.value)}
									>
										{addableUsers.map((item: User) => (
											<MenuItem key={item.username} value={item.username}>
												{item.username}
											</MenuItem>
										))}
									</Select>
									<Button onClick={() => handleAdd()} variant="outlined">
										Hinzufügen
									</Button>
								</FormControl>
							</div>
							<div>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Benutzer</TableCell>
											<TableCell>Löschen</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{staticGame.gamemasters.map((item: any) => {
											return (
												<TableRow key={item}>
													<TableCell>{item}</TableCell>
													<TableCell>
														<IconButton
															onClick={async () => handleDelete(item)}
														>
															<Delete></Delete>
														</IconButton>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						</div>
					}
				></DnDModal>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignContent: "center",
				}}
			>
				<div></div>
				<Typography variant="h3">
					Spielleiter {game.name}
					<Tooltip title="Refresh">
						<IconButton
							onClick={() => {
								updateTick();
							}}
						>
							<RotateLeft></RotateLeft>
						</IconButton>
					</Tooltip>
					<Tooltip title="Spiel Löschen">
						<IconButton
							onClick={async () => {
								await deleteGame(game.id);
								window.location.href = "/games";
							}}
						>
							<Delete></Delete>
						</IconButton>
					</Tooltip>
					<Tooltip title="Spiel Bearbeiten">
						<IconButton
							disabled
							onClick={async () => {
								setPopupData({ game });
								setPopupId(7);
							}}
						>
							<Edit></Edit>
						</IconButton>
					</Tooltip>
					<Tooltip title="Gamemaster editieren">
						<IconButton onClick={() => handleOpen()}>
							<Person4></Person4>
						</IconButton>
					</Tooltip>
				</Typography>
				<div
					onClick={async () => {
						await saveGame({
							...game,
							status: game.status == "open" ? "closed" : "open",
						});
						updateTick();
					}}
					style={{
						alignContent: "center",
						cursor: "pointer",
						textAlign: "center",
						width: "100px",
						marginRight: "10px",
						backgroundColor: game.status == "open" ? "lightgreen" : "red",
						marginTop: "5px",
						borderRadius: "10px",
						height: "50px",
					}}
				>
					{game.status == "open" ? "Offen" : "Geschlossen"}
				</div>
			</div>
			<TabContext value={tab}>
				<TabList
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignContent: "center",
						width: "100%",
					}}
					onChange={(e, newValue) => {
						setTab(newValue);
					}}
				>
					<Tab
						value="1"
						label="Spieler"
						sx={{
							backgroundColor: tab == "1" ? "#F5F5F582" : undefined,
							backdropFilter: "blur(8px)",
							borderRadius: "10px 10px 0 0 ",
						}}
					/>
					<Tab
						value="2"
						label="NPCs"
						sx={{
							backgroundColor: tab == "2" ? "#F5F5F582" : undefined,
							backdropFilter: "blur(8px)",
							borderRadius: "10px 10px 0 0 ",
						}}
					/>
					<Tab
						value="3"
						label="Items"
						sx={{
							backgroundColor: tab == "3" ? "#F5F5F582" : undefined,
							backdropFilter: "blur(8px)",
							borderRadius: "10px 10px 0 0 ",
						}}
					/>
					<Tab
						value="4"
						label="Karten"
						sx={{
							backgroundColor: tab == "4" ? "#F5F5F582" : undefined,
							backdropFilter: "blur(8px)",
							borderRadius: "10px 10px 0 0 ",
						}}
					/>
					<Tab
						value="5"
						label="Kampf"
						sx={{
							backgroundColor: tab == "5" ? "#F5F5F582" : undefined,
							backdropFilter: "blur(8px)",
							borderRadius: "10px 10px 0 0 ",
						}}
					/>
					<Tab
						value="6"
						label="Charactere"
						sx={{
							backgroundColor: tab == "6" ? "#F5F5F582" : undefined,
							backdropFilter: "blur(8px)",
							borderRadius: "10px 10px 0 0 ",
						}}
					/>
					<Tab
						value="7"
						label="Kalender"
						sx={{
							backgroundColor: tab == "7" ? "#F5F5F582" : undefined,
							backdropFilter: "blur(8px)",
							borderRadius: "10px 10px 0 0 ",
						}}
					/>
					<Tab
						value="8"
						label="Quests"
						sx={{
							backgroundColor: tab == "8" ? "#F5F5F582" : undefined,
							backdropFilter: "blur(8px)",
							borderRadius: "10px 10px 0 0 ",
						}}
					/>
					<Tab
						value="9"
						label="Events"
						sx={{
							backgroundColor: tab == "9" ? "#F5F5F582" : undefined,
							backdropFilter: "blur(8px)",
							borderRadius: "10px 10px 0 0 ",
						}}
					/>
				</TabList>
				<TabPanel
					value="1"
					sx={{
						backgroundColor: "#F5F5F582",
						backdropFilter: "blur(8px)",
						borderRadius: "0 0 10px 10px",
					}}
				>
					<DnDGamemasterPlayerListCP
						customContext={customContext}
						setCustomContext={setCustomContext}
						game={game}
						npcs={npcs}
						setCurrentPlayerId={setCurrentPlayerId}
						setPopupData={setPopupData}
						setPopupId={setPopupId}
						updateTick={updateTick}
					></DnDGamemasterPlayerListCP>
				</TabPanel>

				<TabPanel
					value="2"
					sx={{
						backgroundColor: "#F5F5F582",
						backdropFilter: "blur(8px)",
						borderRadius: "0 0 10px 10px",
					}}
				>
					<DnDGamemasterNPCListCP
						customContext={customContext}
						setCustomContext={setCustomContext}
						game={game}
						npcs={npcs}
						setCurrentPlayerId={setCurrentNPCId}
						setPopupData={setPopupData}
						setPopupId={setPopupId}
						updateTick={updateTick}
					></DnDGamemasterNPCListCP>
				</TabPanel>
				<TabPanel
					value="3"
					sx={{
						backgroundColor: "#F5F5F582",
						backdropFilter: "blur(8px)",
						borderRadius: "0 0 10px 10px",
					}}
				>
					<DnDGamemasterItemsListCP
						customContext={customContext}
						setCustomContext={setCustomContext}
						game={game}
						setPopupData={setPopupData}
						setPopupId={setPopupId}
						updateTick={updateTick}
					></DnDGamemasterItemsListCP>
				</TabPanel>
				<TabPanel
					value="4"
					sx={{
						backgroundColor: "#F5F5F582",
						backdropFilter: "blur(8px)",
						borderRadius: "0 0 10px 10px",
					}}
				>
					<DnDGamemasterMapsCP
						game={game}
						npcs={npcs}
						customContext={customContext}
						setCurrentNPCId={setCurrentNPCId}
						setCurrentPlayerId={setCurrentPlayerId}
						setCustomContext={setCustomContext}
						setPopupData={setPopupData}
						setPopupId={setPopupId}
						tick={tick}
						updateTick={updateTick}
					></DnDGamemasterMapsCP>
				</TabPanel>
				<TabPanel
					value="5"
					sx={{
						backgroundColor: "#F5F5F582",
						backdropFilter: "blur(8px)",
						borderRadius: "0 0 10px 10px",
					}}
				>
					<DnDGamemasterFightCP
						game={game}
						npcs={npcs}
						setCurrentNPCId={setCurrentNPCId}
						setCurrentPlayerId={setCurrentPlayerId}
						setPopupData={setPopupData}
						setPopupId={setPopupId}
						setCustomContext={setCustomContext}
						customContext={customContext}
						tick={tick}
						updateTick={updateTick}
					></DnDGamemasterFightCP>
				</TabPanel>

				<TabPanel
					value="6"
					sx={{
						backgroundColor: "#F5F5F582",
						backdropFilter: "blur(8px)",
						borderRadius: "0 0 10px 10px",
					}}
				>
					<DnDGamemasterCharacterCP
						customContext={customContext}
						game={game}
						setCustomContext={setCustomContext}
						tick={tick}
						updateTick={updateTick}
					></DnDGamemasterCharacterCP>
				</TabPanel>

				<TabPanel
					value="7"
					sx={{
						backgroundColor: "#F5F5F582",
						backdropFilter: "blur(8px)",
						borderRadius: "0 0 10px 10px",
					}}
				>
					<DnDGamemasterCalenderCP
						setPopupId={setPopupId}
						setPopupData={setPopupData}
						customContext={customContext}
						game={game}
						setCustomContext={setCustomContext}
						tick={tick}
						updateTick={updateTick}
					></DnDGamemasterCalenderCP>
				</TabPanel>
				<TabPanel
					value="8"
					sx={{
						backgroundColor: "#F5F5F582",
						backdropFilter: "blur(8px)",
						borderRadius: "0 0 10px 10px",
					}}
				>
					<DnDGamemasterQuestCP
						customContext={customContext}
						game={game}
						setCustomContext={setCustomContext}
						tick={tick}
						updateTick={updateTick}
					></DnDGamemasterQuestCP>
				</TabPanel>
				<TabPanel
					value="9"
					sx={{
						backgroundColor: "#F5F5F582",
						backdropFilter: "blur(8px)",
						borderRadius: "0 0 10px 10px",
					}}
				>
					<DnDGamemasterEventCP
						customContext={customContext}
						game={game}
						setCustomContext={setCustomContext}
						tick={tick}
						updateTick={updateTick}
					></DnDGamemasterEventCP>
				</TabPanel>
			</TabContext>

			<DnDGameMasterPopup
				id={popupId}
				data={popupData}
				onClose={() => {
					setPopupData({});
					setPopupId(-1);
				}}
				onSave={savePopup}
			></DnDGameMasterPopup>
		</div>
	);
}
