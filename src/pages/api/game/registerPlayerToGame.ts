import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission USER
 * @returns Registers Player to Game
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}
	const { data, gameId } = req.body;
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

	if (!data) {
		return res.status(200).json({ error: true, message: "Invalid Playerdata" });
	}

	if (data.owner != user.username) {
		return res
			.status(200)
			.json({ error: true, message: "Unauthorized no Permission" });
	}

	const game = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
	});

	if (!game) {
		return res.status(200).json({ error: true, message: "Invalid GameID" });
	}

	const ps: any[] = game.playerData;

	for (let player of ps) {
		if (!player) {
			continue;
		}
		if (player.owner == data.owner) {
			return res.status(200).json({ error: true, message: "ERROR" });
		}
	}

	const retu = await prisma.game.update({
		where: {
			id: gameId,
		},
		data: {
			playerData: [...game.playerData, data],
		},
	});

	return res.status(200).json({ game: retu, error: false, message: "sucess" });
}
