const bcrypt = require("bcrypt");
// MiliSeconds, Seconds, Minutes, Hours

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
/**
 * @permission User
 * @returns Changes Password
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") {
		let { token } = req.body;
		if (!token) {
			return res.status(200).json({ error: true, message: "INVALID TOKEN" });
		}
		const t = await prisma.registerTokens.findUnique({
			where: {
				id: token,
			},
		});
		if (!t || t.validTill < new Date(Date.now())) {
			if (t && t.validTill < new Date(Date.now())) {
				await prisma.registerTokens.delete({
					where: {
						id: t.id,
					},
				});
			}
			return res.status(200).json({ error: true, message: "INVALID TOKEN" });
		}
		return res.status(200).json({ error: false, message: "success" });
	} else {
		return res.status(405).end();
	}
}
