import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission OWNER or ADMIN
 * @returns Adds a Gamemaster to a Game
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(405).json({ error: true, message: "Unsupported method" });
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

	let { id, gamemasterToRemove } = req.body;

	let game = await prisma.game.findUnique({
		where: {
			id: id,
		},
	});

	if (await checkRole("admin", user.username)) {
		let NewGamemastersArray: string[] = game.gamemasters;

		const index = NewGamemastersArray.indexOf(gamemasterToRemove, 0);
		if (index > -1) {
			NewGamemastersArray.splice(index, 1);
		}

		await prisma.game.update({
			where: {
				id: id,
			},
			data: {
				gamemasters: NewGamemastersArray,
				updatedAt: new Date(),
				updatedBy: user.username,
			},
		});

		return res
			.status(200)
			.json({ error: false, message: "success because user is admin" });
	} else if (
		(await checkRole("user", user.username)) &&
		game.gamemaster == user.username
	) {
		let NewGamemastersArray: string[] = game.gamemasters;

		const index = NewGamemastersArray.indexOf(gamemasterToRemove, 0);
		if (index > -1) {
			NewGamemastersArray.splice(index, 1);
		}
		await prisma.game.update({
			where: {
				id: id,
			},
			data: {
				gamemasters: NewGamemastersArray,
				updatedAt: new Date(),
				updatedBy: user.username,
			},
		});
		return res
			.status(200)
			.json({ error: false, message: "success because user is owner" });
	} else {
		return res
			.status(401)
			.json({ error: true, message: "Unauthorized no Permission" });
	}
}