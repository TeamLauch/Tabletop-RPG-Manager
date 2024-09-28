import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";
import { use } from "react";

/**
 *
 * @permission GAMEMASTER
 * @returns Returns Weapons of the Game
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}

	const { gameId, characterId } = req.body;
	if (!gameId) {
		return res
			.status(200)
			.json({ error: true, message: "Invalid Data provided" });
	}

	const game: any = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
	});

	if (!game) {
		return res.status(200).json({ error: true, message: "Invalid Game" });
	}
	const cookie = getCookie(req, "DM_c");

	let user:
		| {
				pw: string;
				username: string;
				email: string;
				roles: string;
				canUpload: boolean;
				activated: boolean;
				createdAt: Date;
				updatedAt: Date;
				createdBy: string;
				updatedBy: string;
		  }
		| undefined = undefined;
	if (cookie) {
		user = await checkCookie(cookie);
	}

	if (!user) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	let mapData: any = undefined;
	for (let m of game.mapData) {
		if (m.active) {
			mapData = m;
			break;
		}
	}
	if (!mapData || !mapData.fight) {
		return res.status(200).json({ error: true, message: "No Fight loaded" });
	}

	let fight = {
		...mapData.fight,
		damageDone: [],
		nextPerson: "",
		currentPerson: "",
		ownInit: 0,
	};

	let fighterIDs = [];
	for (let f of fight.fighter) {
		fighterIDs.push(f.id);
	}

	let sortedFighter = fight.fighter.sort((a, b) => {
		if (a.id == characterId) {
			fight.ownInit = a.init;
		}
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

	fight.nextPerson =
		sortedFighter[
			fight.turn + 1 >= sortedFighter.length ? 0 : fight.turn + 1
		].name;
	fight.currentPerson = sortedFighter[fight.turn].name;

	for (let n of game.npcData) {
		if (!fighterIDs.includes(n.id)) {
			continue;
		}
		if (!n) {
			return;
		}
		let cha = await prisma.npc.findUnique({
			where: {
				id: n.parent,
			},
		});
		if (!cha) {
			return;
		}
		fight.damageDone.push({
			name: n.name,
			id: n.id,
			damage:
				parseInt(n.override ? n.override.hp ?? cha.hp : cha.hp) -
				parseInt(n.hp),
		});
	}

	return res
		.status(200)
		.json({ fight: fight, error: false, message: "sucess" });
}
