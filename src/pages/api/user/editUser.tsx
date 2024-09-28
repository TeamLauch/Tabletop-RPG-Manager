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

	if (!user) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}
	const isAdmin = await checkRoleUser("admin", user);

	if (req.method == "POST") {
		let { username, password, email, role, pwChanged, activated, oldPassword } =
			req.body;

		username = username.toLowerCase();
		if (username != user.username && !isAdmin) {
			return res.status(200).json({
				error: true,
				message: "Unauthorized no Permission",
			});
		}
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

		if (pwChanged) {
			if (!oldPassword && username == user.username) {
				return res.status(200).json({
					error: true,
					message: "Unauthorized no Permission",
				});
			}
			if (username == user.username) {
				const passwordMatch = await bcrypt.compare(oldPassword, u.pw);

				if (!passwordMatch) {
					return res.status(200).json({ error: "Ungültiges Passwort" });
				}
			}
			let salt = bcrypt.genSaltSync(10);
			let pw = bcrypt.hashSync(password, salt);
			await prisma.user.update({
				where: {
					username: username,
				},
				data: {
					pw: pw,
					email: email,
					roles: isAdmin ? role ?? u.roles : u.roles,
					updatedBy: user.username,
					activated: isAdmin ? activated : u.activated,
				},
			});
			return res.status(200).json({ error: false, message: "success" });
		}

		await prisma.user.update({
			where: {
				username: username,
			},
			data: {
				email: email,
				roles: isAdmin ? role ?? u.roles : u.roles,
				updatedBy: user.username,
				activated: isAdmin ? activated : u.activated,
			},
		});

		return res.status(200).json({ error: false, message: "success" });
	} else {
		return res.status(405).end();
	}
}
