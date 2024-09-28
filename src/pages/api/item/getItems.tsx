import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, {
	checkCookie,
	checkRoleUser,
	checkToken,
} from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @permission GAMEMASTER
 * @returns Get all Items
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

	if (!user) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: token
					? "Unauthorized invalid Token"
					: "Unauthorized no Permission",
		});
	}
	if (!(await checkRoleUser("gamemaster", user))) {
		let items = await prisma.item.findMany({
			select: {
				secret: false,
				custom: true,
				data: true,
				equip: true,
				description: true,
				id: true,
				name: true,
				type: true,
			},
		});

		return res
			.status(200)
			.json({ items: items, error: false, message: "sucess" });
	}
	let items = await prisma.item.findMany();

	return res
		.status(200)
		.json({ items: items, error: false, message: "sucess" });
}
