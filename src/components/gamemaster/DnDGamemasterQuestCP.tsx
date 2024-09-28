import {
	ListItemIcon,
	ListItemText,
	MenuItem,
	Typography,
} from "@mui/material";
import DnDGamemasterCharacterEditor from "./DnDGamemasterCharacterEditor";
import { useMemo, useState } from "react";
import DnDContextMenu from "../basic/DnDContextMenu";
import { Add, Close, Delete, Edit, ResetTv, Start } from "@mui/icons-material";
import { addEventToGame, saveGame } from "@/utils/game";
import { generateUUID } from "three/src/math/MathUtils";
import DnDGamemasterQuestEditor from "./DnDGamemasterQuestEditor";

export default function DnDGamemasterQuestCP({
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
	const [selectedQuestId, setSelectedQuestId] = useState("-1");
	const [editMode, setEditMode] = useState(false);

	const selectedQuest = useMemo(() => {
		if (selectedQuestId == "-1") {
			return undefined;
		}
		for (let c of game.roleplayData) {
			if (c.type == "quest" && c.id == selectedQuestId) {
				return c;
			}
		}
		return undefined;
	}, [game, selectedQuestId]);

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
						<ListItemText>Quest Löschen</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							setSelectedQuestId(customContext.target);
							setEditMode(true);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Edit></Edit>
						</ListItemIcon>
						<ListItemText>Quest bearbeiten</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							let g = game;
							let newRoleplay = [];
							let createEvent = undefined;
							for (let r of g.roleplayData) {
								if (r.id == customContext.target) {
									if (r.active) {
										createEvent = {
											name: "Quest " + r.name + " wird nicht weiter verfolgt",
											description: "",
											etype: "quest",
										};
									}
									newRoleplay.push({
										...r,
										active: false,
										solved: false,
									});
									continue;
								}
								newRoleplay.push(r);
							}
							g.roleplayData = newRoleplay;
							if (createEvent) {
								g = addEventToGame(game, createEvent);
							}
							await saveGame(g);
							updateTick();
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<ResetTv></ResetTv>
						</ListItemIcon>
						<ListItemText>Quest zurücksetzen</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							let g = game;
							let newRoleplay = [];
							let createEvent = undefined;
							for (let r of g.roleplayData) {
								if (r.id == customContext.target) {
									if (r.solved) {
										createEvent = {
											name: "Quest " + r.name + " wurde wieder aufgenommen",
											description: "",
											etype: "quest",
										};
									} else {
										createEvent = {
											name: "Quest " + r.name + " wurde angenommen",
											description: "",
											etype: "quest",
										};
									}

									newRoleplay.push({
										...r,
										active: true,
										solved: false,
									});
									continue;
								}
								newRoleplay.push(r);
							}
							g.roleplayData = newRoleplay;
							if (createEvent) {
								g = addEventToGame(game, createEvent);
							}
							await saveGame(g);
							updateTick();
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Start></Start>
						</ListItemIcon>
						<ListItemText>Quest aktivieren</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							let g = game;
							let newRoleplay = [];
							let createEvent = undefined;
							for (let r of g.roleplayData) {
								if (r.id == customContext.target) {
									createEvent = {
										name: "Quest " + r.name + " wurde abgeschlossen.",
										description: "",
										etype: "quest",
									};
									newRoleplay.push({
										...r,
										active: false,
										solved: true,
									});
									continue;
								}
								newRoleplay.push(r);
							}
							g.roleplayData = newRoleplay;
							if (createEvent) {
								g = addEventToGame(game, createEvent);
							}
							await saveGame(g);
							updateTick();
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Close></Close>
						</ListItemIcon>
						<ListItemText>Quest abschließen</ListItemText>
					</MenuItem>
					<MenuItem
						onClick={async (e) => {
							e.stopPropagation();
							let g = game;
							g.roleplayData.push({
								name: "Neue Quest",
								type: "quest",
								description: "",
								gmInfo: "",
								active: false,
								solved: false,
								qtype: "side",
								id: generateUUID(),
							});
							await saveGame(g);
							updateTick();
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Add></Add>
						</ListItemIcon>
						<ListItemText>Quest hinzufügen</ListItemText>
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
					Quests
				</Typography>
				{game.roleplayData.map((item) => {
					if (item.type != "quest") {
						return;
					}
					return (
						<div
							key={"quest_" + item.id}
							onClick={(e) => {
								setSelectedQuestId(item.id);
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
									item.id == selectedQuestId ? "#DADAFA" : undefined,
							}}
						>
							<b>{item.name}</b>
						</div>
					);
				})}
			</div>
			<DnDGamemasterQuestEditor
				item={selectedQuest}
				edit={editMode}
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
			></DnDGamemasterQuestEditor>
		</div>
	);
}
