import {
	ListItemIcon,
	ListItemText,
	MenuItem,
	Typography,
} from "@mui/material";
import DnDGamemasterCharacterEditor from "./DnDGamemasterCharacterEditor";
import { useMemo, useState } from "react";
import DnDContextMenu from "../basic/DnDContextMenu";
import { Add, Delete, Edit } from "@mui/icons-material";
import { saveGame } from "@/utils/game";
import { generateUUID } from "three/src/math/MathUtils";

export default function DnDGamemasterCharacterCP({
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
	const [selectedCharacterId, setSelectedCharacterId] = useState("-1");
	const [editMode, setEditMode] = useState(false);

	const selectedCharacter = useMemo(() => {
		if (selectedCharacterId == "-1") {
			return undefined;
		}
		for (let c of game.roleplayData) {
			if (c.type == "character" && c.id == selectedCharacterId) {
				return c;
			}
		}
		return undefined;
	}, [game, selectedCharacterId]);

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
						<ListItemText>Character Löschen</ListItemText>
					</MenuItem>
					<MenuItem
						disabled={!customContext.target}
						onClick={async (e) => {
							e.stopPropagation();
							setSelectedCharacterId(customContext.target);
							setEditMode(true);
							setCustomContext(undefined);
						}}
					>
						<ListItemIcon>
							<Edit></Edit>
						</ListItemIcon>
						<ListItemText>Character bearbeiten</ListItemText>
					</MenuItem>
					<MenuItem
						onClick={async (e) => {
							e.stopPropagation();
							let g = game;
							g.roleplayData.push({
								name: "Neuer Character",
								type: "character",
								description: "",
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
						<ListItemText>Character hinzufügen</ListItemText>
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
					Charactere
				</Typography>
				{game.roleplayData.map((item) => {
					if (item.type != "character") {
						return;
					}
					return (
						<div
							key={"character_" + item.id}
							onClick={(e) => {
								setSelectedCharacterId(item.id);
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
									item.id == selectedCharacterId ? "#DADAFA" : undefined,
							}}
						>
							<b>{item.name}</b>
						</div>
					);
				})}
			</div>
			<DnDGamemasterCharacterEditor
				item={selectedCharacter}
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
			></DnDGamemasterCharacterEditor>
		</div>
	);
}
