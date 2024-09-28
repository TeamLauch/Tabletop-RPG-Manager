import { getCookie } from "@/utils/cookies";
const bcrypt = require("bcrypt");
// MiliSeconds, Seconds, Minutes, Hours
const validTil = 1000 * 60 * 60 * 2;

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
/**
 * @permission ADMIN
 * @returns Creates a new User
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
		let { username, password, email, role } = req.body;

		username = username.toLowerCase();
		const u = await prisma.user.findUnique({
			where: {
				username: username,
			},
		});

		if (u) {
			return res
				.status(200)
				.json({ error: true, message: "Nutzername bereits besetzt" });
		}

		let salt = bcrypt.genSaltSync(10);
		let pw = bcrypt.hashSync(password, salt);
		await prisma.user.create({
			data: {
				username: username,
				pw: pw,
				email: email,
				roles: role,
				activated: true,
				canUpload: true,
				createdBy: user.username,
				updatedBy: user.username,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});

		return res.status(200).json({ error: false, message: "success" });
	} else {
		return res.status(405).end();
	}
}
