import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission OWNER or ADMIN
 * @returns Transferes a game
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

	let { id, newOwner } = req.body;

	let game = await prisma.game.findUnique({
		where: {
			id: id,
		},
	});

	if (await checkRoleUser("admin", user)) {
		const index = game.gamemasters.indexOf(newOwner);

		if (index > -1) {
			await prisma.game.update({
				where: {
					id: id,
				},
				data: {
					gamemaster: newOwner,
					gamemasters: { push: newOwner },
					updatedAt: new Date(),
					updatedBy: user.username,
				},
			});
		} else {
			await prisma.game.update({
				where: {
					id: id,
				},
				data: {
					gamemasters: { push: newOwner },
					gamemaster: newOwner,
					updatedAt: new Date(),
					updatedBy: user.username,
				},
			});
		}

		return res
			.status(200)
			.json({ error: false, message: "success because user is admin" });
	} else if (
		(await checkRoleUser("user", user)) &&
		game.gamemaster == user.username
	) {
		const index = game.gamemasters.indexOf(newOwner);

		if (index > -1) {
			await prisma.game.update({
				where: {
					id: id,
				},
				data: {
					gamemaster: newOwner,
					updatedAt: new Date(),
					updatedBy: user.username,
				},
			});
		} else {
			await prisma.game.update({
				where: {
					id: id,
				},
				data: {
					gamemasters: { push: newOwner },
					gamemaster: newOwner,
					updatedAt: new Date(),
					updatedBy: user.username,
				},
			});
		}
		return res
			.status(200)
			.json({ error: false, message: "success because user is owner" });
	} else {
		return res
			.status(401)
			.json({ error: true, message: "Unauthorized no Permission" });
	}
}
