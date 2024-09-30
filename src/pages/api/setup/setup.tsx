import prisma from "@/utils/prisma";
import setupDefaultDnD, {
	installRuleset,
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

	const { username, password, ruleset } = req.body;
	if (!ruleset || ruleset.type != "dnd5e") {
		return res.status(401).json({ message: "Only DnD as System available" });
	}

	if (ruleset.type == "dnd5e") {
		await setupDefaultDnD();

		await installRuleset(ruleset);

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

		await loadClassesAndRacesFromFolder();
	}

	let salt = bcrypt.genSaltSync(10);
	let pw = bcrypt.hashSync(password, salt);
	await prisma.user.create({
		data: {
			username: username,
			pw: pw,
			roles: "admin",
			email: "",
			activated: true,
			createdBy: "Setup-System",
			updatedBy: "Setup-System",
		},
	});

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

	return res.status(200).json({ message: "Setup done! Close the Window" });
}
