import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission USER
 * @returns Returns Weapons of the Game
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}

	const { playerId, gameId } = req.body;
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

	if (!user || !(await checkRoleUser("user", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}
	let player: any = {};
	for (const p of game.playerData) {
		if (!p) {
			continue;
		}
		if (!playerId) {
			if (p.owner && p.owner == user.username) {
				player = p;
				break;
			}
			continue;
		}
		if (p.id && p.id == playerId) {
			player = p;
			break;
		}
	}
	if (
		player.owner != user.username &&
		!checkRoleUser("gamemaster", user) &&
		!game.gamemasters.includes(user.username) &&
		game.gamemaster != user.username
	) {
		return res.status(200).json({ error: true, message: "No permissions" });
	}

	return res
		.status(200)
		.json({ player: player, error: false, message: "sucess" });
}
