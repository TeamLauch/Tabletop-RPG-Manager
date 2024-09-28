import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, {
	checkCookie,
	checkRoleUser,
	checkToken,
} from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";
/**
 *
 * @permission EDITOR
 * @returns Edits a existing Ability
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
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

	let { token } = req.body;

	if (token && !cookie) {
		user = await checkToken(token);
	}

	if (!user || !(await checkRoleUser("editor", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: token
					? "Unauthorized invalid Token"
					: "Unauthorized no Permission",
		});
	}
	const { ability, oldName } = req.body;
	ability.custom = true;

	let a = await prisma.ability.findUnique({
		where: {
			name: oldName ?? ability.name,
		},
	});
	if (!a) {
		return res
			.status(200)
			.json({ error: true, message: "Name nicht vorhanden" });
	}

	await prisma.ability.update({
		where: {
			name: oldName ?? ability.name,
		},
		data: ability,
	});

	return res.status(200).json({ error: false, message: "sucess" });
}
