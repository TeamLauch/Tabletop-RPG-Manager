import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, {
	checkCookie,
	checkRoleUser,
	checkToken,
} from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { RssFeed } from "@mui/icons-material";

/**
 * @permission USER
 * @returns Get NPC by ID
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
	const { name, type } = req.query;

	if (type == "race") {
		const race = await prisma.volk.findUnique({
			where: {
				name: Array.isArray(name) ? name[0] : name,
			},
		});
		if (!race) {
			return res
				.status(200)
				.json({ error: true, message: "Provided NAME INVALID" });
		}
		let list = [];
		for (let f of race.files) {
			list.push(fs.readFileSync("./ruleset/races/" + f, "utf-8"));
		}
		res.setHeader("Content-Type", "	text/javascript");
		res.send(list);
		return;
	} else if (type == "class") {
		const clas = await prisma.class.findUnique({
			where: {
				name: Array.isArray(name) ? name[0] : name,
			},
		});
		if (!clas) {
			return res
				.status(200)
				.json({ error: true, message: "Provided NAME INVALID" });
		}
		let list = [];
		for (let f of clas.files) {
			list.push(fs.readFileSync("./ruleset/classes/" + f, "utf-8"));
		}
		res.setHeader("Content-Type", "text/javascript");
		res.send(list);
		return;
	} else if (type == "background") {
		const clas = await prisma.background.findUnique({
			where: {
				name: Array.isArray(name) ? name[0] : name,
			},
		});
		if (!clas) {
			return res
				.status(200)
				.json({ error: true, message: "Provided NAME INVALID" });
		}
		let list = [];
		for (let f of clas.files) {
			list.push(fs.readFileSync("./ruleset/backgrounds/" + f, "utf-8"));
		}
		res.setHeader("Content-Type", "text/javascript");
		res.send(list);
		return;
	}

	return res.status(200).json({ error: true, message: "" });
}
