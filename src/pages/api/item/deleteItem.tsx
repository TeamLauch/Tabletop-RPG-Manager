import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @permission GAMEMASTER
 * @returns Get all Items
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}

	const { id } = req.body;

	if (!id) {
		return res.status(200).json({ error: true, message: "No ID Provided" });
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

	if (!user || !(await checkRoleUser("gamemaster", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	await prisma.item
		.delete({
			where: {
				id,
			},
		})
		.catch(() => {});

	return res.status(200).json({ error: false, message: "sucess" });
}