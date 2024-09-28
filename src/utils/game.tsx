import axios from "axios";
import { use, useEffect, useState } from "react";
import { generateUUID } from "three/src/math/MathUtils";

/**
 *
 * Joins with the Character to the Game
 *
 * @param gameId Game ID
 * @param character Character Data
 * @permission USER
 */
export async function registerCharacterAsPlayer(
	gameId: string,
	character: any
) {
	let data = {
		diceAmount:
			character.data.dice && character.data.dice.amount
				? character.data.dice.amount
				: "0",
		name: character.characterName,
		id: character.id,
		rk: character.rk,
		owner: character.ownerId,
		hp: character.hp,
		spells: [],
		items: [],
		initiative: character.data.initiative ?? "0",
		weapons: character.data.weapons ?? [],
		spellSlots: {
			"1":
				character.data.magic && character.data.magic.slot
					? Number.parseInt(character.data.magic.slot["1"] ?? 0)
					: 0,
			"2":
				character.data.magic && character.data.magic.slot
					? Number.parseInt(character.data.magic.slot["2"] ?? 0)
					: 0,
			"3":
				character.data.magic && character.data.magic.slot
					? Number.parseInt(character.data.magic.slot["3"] ?? 0)
					: 0,
			"4":
				character.data.magic && character.data.magic.slot
					? Number.parseInt(character.data.magic.slot["4"] ?? 0)
					: 0,
			"5":
				character.data.magic && character.data.magic.slot
					? Number.parseInt(character.data.magic.slot["5"] ?? 0)
					: 0,
			"6":
				character.data.magic && character.data.magic.slot
					? Number.parseInt(character.data.magic.slot["6"] ?? 0)
					: 0,
			"7":
				character.data.magic && character.data.magic.slot
					? Number.parseInt(character.data.magic.slot["7"] ?? 0)
					: 0,
			"8":
				character.data.magic && character.data.magic.slot
					? Number.parseInt(character.data.magic.slot["8"] ?? 0)
					: 0,
			"9":
				character.data.magic && character.data.magic.slot
					? Number.parseInt(character.data.magic.slot["9"] ?? 0)
					: 0,
		},
	};

	await axios.post("/api/game/registerPlayerToGame", {
		data: data,
		gameId: gameId,
	});
}

export async function setVisibilityOfToken(
	mapId: string,
	game: any,
	id: string,
	visible: boolean
) {
	let newData = { ...game };
	let mapData = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			if (!mapData[i]["tokens"]) {
				break;
			}
			for (let j = 0; j < mapData[i]["tokens"].length; j++) {
				if (mapData[i]["tokens"][j].id == id) {
					mapData[i]["tokens"][j]["visible"] = visible;
					break;
				}
			}
			break;
		}
	}
	newData["mapData"] = mapData;
	await saveGame(newData);
}

export async function deleteTokenFromMap(mapId: string, game: any, id: string) {
	let newData = { ...game };
	let mapData = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			if (!mapData[i]["tokens"]) {
				break;
			}
			let newTokens = [];
			for (let j = 0; j < mapData[i]["tokens"].length; j++) {
				if (mapData[i]["tokens"][j].id != id) {
					newTokens.push(mapData[i]["tokens"][j]);
				}
			}
			mapData[i]["tokens"] = newTokens;
			break;
		}
	}
	newData["mapData"] = mapData;
	await saveGame(newData);
}

export async function registerTokenToMap(
	mapId: string,
	game: any,
	id: string,
	type: "npc" | "player",
	name: string
) {
	let newData = { ...game };
	let mapData = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			if (!mapData[i]["tokens"]) {
				mapData[i]["tokens"] = [
					{
						type: type,
						id: id,
						position: { x: 0, y: 0 },
						size: 1,
						visible: type != "npc",
						viewType: "circle",
						viewDistance: 10,
						color: "#00FF00",
						coneAngle: 10,
						coneView: 10,
						name: name,
					},
				];
				break;
			}
			for (let t of mapData[i]["tokens"]) {
				if (t.id == id) {
					return;
				}
			}
			mapData[i]["tokens"] = [
				...mapData[i]["tokens"],
				{
					type: type,
					id: id,
					position: { x: 0, y: 0 },
					size: 1,
					visible: type != "npc",
					viewType: "circle",
					viewDistance: 10,
					color: "#00FF00",
					coneAngle: 10,
					coneView: 10,
					name: name,
				},
			];
			break;
		}
	}
	newData["mapData"] = mapData;
	await saveGame(newData);
}

export async function setColorOfToken(
	mapId: string,
	game: any,
	id: string,
	color: string
) {
	let newData = { ...game };
	let mapData = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			if (!mapData[i]["tokens"]) {
				break;
			}
			for (let j = 0; j < mapData[i]["tokens"].length; j++) {
				if (mapData[i]["tokens"][j].id == id) {
					mapData[i]["tokens"][j] = {
						...mapData[i]["tokens"][j],
						color: color,
					};
					break;
				}
			}
			break;
		}
	}
	newData["mapData"] = mapData;
	await saveGame(newData);
}

/**
 * Updates a Map
 *
 * @param mapId ID of the Map
 * @param game Game Data
 * @param grid Grid Data
 * @param camera Data of the Camera
 * @param tokens Data of the Tokens
 * @returns
 */
export async function updateMap(
	mapId: string,
	game: any,
	grid: any,
	camera: any,
	tokens: any[]
) {
	let newData = { ...game };
	let mapData = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			mapData[i]["camera"] = camera;
			mapData[i]["grid"] = grid;
			mapData[i]["tokens"] = tokens;
			break;
		}
	}
	newData["mapData"] = mapData;
	await saveGame(newData);
}

/**
 * Activates a Given map
 *
 * @param mapId MapId
 * @param game Game data
 * @returns
 */
export async function setActiveMap(mapId: string, game: any) {
	let newData = { ...game };
	let mapData = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			mapData[i]["active"] = true;
		} else {
			mapData[i]["active"] = false;
		}
	}
	newData["mapData"] = mapData;
	await saveGame(newData);
}
/**
 * Saves Playerdata
 *
 * @permission USER(ONLY OWN PLAYER) | GAMEMASTER (ONLY OWN GAME)
 * @param gameId GameID
 * @param player Player Data
 */
export async function savePlayer(gameId: string, player: any) {
	await axios.post("/api/game/setPlayer", { player: player, gameId });
}

export async function saveFight(game: any, mapId: string, figth: any) {
	let newData = { ...game };
	let mapData: any[] = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			mapData[i].fight = figth;
		}
	}
	newData["mapData"] = mapData;
	await saveGame(game);
}

/**
 * Saves NPCdata
 *
 * @permission GAMEMASTER (ONLY OWN GAME)
 * @param gameId GameID
 * @param player NPC Data
 */
export async function saveNPC(gameId: string, player: any) {
	await axios.post("/api/game/setNPC", { npc: player, gameId });
}

/**
 * Deletes NPC
 *
 * @permission GAMEMASTER (ONLY OWN GAME)
 * @param gameId GameID
 * @param id NPC ID
 */
export async function deleteNPC(gameId: string, id: any) {
	await axios.post("/api/game/deleteNPC", { id: id, gameId });
}

/**
 * Creates a new Game
 *
 * @permission GAMEMASTER (ONLY OWN GAME)
 * @param data Game Data
 */
export async function createGame(data: any) {
	await axios.post("/api/game/setGame", { data: data });
}
/**
 * Deletes Game
 *
 * @permission GAMEMASTER (ONLY OWN GAME)
 * @param gameId Game ID
 */
export async function deleteGame(gameId: any) {
	await axios.post("/api/game/deleteGame", { gameId });
}

/**
 * Saves Game Data
 *
 * @permission GAMEMASTER (ONLY OWN GAME)
 * @param data Game Data
 */
export async function saveGame(data: any) {
	await axios.post("/api/game/setGame", { data: data });
}

export async function addEvent(
	game: any,
	event: {
		name: string;
		etype: string;
		description?: string;
		date?: number;
		time?: number;
	}
) {
	await saveGame(addEventToGame(game, event));
}

export function addEventToGame(
	game: any,
	event: {
		name: string;
		etype: string;
		description?: string;
		date?: number;
		time?: number;
	}
) {
	console.log(event);
	console.log(game);
	if (!game.worldData) {
		game = {
			...game,
			roleplayData: [
				...game.roleplayData,
				{
					...event,
					type: "event",
					date: event.date ?? 0,
					time: event.time ?? 0,
				},
			],
		};
		return game;
	}
	game = {
		...game,
		roleplayData: [
			...game.roleplayData,
			{
				...event,
				id: generateUUID(),
				gmInfo: "",
				type: "event",
				date: event.date ?? game.worldData.currentDate,
				time: event.time ?? game.worldData.currentTime ?? 0,
			},
		],
	};
	return game;
}

/**
 *
 * Deletes a Node
 *
 * @param game Game Data
 * @param mapId Id of the Map
 * @param notePosition Position of the Note inside the Array
 * @returns
 */
export async function deleteNoteFromMap(
	game: any,
	mapId: string,
	notePosition: number
) {
	let newData = { ...game };
	let mapData: any[] = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			mapData[i]["notes"] = mapData[i]["notes"].filter(
				(item, index) => item && index != notePosition
			);
		}
	}
	newData["mapData"] = mapData;
	await saveGame(newData);
}

/**
 * Edits data of the Note inside the Game
 *
 * @param game Game Data
 * @param mapId Id of the Map
 * @param note Note Data
 * @param notePosition Position of the Note inside the Array
 */
export async function editNoteFromMap(
	game: any,
	mapId: string,
	note: any,
	notePosition: number
) {
	let newData = { ...game };
	let mapData = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			mapData[i]["notes"][notePosition] = note;
		}
	}
	newData["mapData"] = mapData;
	await saveGame(newData);
}

/**
 * Places a Player onto a Map
 *
 * @param game Data of the Game
 * @param mapId Id Of the Map
 * @param playerID Id of the Player
 *
 */
export async function movePlayerToMap(
	game: any,
	mapId: string,
	playerID: string
) {
	let newData = { ...game };
	let mapData: any[] = newData.mapData;
	if (!mapData) {
		return;
	}

	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			mapData[i]["players"].push(playerID);
		} else {
			if (mapData[i]["players"]) {
				let index = mapData[i]["players"].indexOf(playerID, 0);
				if (index > -1) {
					mapData[i]["players"].splice(index, 1);
				}
			}
		}
	}

	newData["mapData"] = mapData;
	await saveGame(newData);
}

/**
 * Places a NPC onto a Map
 *
 * @param game Data of the Game
 * @param mapId Id Of the Map
 * @param npcID Id of the Npc
 *
 */
export async function moveNPCToMap(game: any, mapId: string, npcID: string) {
	let newData = { ...game };
	let mapData: any[] = newData.mapData;
	if (!mapData) {
		return;
	}

	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			mapData[i]["npcs"].push(npcID);
		} else {
			if (mapData[i]["npcs"]) {
				let index = mapData[i]["npcs"].indexOf(npcID, 0);
				if (index > -1) {
					mapData[i]["npcs"].splice(index, 1);
				}
			}
		}
	}

	newData["mapData"] = mapData;
	await saveGame(newData);
}

/**
 * Adds a new Note to the Map
 *
 * @param game Game Data
 * @param mapId Id of the Map
 * @param note Data of the Note
 * @returns
 */
export async function addNoteToMap(game: any, mapId: string, note: any) {
	let newData = { ...game };
	let mapData: any[] = newData.mapData;
	if (!mapData) {
		return;
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			mapData[i]["notes"].push(note);
		}
	}
	newData["mapData"] = mapData;
	await saveGame(newData);
}

/**
 *
 * @param url URL of the Image
 * @param imageIndex Index to Add Image
 * @param game Game Data
 * @param mapId Id
 */
export async function addImageToMap(
	url: string,
	imageIndex: number,
	game: any,
	mapId: any
) {
	let gameWithMap = { ...game };
	let mapData: any[] = gameWithMap.mapData;
	if (mapData[0].id != "-1") {
		mapData = [
			{
				id: "-1",
				name: "Global",
				images: [],
				players: [],
				npcs: [],
				notes: [],
				tokens: [],
				camera: {
					position: {
						x: 0,
						y: 0,
					},
					scale: 1,
				},
				grid: {
					color: "#000000",
					scale: 50,
					type: "square",
				},
			},
			...mapData,
		];
	}
	for (let i = 0; i < mapData.length; i++) {
		if (mapData[i].id == mapId) {
			mapData[i]["images"].splice(imageIndex, 0, url);
			break;
		}
	}
	gameWithMap["mapData"] = mapData;
	await saveGame(gameWithMap);
}

/**
 *
 * @param game Game Data
 * @param name Name of the Map
 * @param backgroundImage BackgroundImage Path
 */
export async function createMap(game: any, name: any) {
	let gameWithMap = { ...game };
	let mapData: any[] = gameWithMap.mapData;
	if (!mapData || mapData.length == 0) {
		mapData = [
			{
				id: "-1",
				name: "Global",
				images: [],
				players: [],
				npcs: [],
				notes: [],
				tokens: [],
				camera: {
					position: {
						x: 0,
						y: 0,
					},
					scale: 1,
				},
				grid: {
					color: "#000000",
					scale: 50,
					type: "square",
				},
			},
		];
	}
	if (mapData[0].id != "-1") {
		mapData = [
			{
				id: "-1",
				name: "Global",
				images: [],
				players: [],
				npcs: [],
				notes: [],
				tokens: [],
				camera: {
					position: {
						x: 0,
						y: 0,
					},
					scale: 1,
				},
				grid: {
					color: "#000000",
					scale: 50,
					type: "square",
				},
			},
			...mapData,
		];
	}
	mapData = [
		...mapData,
		{
			id: generateUUID(),
			name: name,
			images: [],
			players: [],
			npcs: [],
			notes: [],
			tokens: [],
			camera: {
				position: {
					x: 0,
					y: 0,
				},
				scale: 1,
			},
			grid: {
				color: "#000000",
				scale: 50,
				type: "square",
			},
		},
	];
	gameWithMap["mapData"] = mapData;
	await saveGame(gameWithMap);
}

/**
 * Saves Item
 *
 * @permission GAMEMASTER (ONLY OWN GAME)
 * @param gameId GameID
 * @param data Item Data
 */
export async function saveItem(gameId: string, data: any) {
	await axios.post("/api/game/setItem", { gameId: gameId, item: data });
}

/**
 *
 * @param game Data of the new Game
 */
export async function addGame(game: any) {
	const res = await axios.post("/api/game/setGame", { data: game });
	window.location.href = "/game/master/" + res.data.game.id;
}
