import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @permission GAMEMASTER
 * @returns Update/Create NPC
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}
	const { data } = req.body;
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

	if (!data.id) {
		await prisma.news.create({
			data: { ...data, createdBy: user.username, updatedBy: user.username },
		});
		return res.status(200).json({ error: false, message: "sucess" });
	}

	let news = await prisma.news.findUnique({
		where: {
			id: data.id,
		},
	});
	if (!news) {
		delete data["id"];
		await prisma.news.create({
			data: { ...data, createdBy: user.username, updatedBy: user.username },
		});
		return res.status(200).json({ error: false, message: "sucess" });
	}

	await prisma.news.update({
		where: {
			id: data.id,
		},
		data: { ...data, updatedBy: user.username },
	});
	return res.status(200).json({ error: false, message: "sucess" });
}
