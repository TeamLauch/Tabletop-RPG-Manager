const bcrypt = require("bcrypt");
import { getCookie } from "@/utils/cookies";
// MiliSeconds, Seconds, Minutes, Hours

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import { checkCookie, checkRoleUser } from "@/utils/roles";
/**
 * @permission User
 * @returns Changes Password
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

	if (!user || !(await checkRoleUser("user", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	if (req.method == "POST") {
		console.log(req.body);
		let { password, oldPassword } = req.body;
		let salt = bcrypt.genSaltSync(10);
		console.log(user.username + " " + user.pw);
		const passwordMatch = await bcrypt.compare(oldPassword, user.pw);
		if (passwordMatch) {
			let pw = bcrypt.hashSync(password, salt);
			await prisma.user.update({
				where: {
					username: user.username,
				},
				data: {
					pw: pw,
					updatedBy: user.username,
				},
			});
			return res.status(200).json({ error: false, message: "success" });
		} else {
			return res.status(400).json({ error: true, message: "old pw is wrong" });
		}
	} else {
		return res.status(405).end();
	}
}
