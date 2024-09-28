import {
	Autocomplete,
	Icon,
	IconButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	TextField,
	Tooltip,
	Typography,
	styled,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import {
	addImageToMap,
	deleteNoteFromMap,
	saveGame,
	setActiveMap,
} from "@/utils/game";
import {
	AcUnit,
	Add,
	Delete,
	LocationCity,
	LocationOn,
	More,
	Tag,
	ThunderstormOutlined,
	WbCloudyOutlined,
	WbIncandescentOutlined,
	WbSunny,
	WbSunnyOutlined,
} from "@mui/icons-material";
import DnDGamemasterDefaulListCP from "./DnDGamemasterDefaultListCP";
import DnDGamemasterPlayerItemCP from "./DnDGamemasterPlayerItemCP";
import DnDGamemasterNPCItemCP from "./DnDGamemasterNPCItemCP";
import MapCP from "../map/MapComponents";
import DnDGamemasterMapItemCP from "./DnDGamemasterMapItemCP";
import DnDContextMenu from "../basic/DnDContextMenu";
import Image from "next/image";

/**
 * Hidden Imput for Uploading Files
 */
const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export default function DnDGamemasterMapsCP({
	npcs,
	setCurrentPlayerId,
	setCurrentNPCId,
	game,
	setCustomContext,
	customContext,
	setPopupData,
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
	const [currentMapId, setCurrentMapId] = useState("-2");

	const activeMap = useMemo(() => {
		for (let map of game.mapData) {
			if (map.active) {
				return map;
			}
		}
		return game.mapData[0];
	}, [game]);

	const currentMap = useMemo(() => {
		if (!game.mapData) {
			return undefined;
		}

		if (currentMapId == "-2") {
			return activeMap;
		}

		for (let map of game.mapData) {
			if (map.id == currentMapId) {
				return map;
			}
		}
		if (game.worldData.id == currentMapId) {
			return { id: game.worldData.id, name: "Weltkarte", worldMap: true };
		}

		return undefined;
	}, [currentMapId, game]);

	const [editPlayerPos, setEditPlayerPos] = useState(false);

	/**
	 *
	 * @param event Event of the Input
	 */
	const handleFileUpload = async (event: any, imageId: string) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", currentMap.id + "_" + imageId);

		// Send formData to server-side endpoint
		const response = await fetch("/api/file/uploadMap", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
		} else {
			// Handle error
		}
	};

	const notes = useMemo(() => {
		if (!currentMap) {
			return game.mapData[0] ? game.mapData[0].notes : [];
		}
		if (currentMap.worldMap) {
			return [];
		}
		return currentMap.notes;
	}, [currentMap, game]);

	const [mapheight, setmapHeight] = useState(0);
	const [mapwidth, setmapWidth] = useState(0);

	const mapDiv = useCallback((node: any) => {
		if (node !== null) {
			setmapHeight(node.getBoundingClientRect().height);
			setmapWidth(node.getBoundingClientRect().width);
		}
	}, []);

	const playerPosition = useMemo(() => {
		if (!game.worldData || !game.worldData.playerPosition) {
			return undefined;
		}
		return game.worldData.playerPosition;
	}, [game]);

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

	return (
		<div
			style={{
				width: "98%",
				marginLeft: "0.5%",
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
					{!customContext.notes ? (
						<MenuItem
							onClick={async (e) => {
								e.stopPropagation();
								setPopupId(8);
								setCustomContext(undefined);
							}}
						>
							<ListItemIcon>
								<Add></Add>
							</ListItemIcon>
							<ListItemText>Karte hinzufügen</ListItemText>
						</MenuItem>
					) : (
						<></>
					)}
					{!customContext.notes ? (
						<MenuItem
							onClick={async (e) => {
								e.stopPropagation();
								let nMapData = game.mapData;
								nMapData = nMapData.filter(
									(item) => item.id == "-1" || item.id != customContext.target
								);
								await saveGame({
									...game,
									mapData: nMapData,
								});
								updateTick();
								setCustomContext(undefined);
							}}
							disabled={
								!customContext.target ||
								customContext.target == activeMap.id ||
								customContext.target == "-1" ||
								customContext.target == game.worldData.id
							}
						>
							<ListItemIcon>
								<Delete></Delete>
							</ListItemIcon>
							<ListItemText>Karte löschen</ListItemText>
						</MenuItem>
					) : (
						<></>
					)}
					{!customContext.notes ? (
						<MenuItem
							disabled={
								!customContext.target ||
								customContext.target == activeMap.id ||
								customContext.target == game.worldData.id
							}
							onClick={async (e) => {
								e.stopPropagation();
								await setActiveMap(customContext.target, game);
								setCustomContext(undefined);
								updateTick();
							}}
						>
							<ListItemIcon>
								<LocationOn></LocationOn>
							</ListItemIcon>
							<ListItemText>Aktive Karte setzen</ListItemText>
						</MenuItem>
					) : (
						<></>
					)}
					{customContext.notes ? (
						<MenuItem
							onClick={async (e) => {
								e.stopPropagation();
								setPopupId(9);
								setPopupData({
									id: currentMap.id,
								});
								setCustomContext(undefined);
							}}
						>
							<ListItemIcon>
								<Add></Add>
							</ListItemIcon>
							<ListItemText>Notiz hinzufügen</ListItemText>
						</MenuItem>
					) : (
						<></>
					)}
					{customContext.notes ? (
						<MenuItem
							disabled={!customContext.target && customContext.target != 0}
							onClick={async (e) => {
								e.stopPropagation();
								await deleteNoteFromMap(
									game,
									currentMap.id,
									customContext.target
								);
								updateTick();
								setCustomContext(undefined);
							}}
						>
							<ListItemIcon>
								<Delete></Delete>
							</ListItemIcon>
							<ListItemText>Notiz löschen</ListItemText>
						</MenuItem>
					) : (
						<></>
					)}
				</DnDContextMenu>
			) : (
				<></>
			)}
			<div
				style={{
					gridRow: "1 / span 2",
					flexDirection: "column",
					display: "flex",
					margin: "5px",
					padding: "5px",
					border: "1px solid black",
					borderRadius: "5px",
				}}
			>
				<Typography sx={{ textAlign: "center" }} variant="h4">
					Karten
				</Typography>
				{game.mapData.map((item) => {
					let selected = item.id == currentMap.id;
					return (
						<DnDGamemasterMapItemCP
							item={item}
							onClick={(e) => {
								setCurrentMapId(item.id);
							}}
							setCurrentNPCId={setCurrentNPCId}
							setCurrentPlayerId={setCurrentPlayerId}
							setCustomContext={setCustomContext}
							style={{
								marginTop: "5px",
								backgroundColor: selected
									? "#DADAFA"
									: item.id == activeMap.id
										? "#FADADA"
										: undefined,
							}}
							players={selected ? players : undefined}
							npcs={selected ? npcsOnMap : undefined}
							key={"map_" + item.id}
						></DnDGamemasterMapItemCP>
					);
				})}
				{game.worldData.id ? (
					<DnDGamemasterMapItemCP
						item={{ id: game.worldData.id, name: "Weltkarte" }}
						onClick={(e) => {
							setCurrentMapId(game.worldData.id);
						}}
						setCurrentNPCId={setCurrentNPCId}
						setCurrentPlayerId={setCurrentPlayerId}
						setCustomContext={setCustomContext}
						style={{
							marginTop: "5px",
							backgroundColor:
								currentMap.id == game.worldData.id
									? "#DADAFA"
									: game.worldData.id == activeMap.id
										? "#FADADA"
										: undefined,
						}}
						players={undefined}
						npcs={undefined}
					></DnDGamemasterMapItemCP>
				) : (
					<></>
				)}
			</div>
			{!currentMap || !currentMap.worldMap ? (
				<div
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							justifyContent: "center",
							width: "100%",
							display: "flex",
							flexDirection: "row",
						}}
					>
						<Tooltip title="Map hochladen">
							<IconButton role={undefined} tabIndex={-1} component="label">
								<ImageIcon></ImageIcon>
								<VisuallyHiddenInput
									type="file"
									onChange={async (e) => {
										await handleFileUpload(e, "test");
										await addImageToMap(
											"/api/file/getImage?type=map&id=" + currentMap.id,
											0,
											game,
											currentMap.id
										);
									}}
								/>
							</IconButton>
						</Tooltip>
					</div>
					<div
						ref={mapDiv}
						style={{
							backgroundColor: "black",
							width: "100%",
							aspectRatio: "16/9",
							alignItems: "center",
							borderRadius: "5px",
							alignContent: "center",
							textAlign: "center",
							color: "white",
						}}
					>
						{currentMap && currentMap.images && currentMap.images[0] ? (
							<MapCP
								dimensions={{
									x: mapwidth,
									y: mapheight,
								}}
								key={currentMapId + "_" + "Map"}
								game={game}
								map={currentMap}
								images={currentMap.images}
								gridData={currentMap.grid}
								ts={currentMap.tokens}
								updateTick={updateTick}
							></MapCP>
						) : (
							<></>
						)}
					</div>
				</div>
			) : (
				<div
					style={{
						width: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							justifyContent: "center",
							width: "100%",
							display: "flex",
							flexDirection: "row",
						}}
					>
						<Tooltip title="Spieler setzen">
							<IconButton
								onClick={() => {
									setEditPlayerPos(true);
								}}
							>
								<LocationOn
									sx={{ color: editPlayerPos ? "red" : undefined }}
								></LocationOn>
							</IconButton>
						</Tooltip>
						<Tooltip title="Ortname festlegen">
							<IconButton
								onClick={() => {
									setPopupData({ name: game.worldData.locationPlayer });
									setPopupId(17);
								}}
							>
								<More></More>
							</IconButton>
						</Tooltip>
					</div>
					<div
						style={{
							width: "100%",
							alignItems: "center",
							borderRadius: "5px",
							alignContent: "center",
							justifyContent: "center",
							display: "flex",
							textAlign: "center",
							position: "relative",
							color: "white",
						}}
					>
						<img
							alt=""
							onClick={async (e) => {
								if (!editPlayerPos) {
									return;
								}
								let currentTargetRect = e.currentTarget.getBoundingClientRect();
								const event_offsetX = e.clientX - currentTargetRect.left,
									event_offsetY = e.clientY - currentTargetRect.top;
								setEditPlayerPos(false);
								await saveGame({
									...game,
									worldData: {
										...game.worldData,
										playerPosition: {
											x:
												(event_offsetX / e.currentTarget.clientWidth) * 100 +
												"%",
											y:
												(event_offsetY / e.currentTarget.clientHeight) * 100 +
												"%",
										},
									},
								});
								updateTick();
							}}
							style={{
								maxWidth: "100%",
								maxHeight: "100%",
								borderRadius: "5px",
							}}
							src={"/api/file/getImage?type=map&id=" + currentMapId}
						></img>
						{playerPosition ? (
							<div
								style={{
									width: "10px",
									height: "10px",
									backgroundColor: "red",
									borderRadius: "5px",
									marginLeft: "-5px",
									marginTop: "-5px",
									left: playerPosition.x,
									top: playerPosition.y,
									position: "absolute",
								}}
							></div>
						) : (
							<></>
						)}
					</div>
				</div>
			)}
			{!currentMap || !currentMap.worldMap ? (
				<div
					style={{
						flexDirection: "column",
						display: "flex",
						margin: "5px",
						padding: "5px",
						border: "1px solid black",
						borderRadius: "5px",
					}}
					onContextMenu={
						setCustomContext
							? (e) => {
									e.preventDefault();
									setCustomContext({
										posX: e.pageX,
										posY: e.pageY,
										notes: true,
									});
									e.stopPropagation();
								}
							: undefined
					}
				>
					<Typography variant="h4" sx={{ textAlign: "center" }}>
						Notizen
					</Typography>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gridGap: "10px",
							gridTemplateRows: "auto",
						}}
					>
						{notes.map((item: any, index: number) => {
							if (!item) {
								return;
							}
							return (
								<div
									key={item.title + "_view" + index}
									style={{
										cursor: "pointer",
										border: "1px solid black",
										boxShadow: "2px 2px rgba(0,0,0,0.25)",
										display: "flex",
										flexDirection: "column",
										textAlign: "left",
										borderRadius: "10px",
									}}
									onContextMenu={
										setCustomContext
											? (e) => {
													e.preventDefault();
													setCustomContext({
														posX: e.pageX,
														posY: e.pageY,
														target: index,
														notes: true,
													});
													e.stopPropagation();
												}
											: undefined
									}
								>
									<div style={{ textAlign: "center", fontSize: "20pt" }}>
										<b>{item.title}</b>{" "}
									</div>
									<div>
										<b>
											Typ:{" "}
											{item.type == "note"
												? "Notiz"
												: item.type == "event"
													? "Event"
													: "Effekt"}
										</b>
									</div>
									<div>{item.description}</div>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<div
					style={{
						flexDirection: "column",
						display: "flex",
						margin: "5px",
						padding: "5px",
						border: "1px solid black",
						borderRadius: "5px",
					}}
				>
					<Typography variant="h4" sx={{ textAlign: "center" }}>
						Wetter
					</Typography>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
							gridGap: "10px",
							gridTemplateRows: "auto",
						}}
					>
						<div></div>
						<div
							style={{
								border: "1px solid black",
								borderRadius: "5px",
								aspectRatio: "1",
								width: "100%",
								cursor: "pointer",
								marginBottom: "10px",
								backgroundColor:
									game.worldData.weather == "sun" ? "DADAFA" : undefined,
							}}
							onClick={async () => {
								await saveGame({
									...game,
									worldData: { ...game.worldData, weather: "sun" },
								});
								updateTick();
							}}
						>
							<WbSunnyOutlined
								sx={{
									width: "100%",
									height: "100%",
									backgroundColor:
										game.worldData.weather == "sun" ? "DADAFA" : undefined,
								}}
							></WbSunnyOutlined>
						</div>
						<div
							style={{
								border: "1px solid black",
								borderRadius: "5px",
								aspectRatio: "1",
								width: "100%",
								cursor: "pointer",
								marginBottom: "10px",
								backgroundColor:
									game.worldData.weather == "cloudy" ? "DADAFA" : undefined,
							}}
							onClick={async () => {
								await saveGame({
									...game,
									worldData: { ...game.worldData, weather: "cloudy" },
								});
								updateTick();
							}}
						>
							<WbCloudyOutlined
								sx={{ width: "100%", height: "100%" }}
							></WbCloudyOutlined>
						</div>
						<div
							style={{
								border: "1px solid black",
								borderRadius: "5px",
								aspectRatio: "1",
								width: "100%",
								cursor: "pointer",
								marginBottom: "10px",
								backgroundColor:
									game.worldData.weather == "thunder" ? "DADAFA" : undefined,
							}}
							onClick={async () => {
								await saveGame({
									...game,
									worldData: { ...game.worldData, weather: "thunder" },
								});
								updateTick();
							}}
						>
							<ThunderstormOutlined
								sx={{ width: "100%", height: "100%" }}
							></ThunderstormOutlined>
						</div>
						<div
							style={{
								border: "1px solid black",
								borderRadius: "5px",
								aspectRatio: "1",
								width: "100%",
								cursor: "pointer",
								marginBottom: "10px",
								backgroundColor:
									game.worldData.weather == "snow" ? "DADAFA" : undefined,
							}}
							onClick={async () => {
								await saveGame({
									...game,
									worldData: { ...game.worldData, weather: "snow" },
								});
								updateTick();
							}}
						>
							<AcUnit sx={{ width: "100%", height: "100%" }}></AcUnit>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
