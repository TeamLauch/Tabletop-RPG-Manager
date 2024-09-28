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

	const { npc, gameId } = req.body;

	if (!npc || !gameId) {
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

	if (!user) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	let exists = false;
	let newPlayerData: any = [];
	for (const pl of game.npcData) {
		if (!pl) {
			continue;
		}
		if (pl.id == npc.id) {
			if (!pl.owner || pl.owner != user.username) {
				if (
					!(await checkRoleUser("gamemaster", user)) ||
					(!game.gamemasters.includes(user.username) &&
						game.gamemaster != user.username)
				) {
					return res.status(200).json({
						error: true,
						message: "Unauthorized no Permission",
					});
				}
			}
			exists = true;
			newPlayerData.push(npc);
			continue;
		}
		newPlayerData.push(pl);
	}
	if (!exists) {
		newPlayerData.push(npc);
	}

	await prisma.game.update({
		where: {
			id: gameId,
		},
		data: {
			npcData: newPlayerData,
		},
	});

	return res.status(200).json({ npc: npc, error: false, message: "sucess" });
}
