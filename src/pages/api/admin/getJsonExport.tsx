import { ATTRIBUTES, SUBATTRIBUTES } from "@/utils/constants";
import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, {
	checkCookie,
	checkRoleUser,
	checkToken,
} from "@/utils/roles";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission ADMIN(GETTING ALL)
 * @returns Returns the Characters of the User
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

	if (!user || !(await checkRoleUser("admin", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: token
					? "Unauthorized invalid Token"
					: "Unauthorized no Permission",
		});
	}
	const languages = await prisma.language.findMany();
	const abilities = await prisma.ability.findMany({
		where: {
			custom: true,
		},
	});
	const damageType = await prisma.damageType.findMany();
	const users = await prisma.user.findMany();

	let data = { languages, abilities, damageType, users };

	res.setHeader("Content-Type", "text/json");
	res.send(JSON.stringify(data));
	return res.status(200);
}
