import prisma from "@/utils/prisma";
import checkRole from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @returns Checks whether a Cookie is still valid or not
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const { cookie, role } = req.body;

		const user = await prisma.cookies.findUnique({
			where: { cookie },
		});
		if (!user) {
			return res.status(200).json({ error: true, type: "C" });
		}
		if (user?.validTill < new Date(Date.now())) {
			try {
				await prisma.cookies.delete({
					where: { cookie },
				});
			} catch {
				return res.status(200).json({ error: true, type: "C" });
			}
			return res.status(200).json({ error: true, type: "C" });
		}
		if (role != "none" && !(await checkRole(role, user.user))) {
			return res.status(200).json({ error: true, type: "P" });
		}
		let u = {
			user: user.user,
			cookie: user.cookie,
			validTill: user.validTill,
		};
		res.status(200).json(u);
	} else {
		res.status(200).end();
	}
}
