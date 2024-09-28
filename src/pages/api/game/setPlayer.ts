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
	const { player, gameId } = req.body;
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

	if (!user || !(await checkRoleUser("user", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	if (!player || !gameId) {
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

	let exists = false;
	let newPlayerData: any = [];
	for (const pl of game.playerData) {
		if (!pl) {
			continue;
		}
		if (pl.id == player.id) {
			exists = true;
			if (
				pl.owner != user.username &&
				!(await checkRoleUser("gamemaster", user)) &&
				!(
					game.gamemaster == user.username ||
					game.gamemasters.includes(user.username)
				)
			) {
				return res
					.status(200)
					.json({ error: true, message: "Unauthorized no Permission" });
			}
			newPlayerData.push(player);
			continue;
		}
		newPlayerData.push(pl);
	}
	if (!exists) {
		return res.status(200).json({ error: true, message: "Invalid Player" });
	}

	await prisma.game.update({
		where: {
			id: gameId,
		},
		data: {
			playerData: newPlayerData,
		},
	});

	return res
		.status(200)
		.json({ player: player, error: false, message: "sucess" });
}
