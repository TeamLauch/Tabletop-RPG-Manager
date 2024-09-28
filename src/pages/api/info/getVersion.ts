import { VERSION } from "@/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @permission GAMEMASTER
 * @returns Returns Weapons of the Game
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	console.log("TEST");
	if (req.method != "GET") {
		return res.status(401).json({ error: true, message: "Unsupported method" });
	}

	return res
		.status(200)
		.json({ version: VERSION, error: false, message: "sucess" });
}
