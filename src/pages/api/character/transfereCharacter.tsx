import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { disconnect } from "process";

/**
 *
 * @permission USER
 * @returns Creates a new Character
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
		| undefined
		| any = undefined;
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
	if (await checkRoleUser("admin", user)) {
		await prisma.character.update({
			where: {
				id: id,
			},
			data: {
				ownerId: newOwner,
				updatedAt: new Date(),
				updatedBy: user.username,
			},
		});

		return res
			.status(200)
			.json({ error: false, message: "success because user is admin" });
	} else if (
		(await checkRoleUser("user", user)) &&
		user.Characters.includes(id)
	) {
		await prisma.character.update({
			where: {
				id: id,
			},
			data: {
				ownerId: newOwner,
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
