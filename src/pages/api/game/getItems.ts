import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission USER | GAMEMASTER (ALL ITEMS)
 * @returns Returns items of the Game
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

	const { type, gameId } = req.body;

	if (!gameId) {
		return res.status(200).json({ error: true, message: "No permissions" });
	}
	const game: any = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
	});

	if (!game) {
		return res.status(200).json({ error: true, message: "Invalid Game" });
	}

	let items: any[] = [];
	if (type == "all") {
		items = game.itemData.filter((item: any) => {
			return item;
		});
		if (
			game.gamemaster != user.username &&
			!game.gamemasters.includes(user.username)
		) {
			for (let i = 0; i < items.length; i++) {
				delete items[i]["gmInfo"];
			}
		}
		return res
			.status(200)
			.json({ items: items, error: false, message: "sucess" });
	}
	if (type == "free") {
		let notFree: any[] = [];
		for (const player of game.playerData) {
			if (!player) {
				continue;
			}
			if (player.items && Array.isArray(player.items)) {
				for (const item of player.items) {
					if (!item) {
						continue;
					}
					if (item.id && item.id != "costum") {
						notFree.push({
							id: item.id,
							amount: item.amount,
						});
					}
				}
			}
		}
		for (const player of game.npcData) {
			if (!player) {
				continue;
			}
			if (player.items && Array.isArray(player.items)) {
				for (const item of player.items) {
					if (!item) {
						continue;
					}
					if (item.id && item.id != "costum") {
						notFree.push({
							id: item.id,
							amount: item.amount,
						});
					}
				}
			}
		}
		for (const item of game.itemData) {
			if (!item) {
				continue;
			}

			if (item.allwaysFree == "true") {
				items.push(item);
				continue;
			}

			let a = Number.parseInt(item.amount) ?? 0;
			for (let info of notFree) {
				if (info.id == item.id) {
					a -= Number.parseInt(info.amount);
				}
			}
			if (a > 0) {
				items.push({
					...item,
					amount: a,
				});
				continue;
			}
		}
		if (
			game.gamemaster != user.username &&
			!game.gamemasters.includes(user.username)
		) {
			for (let i = 0; i < items.length; i++) {
				items[i] = { ...items[i], gmInfo: undefined };
			}
		}
		return res
			.status(200)
			.json({ items: items, error: false, message: "sucess" });
	}

	return res
		.status(200)
		.json({ items: items, error: false, message: "sucess" });
}
