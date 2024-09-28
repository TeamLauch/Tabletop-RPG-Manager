import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import { checkCookie, checkRoleUser, checkToken } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @permission USER
 * @returns Get all Spells
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "GET") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
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

	let { token } = req.query;

	if (token && !cookie) {
		user = await checkToken(token);
	}

	if (!user || !(await checkRoleUser("user", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: token
					? "Unauthorized invalid Token"
					: "Unauthorized no Permission",
		});
	}
	let data = await prisma.spell.findMany();

	res.setHeader("Content-Type", "application/json; charset=utf-8");
	return res.status(200).json({ error: false, message: "succes", data: data });
}