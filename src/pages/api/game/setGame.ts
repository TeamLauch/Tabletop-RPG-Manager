import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission GAMEMASTER
 * @returns UPDATES a GAME
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}
	const { data } = req.body;

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

	if (!user || !(await checkRoleUser("gamemaster", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	if (!data) {
		return res.status(200).json({ error: true, message: "Invalid ID" });
	}

	if (!data.id) {
		const gamemasters: String[] = [];

		gamemasters.push(user.username);
		const game = await prisma.game.create({
			data: {
				...data,
				createdBy: user.username,
				updatedBy: user.username,
				gamemaster: user.username,
				gamemasters: gamemasters,
			},
		});
		return res
			.status(200)
			.json({ game: game, error: false, message: "success" });
	}

	const game = await prisma.game.findUnique({
		where: {
			id: data.id,
		},
	});

	if (!game) {
		const game = await prisma.game.create({
			data: {
				...data,
				createdBy: user.username,
				updatedBy: user.username,
				gamemaster: user.username,
				gamemasters: user.username,
			},
		});
		return res
			.status(200)
			.json({ game: game, error: false, message: "success" });
	}

	if (
		game.gamemaster != user.username &&
		!game.gamemasters.includes(user.username)
	) {
		return res
			.status(200)
			.json({ error: true, message: "Unauthorized no Permission" });
	}

	const retu = await prisma.game.update({
		where: {
			id: data.id,
		},
		data: {
			...data,
			updatedAt: new Date(),
			updatedBy: user.username,
		},
	});

	return res.status(200).json({ game: retu, error: false, message: "success" });
}
