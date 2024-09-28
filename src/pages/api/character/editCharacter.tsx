import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission USER | ADMIN(EDITING ALL)
 * @returns Edit a existing Character
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

	if (!user || !(await checkRoleUser("user", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}
	let { character } = req.body;
	const oldKlasse = await prisma.character.findUnique({
		where: {
			id: character.id,
		},
	});
	if (!oldKlasse) {
		return res.status(200).json({ error: true, message: "Name not found" });
	}
	character["updatedBy"] = user.username;
	character["ownerId"] = oldKlasse.ownerId;
	character.hp = Number.parseInt(character.hp)
		? Number.parseInt(character.hp)
		: 0;
	character.rk = Number.parseInt(character.rk)
		? Number.parseInt(character.rk)
		: 0;
	await prisma.character.update({
		where: {
			id: character.id,
		},
		data: character,
	});

	return res.status(200).json({ error: false, message: "sucess" });
}
