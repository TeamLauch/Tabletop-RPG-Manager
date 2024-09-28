import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission Gamemaster
 * @returns Remove Game
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}

	const { gameId } = req.body;
	if (!gameId) {
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
			game.gamemaster != user.username &&
			!(await checkRoleUser("admin", user)))
	) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	await prisma.game.delete({
		where: {
			id: gameId,
		},
	});

	return res.status(200).json({ error: false, message: "sucess" });
}
