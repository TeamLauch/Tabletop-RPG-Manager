import prisma from "@/utils/prisma";
import setupDefaultDnD, {
	loadClassesAndRacesFromFolder,
	loadMonsterFromAPI,
	loadSpellsFromAPI,
} from "@/utils/setup";
import { NextApiRequest, NextApiResponse } from "next";

const bcrypt = require("bcrypt");

/**
 *
 * @permission NONE
 * @returns Adds A user to database and marks the Database as Ready for use
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const option = await prisma.settings.findUnique({
		where: {
			key: "setup",
		},
	});
	if (req.method == "GET") {
		return res
			.status(200)
			.json({ toSetup: !option || option.value == "false" });
	}

	if (req.method != "POST") {
		return res.status(401).json({ message: "Method not supported" });
	}

	if (option && option.value == "true") {
		return res.status(401).json({ message: "Setup not available" });
	}

	const { username, password } = req.body;
	let salt = bcrypt.genSaltSync(10);
	let pw = bcrypt.hashSync(password, salt);
	await prisma.user.create({
		data: {
			username: username,
			pw: pw,
			roles: "admin",
			email: "test@test.com",
			activated: true,
			createdBy: "Setup-System",
			updatedBy: "Setup-System",
		},
	});

	await setupDefaultDnD();

	if (!option) {
		await prisma.settings.create({
			data: {
				key: "setup",
				value: "true",
				updatedBy: "Setup-System",
			},
		});
	} else {
		await prisma.settings.update({
			where: {
				key: "setup",
			},
			data: {
				value: "true",
				updatedBy: "Setup-System",
			},
		});
	}

	await loadClassesAndRacesFromFolder();

	const monsters = await loadMonsterFromAPI();
	const spells = await loadSpellsFromAPI();

	await prisma.npc.createMany({
		data: monsters,
		skipDuplicates: true,
	});
	await prisma.spell.createMany({
		data: spells,
		skipDuplicates: true,
	});

	return res.status(200).json({ message: "Setup done! Close the Window" });
}
