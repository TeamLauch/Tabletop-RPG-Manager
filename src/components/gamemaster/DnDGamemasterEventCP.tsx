import {
	ListItemIcon,
	ListItemText,
	MenuItem,
	Typography,
} from "@mui/material";
import DnDGamemasterCharacterEditor from "./DnDGamemasterCharacterEditor";
import { useMemo, useState } from "react";
import DnDContextMenu from "../basic/DnDContextMenu";
import {
	Add,
	Check,
	Close,
	Delete,
	Edit,
	ResetTv,
	Start,
} from "@mui/icons-material";
import { addEventToGame, saveGame } from "@/utils/game";
import { generateUUID } from "three/src/math/MathUtils";
import DnDGamemasterQuestEditor from "./DnDGamemasterQuestEditor";
import DnDGamemasterEventEditor from "./DnDGamemasterEventEditor";

export default function DnDGamemasterEventCP({
	game,
	setCustomContext,
	customContext,
	updateTick,
	tick,
}: {
	setCustomContext: any;
	customContext: any;
	game: any;
	updateTick: any;
	tick: any;
}) {
	const [selectedEventId, setSelectedEventId] = useState("-1");
	const [editMode, setEditMode] = useState(false);

	const selectedEvent = useMemo(() => {
		if (selectedEventId == "-1") {
			return undefined;
		}
		for (let c of game.roleplayData) {
			if (c.type == "event" && c.id == selectedEventId) {
				return c;
			}
		}
		return undefined;
	}, [game, selectedEventId]);

	const sortedEvents = useMemo(() => {
		if (!game) {
			return [];
		}
		return game.roleplayData
			.filter((item) => item.type == "event")
			.sort((a, b) => {
				if (parseInt(a.date) < parseInt(b.date)) {
					return 1;
				}
				if (parseInt(a.date) > parseInt(b.date)) {
					return -1;
				}
				if (parseInt(a.time) < parseInt(b.time)) {
					return 1;
				}
				if (parseInt(a.time) > parseInt(b.time)) {
					return -1;
				}
				return 0;
			});
	}, [game]);

	return (
		<div
			style={{
				width: "98%",
				marginLeft: "0.5%",
				minHeight: window.innerHeight / 1.5 + "px",
				marginTop: "1%",
				border: "1px solid black",
				borderRadius: "5px",
				backgroundColor: "#F5F5F5",
				display: "grid",
				gridTemplateRows: "auto",
				gridTemplateColumns: "1fr 3fr",
				flexWrap: "nowrap",
				padding: "5px",
			}}
		>
			{customContext ? (
				<DnDContextMenu posX={customContext.posX} posY={customContext.posY}>
					<MenuItem
						disabled={!customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							let g = game;
							g.roleplayData = g.roleplayData.filter(
								(item) => item.id != customContext.target
							);
							await saveGame(g);
							updateTick();
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Delete></Delete>
						</ListItemIcon>
						<ListItemText>Event Löschen</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							setSelectedEventId(customContext.target);
							setEditMode(true);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Edit></Edit>
						</ListItemIcon>
						<ListItemText>Event bearbeiten</ListItemText>
					</MenuItem>

					{customContext.etype == "rast" ? (
						<MenuItem
							disabled={!customContext.target}
							onClick={async (e) => {
								e.stopPropagation();
								let g = game;
								let newRoleplay = [];
								for (let r of g.roleplayData) {
									if (r.id == customContext.target) {
										newRoleplay.push({
											...r,
											used: true,
										});
										continue;
									}
									newRoleplay.push(r);
								}
								g.roleplayData = newRoleplay;
								await saveGame(g);
								updateTick();
								setCustomContext(undefined);
							}}
						>
							<ListItemIcon>
								<Check></Check>
							</ListItemIcon>
							<ListItemText>Rast durchgeführt</ListItemText>
						</MenuItem>
					) : (
						<></>
					)}

					<MenuItem
						onClick={async (e) => {
							e.stopPropagation();
							let g = game;
							g = addEventToGame(g, { name: "Neues Event", etype: "other" });
							await saveGame(g);
							updateTick();
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Add></Add>
						</ListItemIcon>
						<ListItemText>Event hinzufügen</ListItemText>
					</MenuItem>
				</DnDContextMenu>
			) : (
				<></>
			)}
			<div
				style={{
					flexDirection: "column",
					display: "flex",
					margin: "5px",
					padding: "5px",
					border: "1px solid black",
					borderRadius: "5px",
					overflow: "auto",
				}}
			>
				<Typography variant="h4" sx={{ textAlign: "center" }}>
					Events
				</Typography>
				{sortedEvents.map((item) => {
					return (
						<div
							key={"event_" + item.id}
							onClick={(e) => {
								setSelectedEventId(item.id);
								setEditMode(false);
							}}
							onContextMenu={
								setCustomContext
									? (e) => {
											e.preventDefault();
											setCustomContext({
												posX: e.pageX,
												posY: e.pageY,
												target: item.id,
												etype: item.etype,
											});
											e.stopPropagation();
										}
									: undefined
							}
							style={{
								cursor: "pointer",
								border: "1px solid black",
								borderRadius: "10px",
								display: "flex",
								fontSize: "18pt",
								marginTop: "5px",
								marginBottom: "5px",
								flexDirection: "column",
								textAlign: "center",
								backgroundColor:
									item.id == selectedEventId ? "#DADAFA" : undefined,
							}}
						>
							<b>{item.name}</b>
						</div>
					);
				})}
			</div>
			<DnDGamemasterEventEditor
				item={selectedEvent}
				edit={editMode}
				game={game}
				tick={tick}
				save={async (data) => {
					setEditMode(false);
					let g = game;
					let newRoleplay = [];
					for (let r of g.roleplayData) {
						if (r.id == data.id) {
							newRoleplay.push(data);
							continue;
						}
						newRoleplay.push(r);
					}
					g.roleplayData = newRoleplay;
					await saveGame(g);
					updateTick();
				}}
			></DnDGamemasterEventEditor>
		</div>
	);
}
