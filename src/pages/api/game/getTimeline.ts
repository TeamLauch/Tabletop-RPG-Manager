import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";
import { use } from "react";

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

	const { gameId } = req.body;
	if (!gameId) {
		return res
			.status(200)
			.json({ error: true, message: "Invalid Data provided" });
	}

	const game = await prisma.game.findUnique({
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

	let events: any[] = game.roleplayData
		.filter((item: any) => item.type == "event")
		.map((item: any) => ({ ...item, gmInfo: undefined }));

	return res
		.status(200)
		.json({ events: events, error: false, message: "sucess" });
}
