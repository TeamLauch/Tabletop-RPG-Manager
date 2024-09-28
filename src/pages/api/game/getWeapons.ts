import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, { checkCookie, checkRoleUser } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission USER | GAMEMASTER (ALL ITEMS)
 * @returns Returns Weapons of the Game
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
	const { type, gameId } = req.body;

	if (
		!user ||
		!(type == "all" && checkRoleUser("gamemaster", user)) ||
		!gameId
	) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	const game: any = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
	});

	if (!game) {
		return res.status(200).json({ error: true, message: "Invalid Game" });
	}

	let weapons: any[] = [];
	if (type == "all") {
		weapons = game.itemData.filter((item: any) => {
			return item && item.type == "weapon";
		});
		if (
			game.gamemaster != user.username &&
			!game.gamemasters.includes(user.username)
		) {
			for (let i = 0; i < weapons.length; i++) {
				delete weapons[i]["gmInfo"];
			}
		}
		return res
			.status(200)
			.json({ weapons: weapons, error: false, message: "sucess" });
	}
	if (type == "free") {
		let notFree: any[] = [];
		for (const player of game.playerData) {
			if (player.weapons && Array.isArray(player.weapons)) {
				for (const weapon of player.weapons) {
					if (weapon.id && weapon.id != "costum") {
						notFree.push(weapon.id);
					}
				}
			}
		}
		if (
			game.gamemaster != user.username &&
			!game.gamemasters.includes(user.username)
		) {
			for (let i = 0; i < weapons.length; i++) {
				delete weapons[i]["gmInfo"];
			}
		}
		weapons = game.itemData.filter((item: any) => {
			return (
				item && item.id && !notFree.includes(item.id) && item.type == "weapon"
			);
		});
		return res
			.status(200)
			.json({ weapons: weapons, error: false, message: "sucess" });
	}

	return res
		.status(200)
		.json({ weapons: weapons, error: false, message: "sucess" });
}
