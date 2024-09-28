const bcrypt = require("bcrypt");
import { getCookie } from "@/utils/cookies";
// MiliSeconds, Seconds, Minutes, Hours

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
/**
 * @permission ADMIN
 * @returns Edits a existing USER
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
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

	if (!user || !(await checkRoleUser("admin", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	if (req.method == "POST") {
		let { username } = req.body;

		username = username.toLowerCase();
		const u = await prisma.user.findUnique({
			where: {
				username: username,
			},
		});

		if (!u) {
			return res
				.status(200)
				.json({ error: true, message: "Nutzername existiert nicht" });
		}

		const tog = !u.canUpload;

		await prisma.user.update({
			where: {
				username: username,
			},
			data: {
				canUpload: tog,
				updatedBy: user.username,
			},
		});

		return res.status(200).json({ error: false, message: "success" });
	} else {
		return res.status(405).end();
	}
}
