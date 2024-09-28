import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import * as ts from "typescript";
import { ATTRIBUTES, SUBATTRIBUTES } from "./constants";
import { workerData } from "worker_threads";

/**
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @returns All NPCs
 * @permission GAMEMASTER
 */
export function useNPCs(ticks: number = 0) {
	const [npcs, setNpcs] = useState<any[]>();
	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get("/api/npc/getNPCs");
			if (!response || response.data.error) {
				return;
			}
			setNpcs(response.data.npcs);
		};
		fetchData();
	}, [ticks]);
	return npcs;
}

/**
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @param id Id of the NPC ask for
 * @permission GAMEMASTER
 * @returns The NPC with the GIVEN id, undefined if ID is not found in Database
 */
export function useNPC(ticks: number = 0, id: string) {
	const [npc, setNpc] = useState<any>();
	useEffect(() => {
		if (!id) {
			return;
		}
		const fetchData = async () => {
			const response = await axios.post("/api/npc/getNPC", { id: id });
			if (!response || response.data.error) {
				return;
			}
			setNpc(response.data.npc);
		};
		fetchData();
	}, [ticks, id]);
	return npc;
}

/**
 * @param updateSeconds if > 0 => Updates Tick automaticly after updateSeconds Seconds
 * @returns a Tick and Update Function
 */
export function useTick(
	updateSeconds: number = 0,
	isDisabled: boolean = false
) {
	const [tick, setTick] = useState(0);
	const Ref = useRef(null);

	const updateTick = () => {
		setTick((prev) => prev + 1);
	};

	useEffect(() => {
		if (updateSeconds > 0 && !isDisabled) {
			const interval = setInterval(() => {
				updateTick();
			}, 1000 * updateSeconds);
			return () => clearInterval(interval);
		}
	}, [updateSeconds, isDisabled]); // updateSeconds und isDisabled als Abhängigkeiten

	return { tick, updateTick };
}

/**
 *
 * @param tick Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission USER | GAMEMASTER(ALL INFOS)
 * @returns All items of the Database
 */
export function useItems(tick: number = 0) {
	const [items, setItems] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get("/api/item/getItems");
			if (response.data.error) {
				return;
			}
			setItems(response.data.items);
		};

		fetchData();
	}, [tick]);

	return items;
}

/**
 *
 * @param id Id of the Item
 * @param tick Refreshes Data and makes new API call each Time Ticks is changed.
 * @returns The Item with the Given ID or undefined
 */
export function useItem(id: string, tick: number = 0) {
	const [item, setItem] = useState<any>(undefined);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/item/getItem", { id: id });
			if (response.data.error) {
				return;
			}
			setItem(response.data.item);
		};

		fetchData();
	}, [tick]);

	return item;
}

/**
 *
 * @param name Name of the Class
 * @permission USER
 * @returns The Class with the given Name or Undefined
 */
export const useKlasse = (name: string, tick: number = 0) => {
	const [data, setData] = useState<any>();

	useEffect(() => {
		if (!name) {
			return;
		}
		const fetchData = async () => {
			const response = await axios.get(
				"/api/file/getCode?type=class&name=" + name
			);
			if (response.data) {
				let r = [];
				for (let c of response.data) {
					const compiled = ts.transpile(c);
					r.push(eval(compiled));
				}
				setData(r);
			}
		};
		fetchData();
	}, [name, tick]);

	return data;
};

export const useBackground = (name: string, tick: number = 0) => {
	const [data, setData] = useState<any>();
	useEffect(() => {
		if (!name) {
			return;
		}
		const fetchData = async () => {
			try {
				const response = await axios.get(
					"/api/file/getCode?type=background&name=" + name
				);
				if (response.data && !response.data.error) {
					let r = [];
					for (let c of response.data) {
						const compiled = ts.transpile(c);
						r.push(eval(compiled));
					}
					setData(r);
				}
			} catch (e: any) {}
		};
		fetchData();
	}, [tick, name]);
	return data;
};

/**
 *
 * @param name Name of the Class
 * @permission USER
 * @returns The Class with the given Name or Undefined
 */
export const useVolk = (name: string, tick: number = 0) => {
	const [data, setData] = useState<any>();

	useEffect(() => {
		if (!name) {
			return;
		}
		const fetchData = async () => {
			try {
				const response = await axios.get(
					"/api/file/getCode?type=race&name=" + name
				);
				if (response.data && !response.data.error) {
					let r = [];
					for (let c of response.data) {
						const compiled = ts.transpile(c);
						r.push(eval(compiled));
					}
					setData(r);
				}
			} catch (e: any) {}
		};
		fetchData();
	}, [name, tick]);

	return data;
};

export const useClasses = (classes: string[], ticks: number = 0) => {
	const [data, setData] = useState<any>();

	useEffect(() => {
		if (!classes) {
			return;
		}
		const fetchData = async () => {
			let r = [];
			for (let c of classes) {
				const response = await axios.get(
					"/api/file/getCode?type=class&name=" + c
				);
				if (response.data && !response.data.error) {
					for (let c of response.data) {
						const compiled = ts.transpile(c);
						r.push(eval(compiled));
					}
				}
			}
			setData(r);
		};
		fetchData();
	}, [classes, ticks]);

	return data;
};

/**
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @returns All important Database Tables like Spells, Languages, Abilities, damageTypes, etc
 */
export const useOpenConstants = (ticks: number = 0) => {
	const [languages, setLanguages] = useState<any[]>([]);
	const [abilities, setAbilities] = useState<any[]>([]);
	const [spells, setSpells] = useState<any[]>([]);
	const [damageTypes, setDamageTypes] = useState<any[]>([]);
	const [serverError, setServerError] = useState("");
	const [items, setItems] = useState<any[]>([]);
	const [additionalData, setAdditionalData] = useState<any[]>([]);
	const [attributes, setAttributes] = useState(ATTRIBUTES);
	const [subattributes, setSubAttributes] = useState(SUBATTRIBUTES);
	const [ready, setReady] = useState(false);
	useEffect(() => {
		const fetch = async () => {
			let response = await axios.get("/api/damagetypes/getDamageTypes");
			if (response.data.error) {
				setServerError(response.data.message);
				return;
			}
			setDamageTypes(response.data.damageTypes);

			response = await axios.get("/api/item/getItems");
			if (response.data.error) {
				setServerError(response.data.message);
				return;
			}
			setItems(response.data.items);
			response = await axios.get("/api/abilities/getAbilities");
			if (response.data.error) {
				setServerError(response.data.message);
				return;
			}
			setAbilities(response.data.abilities);
			response = await axios.get("/api/languages/getLanguages");
			if (response.data.error) {
				setServerError(response.data.message);
				return;
			}
			setLanguages(response.data.languages);
			response = await axios.get("/api/spells/getSpells");
			if (response.data.error) {
				setServerError(response.data.message);
				return;
			}
			setSpells(response.data.data);

			response = await axios.get("/api/additionalData/getData");
			if (response.data.error) {
				setServerError(response.data.message);
				return;
			}
			setAdditionalData(response.data.additionalData);
			setReady(true);
		};
		fetch();
	}, [ticks]);

	return {
		languages,
		abilities,
		damageTypes,
		spells,
		attributes,
		subattributes,
		serverError,
		items,
		additionalData,
		ready,
	};
};

export const useUser = (tick: number = 1) => {
	const [user, setUser] = useState<any>();
	useEffect(() => {
		const fetchData = async () => {
			const data = await axios.get("/api/user/getUser");
			if (data.data.user) {
				setUser(data.data.user);
			}
		};
		fetchData();
	}, [tick]);
	return user;
};

/**
 *
 * @param permissions Permission needed for a Succes
 * @returns if Cookie is valid and User has the needed Permission loggedIn is true and user the user. Ready indicates that the Call is done
 */
export const useLoginData = (
	permissions: "user" | "admin" | "gamemaster" | "editor"
) => {
	const router = useRouter();
	const [loggedIn, setLoggin] = useState(false);
	const [ready, setReady] = useState(false);
	const [user, setUser] = useState({});

	useEffect(() => {
		if (document.cookie === "") {
			setReady(true);
			setLoggin(false);
			return;
		}
		document.cookie.split(";").forEach(async (cookie) => {
			const [key, value] = cookie.split("=");
			if (key.trim() === "DM_c") {
				try {
					const response = await axios.post("/api/user/checkCookie", {
						cookie: value,
						role: permissions,
					});
					if (response.data.error) {
						setLoggin(false);
						setReady(true);
						return;
					}
					setLoggin(true);
					setReady(true);
					setUser(response.data);
				} catch (err) {}
			}
			if (document.cookie.endsWith(value)) {
				setReady(true);
			}
		});
	}, [router, permissions]);

	return { loggedIn, ready, user };
};

/**
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission USER
 * @returns All Spells
 */
export function useSpells(ticks: number = 0) {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get("/api/spells/getSpells");
			if (response && response.data) {
				setData(response.data.data);
			}

			console.log(response.data.data);
		};

		fetchData();
	}, [ticks]);

	return data;
}

/**
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @returns All Damage Types
 * @permission USER
 */
export function useDamageTypes(ticks: number = 0) {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get("/api/damagetypes/getDamageTypes");
			if (response && response.data) {
				setData(response.data.damageTypes);
			}
		};

		fetchData();
	}, [ticks]);

	return data;
}

/**
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @returns All Abilities
 * @permission USER
 */
export function useAbilites(ticks: number = 0) {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get("/api/abilities/getAbilities");
			if (response && response.data) {
				setData(response.data.abilities);
			}
		};

		fetchData();
	}, [ticks]);

	return data;
}

/**
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @returns ALL GAMES
 * @permission USER
 */
export function useGames(ticks: number = 0) {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/game/getGames");
			if (response && response.data) {
				setData(response.data.games);
			}
		};

		fetchData();
	}, [ticks]);

	return data;
}

export function usePlayerNPCs(gameId: string, ticks: number = 0) {
	const [npcs, setNPCs] = useState([]);

	useEffect(() => {
		if (!gameId) {
			return;
		}
		const fetchData = async () => {
			const response = await axios.post("/api/game/getPlayerNPCs", { gameId });
			if (response.data.error) {
				return;
			}
			setNPCs(response.data.npcs);
		};
		fetchData();
	}, [gameId, ticks]);

	return npcs;
}

/**
 *
 * @param characterId ID of the Character
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @returns Character or undefined
 * @permission USER (ONLY OWN ONE) | GAMEMASTER
 */
export function useCharacter(characterId: string, ticks: number = 0) {
	const [data, setData] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/character/getCharacter", {
				id: characterId,
			});
			if (response && response.data) {
				setData(response.data.character);
			}
		};

		fetchData();
	}, [characterId, ticks]);

	return data;
}

/**
 *
 * @param gameId ID of the Game
 * @param tick Refreshes Data and makes new API call each Time Ticks is changed.
 * @param playerId ID of the Player if undefined check for own Player
 * @permission USER (ONLY OWN PLAYERS) | GAMEMASTER (ONLY IN GAMES HE OWNS)
 * @returns Playerdata or undefined
 */
export function usePlayer(gameId: string, tick: number = 0, playerId?: string) {
	const [data, setData] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/game/getPlayer", {
				gameId: gameId,
				playerId: playerId,
			});
			if (response && response.data.player) {
				setData(response.data.player);
			}
		};

		fetchData();
	}, [gameId, playerId, tick]);

	return data;
}

/**
 *
 * @param gameId GameID
 * @param playerId ID of the NPC
 * @param tick Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission GAMEMASTER (ONLY OWN GAMES)
 * @returns NPC player data or Undefined
 */
export function useNPCPlayer(
	gameId: string,
	playerId: string,
	tick: number = 0
) {
	const [data, setData] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/game/getNPC", {
				gameId: gameId,
				playerId: playerId,
			});
			if (response && response.data.npc) {
				setData(response.data.npc);
			}
		};

		fetchData();
	}, [gameId, playerId, tick]);

	return data;
}

/**
 *
 * @param tick Refreshes Data and makes new API call each Time Ticks is changed.
 * @param all if true ask for all Characters otherwise only own are returned
 * @permission USER (ONLY OWN) | GAMEMASTER
 * @returns Array of Characters
 */
export function useCharacters(tick: number = 0, all?: boolean) {
	const [data, setData] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/character/getCharacters", {
				own: !all,
			});
			if (response && response.data) {
				setData(response.data.characters);
			}
		};

		fetchData();
	}, [tick, all]);

	return data;
}

/**
 *
 * @permission ADMIN
 * @param tick Refreshes Data and makes new API call each Time Ticks is changed.
 * @returns Returns all Usernames
 */
export function useUsernames(tick: number = 0) {
	const [data, setData] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const res = await fetch("/api/user/getUsername");
			const data = await res.json();
			setData(data);
		}
		fetchData();
	}, [tick]);
	return data;
}

/**
 *
 * @param id Id of the Game
 * @param tick Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission USER
 * @returns Returns the Map Data
 */
export function useActiveMap(id: string, tick: number = 0) {
	const [data, setData] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/game/getMap", { gameId: id });
			if (response && response.data) {
				setData(response.data.mapData);
			}
		};

		fetchData();
	}, [id, tick]);

	return data;
}

/**
 *
 * @param id ID of the Game
 * @param tick Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission GAMEMASTER (ONLY OWN GAME)
 * @returns Returns the Game with the ID or undefined
 */
export function useGame(id: string, tick: number = 0) {
	const [data, setData] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/game/getGame", { gameId: id });
			if (response && response.data) {
				setData(response.data.game);
			}
		};

		fetchData();
	}, [id, tick]);

	return data;
}

/**
 *
 * @param tick Refreshes Data and makes new API call each Time Ticks is changed.
 * @param gameId Id of the Game
 * @param type Free => only Items not used yet, "all" => all Items
 * @permission USER ("free") | GAMEMASTER ("all")
 * @returns Array of Items
 */
export function useGameItems(tick: number = 0, gameId: any, type = "free") {
	const [items, setItem] = useState<any>();

	useEffect(() => {
		if (gameId == "-1") {
			setItem([]);
			return;
		}
		const fetchData = async () => {
			const response = await axios.post("/api/game/getItems", {
				type: type,
				gameId: gameId,
			});
			if (response && response.data) {
				setItem(response.data.items);
			}
		};

		fetchData();
	}, [tick, gameId, type]);

	return items;
}
/**
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission USER
 * @returns All News
 */
export function useNews(ticks: number = 0) {
	const [news, setNews] = useState<any[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get("/api/news/getNews");
			if (!response || response.data.error) {
				setNews([]);
				return;
			}
			setNews(
				response.data.news.sort((a: any, b: any) => {
					if (a.createdAt < b.createdAt) {
						return 1;
					}
					if (a.createdAt > b.createdAt) {
						return -1;
					}
					return 0;
				})
			);
		};
		fetchData();
	}, [ticks]);
	return news;
}

/**
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission USER
 * @returns All users
 */
export function useUsers(ticks: number = 0) {
	const [users, setUsers] = useState([]);
	useEffect(() => {
		const fe = async () => {
			const res = await axios.get("/api/user/getUsers");
			if (res.status != 200) {
				return;
			}
			if (res.data.error) {
				return;
			}
			setUsers(
				res.data.users.sort((a: any, b: any) => {
					return a.username < b.username ? -1 : a.username > b.username ? 1 : 0;
				})
			);
		};
		fe();
	}, [ticks]);
	return users;
}

export function useAdmin() {
	const router = useRouter();
	const [loggedIn, setLoggin] = useState(false);
	const [ready, setReady] = useState(false);
	const [user, setUser] = useState({});
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		if (document.cookie === "") {
			setReady(true);
			setLoggin(false);
			return;
		}
		document.cookie.split(";").forEach(async (cookie) => {
			const [key, value] = cookie.split("=");
			if (key.trim() === "DM_c") {
				try {
					const response = await axios.post("/api/user/checkCookie", {
						cookie: value,
						role: "admin",
					});
					if (response.data.error) {
						setLoggin(false);
						setReady(true);
						setIsAdmin(false);
						return;
					}
					setLoggin(true);
					setReady(true);
					setIsAdmin(true);
					setUser(response.data);
				} catch (err) {}
			}
			if (document.cookie.endsWith(value)) {
				setReady(true);
			}
		});
	}, [router]);

	return { ready, isAdmin };
}

/**
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission USER
 * @returns All Classes
 */
export const useAllClasses = (ticks: number = 0) => {
	const [classes, setClasses] = useState([]);
	useEffect(() => {
		const fetch = async () => {
			const response = await axios.get("/api/klassen/getKlassen");
			if (response.data.error) {
				return;
			}
			setClasses(response.data.klassen);
		};
		fetch();
	}, [ticks]);

	return classes;
};

export const useGameWorld = (gameId: string, tick: number = 0) => {
	const [world, setWorld] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/game/getWorld", {
				gameId: gameId,
			});
			if (response.data.error) {
				return;
			}
			setWorld(response.data.world);
		};
		fetchData();
	}, [tick, gameId]);

	return {
		world: { ...world, workerData: undefined },
		worldData: world ? world.worldData : undefined,
	};
};

export const useQuests = (id: string, tick: number = 0) => {
	const [quests, setQuests] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/game/getQuests", {
				gameId: id,
			});
			if (response.data.error) {
				return;
			}
			setQuests(response.data.quests);
		};
		fetchData();
	}, [tick, id]);

	return quests;
};

export const useTimeline = (id: string, tick: number = 0) => {
	const [events, setEvents] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/game/getTimeline", {
				gameId: id,
			});
			if (response.data.error) {
				return;
			}
			setEvents(response.data.events);
		};
		fetchData();
	}, [tick, id]);

	return events;
};

export const useWorld = (id: string, tick: number = 0) => {
	const [world, setWorld] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/world/getWorld", { id: id });
			if (response.data.error) {
				return;
			}
			setWorld(response.data.world);
		};
		fetchData();
	}, [tick, id]);

	return world;
};

export const useFight = (
	gameId: string,
	characterId: string,
	tick: number = 0
) => {
	const [fight, setFight] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.post("/api/game/getFight", {
				gameId: gameId,
				characterId: characterId,
			});
			if (response.data.error) {
				return;
			}
			setFight(response.data.fight);
		};
		fetchData();
	}, [gameId, tick]);
	return fight;
};

export const useWorlds = (tick: number = 0) => {
	const [worlds, setWorlds] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get("/api/world/getWorlds");
			if (response.data.error) {
				return;
			}
			setWorlds(response.data.worlds);
		};
		fetchData();
	}, [tick]);

	return worlds;
};

/**
 *
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission USER
 * @returns All Races
 */
export const useBackgrounds = (ticks: number = 0) => {
	const [background, setRaces] = useState([]);
	useEffect(() => {
		const fetch = async () => {
			const response = await axios.get("/api/background/getBackgrounds");
			if (response.data.error) {
				return;
			}
			setRaces(
				response.data.backgrounds.sort((a: any, b: any) => {
					if (a.name.toLowerCase() < b.name.toLowerCase()) {
						return -1;
					}
					if (a.name.toLowerCase() > b.name.toLowerCase()) {
						return 1;
					}
					return 0;
				})
			);
		};
		fetch();
	}, [ticks]);

	return background;
};

/**
 *
 *
 * @param ticks Refreshes Data and makes new API call each Time Ticks is changed.
 * @permission USER
 * @returns All Races
 */
export const useVolker = (ticks: number = 0) => {
	const [races, setRaces] = useState([]);
	useEffect(() => {
		const fetch = async () => {
			const response = await axios.get("/api/volker/getVolker");
			if (response.data.error) {
				return;
			}
			setRaces(
				response.data.volker.sort((a: any, b: any) => {
					if (a.name.toLowerCase() < b.name.toLowerCase()) {
						return -1;
					}
					if (a.name.toLowerCase() > b.name.toLowerCase()) {
						return 1;
					}
					return 0;
				})
			);
		};
		fetch();
	}, [ticks]);

	return races;
};

export function useEditor() {
	const router = useRouter();
	const [loggedIn, setLoggin] = useState(false);
	const [_ready, setReady] = useState(false);
	const [user, setUser] = useState({});
	const [isEditor, setIsEditor] = useState(false);

	useEffect(() => {
		if (document.cookie === "") {
			setReady(true);
			setLoggin(false);
			return;
		}
		document.cookie.split(";").forEach(async (cookie) => {
			const [key, value] = cookie.split("=");
			if (key.trim() === "DM_c") {
				try {
					const response = await axios.post("/api/user/checkCookie", {
						cookie: value,
						role: "editor",
					});
					if (response.data.error) {
						setLoggin(false);
						setReady(true);
						setIsEditor(false);
						return;
					}
					setLoggin(true);
					setReady(true);
					setIsEditor(true);
					setUser(response.data);
				} catch (err) {}
			}
			if (document.cookie.endsWith(value)) {
				setReady(true);
			}
		});
	}, [router]);

	return { _ready, isEditor };
}
