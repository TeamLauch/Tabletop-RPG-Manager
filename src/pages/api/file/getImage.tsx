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
	const { id, type } = req.query;

	if (type == "npc") {
		if (fs.existsSync("./upload/npcs/" + id + ".jpg")) {
			const buffer = fs.readFileSync("./upload/npcs/" + id + ".jpg");
			res.setHeader("Content-Type", "image/jpg");
			res.send(buffer);
			return;
		} else if (fs.existsSync("./upload/npcs/" + id + ".png")) {
			const buffer = fs.readFileSync("./upload/npcs/" + id + ".png");
			res.setHeader("Content-Type", "image/png");
			res.send(buffer);
			return;
		} else if (fs.existsSync("./upload/npcs/" + id + ".jpeg")) {
			const buffer = fs.readFileSync("./upload/npcs/" + id + ".jpeg");
			res.setHeader("Content-Type", "image/jpeg");
			res.send(buffer);
			return;
		}
	} else if (type == "character") {
		if (fs.existsSync("./upload/characters/" + id + ".jpg")) {
			const buffer = fs.readFileSync("./upload/characters/" + id + ".jpg");
			res.setHeader("Content-Type", "image/jpg");
			res.send(buffer);
			return;
		} else if (fs.existsSync("./upload/characters/" + id + ".png")) {
			const buffer = fs.readFileSync("./upload/characters/" + id + ".png");
			res.setHeader("Content-Type", "image/png");
			res.send(buffer);
			return;
		} else if (fs.existsSync("./upload/characters/" + id + ".jpeg")) {
			const buffer = fs.readFileSync("./upload/characters/" + id + ".jpeg");
			res.setHeader("Content-Type", "image/jpeg");
			res.send(buffer);
			return;
		}
	} else {
		if (fs.existsSync("./upload/maps/" + id + ".jpg")) {
			const buffer = fs.readFileSync("./upload/maps/" + id + ".jpg");
			res.setHeader("Content-Type", "image/jpg");
			res.send(buffer);
			return;
		} else if (fs.existsSync("./upload/maps/" + id + ".png")) {
			const buffer = fs.readFileSync("./upload/maps/" + id + ".png");
			res.setHeader("Content-Type", "image/png");
			res.send(buffer);
			return;
		} else if (fs.existsSync("./upload/maps/" + id + ".jpeg")) {
			const buffer = fs.readFileSync("./upload/maps/" + id + ".jpeg");
			res.setHeader("Content-Type", "image/jpeg");
			res.send(buffer);
			return;
		}
	}

	return res.status(404).json({});
}
