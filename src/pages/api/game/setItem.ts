import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission GAMEMASTER
 * @returns UPDATES a Item
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != "POST") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}
	const { item, gameId } = req.body;

	if (!item || !gameId) {
		return res.status(200).json({ error: true, message: "Invalid ID" });
	}

	const game: any = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
	});
	if (!game) {
		return res.status(200).json({ error: true, message: "Invalid ID" });
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

	if (
		!user ||
		!(await checkRoleUser("gamemaster", user)) ||
		(!game.gamemasters.includes(user.username) &&
			game.gamemaster != user.username)
	) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	let exists = false;
	let newItemData: any = [];
	for (const it of game.itemData) {
		if (!it) {
			continue;
		}
		if (it.id == item.id) {
			exists = true;
			newItemData.push(item);
			continue;
		}
		newItemData.push(it);
	}
	if (!exists) {
		newItemData.push(item);
	}

	await prisma.game.update({
		where: {
			id: gameId,
		},
		data: {
			itemData: newItemData,
		},
	});

	return res.status(200).json({ item: item, error: false, message: "sucess" });
}
