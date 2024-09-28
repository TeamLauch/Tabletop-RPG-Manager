import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission Player
 * @returns UPDATES a Item
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}
	const { id, gameId } = req.body;

	if (!id || !gameId) {
		return res.status(200).json({ error: true, message: "Invalid ID" });
	}

	const game: any = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
	});
	if (!game) {
		return res.status(200).json({ error: true, message: "Invalid ID" });
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

	if (
		!user ||
		!(await checkRoleUser("gamemaster", user)) ||
		(!game.gamemasters.includes(user.username) &&
			game.gamemaster != user.username)
	) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	let newPlayerData: any = [];
	let newGameData: any = [];
	for (const pl of game.npcData) {
		if (pl.id == id) {
			continue;
		}
		newPlayerData.push(pl);
	}

	for (const g of game.mapData) {
		let newG = { ...g };

		let index = newG["npcs"].indexOf(id, 0);
		if (index > -1) {
			newG["npcs"].splice(index, 1);
		}
		if (!newG.tokens) {
			newGameData.push(newG);
			continue;
		}
		for (let i = 0; i < newG.tokens.length; i++) {
			if (newG["tokens"][i].id == id) {
				newG["tokens"].splice(i, 1);
				break;
			}
		}
		newGameData.push(newG);
	}

	await prisma.game.update({
		where: {
			id: gameId,
		},
		data: {
			npcData: newPlayerData,
			mapData: newGameData,
		},
	});

	return res.status(200).json({ error: false, message: "sucess" });
}
