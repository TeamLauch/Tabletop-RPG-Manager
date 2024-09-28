import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission USER | ADMIN(GETTING ALL)
 * @returns Returns the Characters of the User
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}
	const { id } = req.body;
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

	if (!id) {
		return res.status(200).json({ error: true, message: "Invalid ID" });
	}

	let character = await prisma.character.findUnique({
		where: {
			id: id,
		},
	});
	if (!character) {
		return res.status(200).json({ error: true, message: "Invalid ID" });
	}
	if (
		character?.ownerId != user.username &&
		!(await checkRoleUser("gamemaster", user))
	) {
		return res
			.status(200)
			.json({ error: true, message: "Unauthorized no Permission" });
	}

	return res
		.status(200)
		.json({ character: character, error: false, message: "sucess" });
}
