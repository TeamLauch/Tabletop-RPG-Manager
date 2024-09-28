import { ATTRIBUTES, SUBATTRIBUTES } from "@/utils/constants";
import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import checkRole, {
	checkCookie,
	checkRoleUser,
	checkToken,
} from "@/utils/roles";
import { Formidable } from "formidable";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { readFile, readFileSync } from "fs";

export const config = {
	api: {
		bodyParser: false, // Disable body parsing, multer will handle it
	},
};

/**
 *
 * @permission ADMIN(GETTING ALL)
 * @returns Returns the Characters of the User
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

	if (!user || !(await checkRoleUser("admin", user))) {
		return res.status(200).json({
			error: true,
			message: cookie
				? "Unauthorized invalid Cookie"
				: "Unauthorized no Permission",
		});
	}

	const data: any = await new Promise((resolve, reject) => {
		const form = new Formidable();

		form.parse(req, (err: any, fields: any, files: any) => {
			if (err) reject({ err });
			resolve({ err, fields, files });
		});
	});

	if (!data.files || !data.files.file || !data.files.file[0]) {
		return res.status(200).json({ error: true, message: "Invalid File" });
	}
	const pFile = data.files.file[0];

	let t = JSON.parse(
		readFileSync(pFile.filepath, { encoding: "utf8", flag: "r" })
	);
	if (t.languages) {
		await prisma.language.deleteMany();
		await prisma.language.createMany({
			data: t.languages,
		});
	}
	if (t.abilities) {
		await prisma.ability.deleteMany({
			where: {
				custom: true,
			},
		});
		await prisma.ability.createMany({
			data: t.abilities,
			skipDuplicates: true,
		});
	}
	if (t.damageType) {
		await prisma.damageType.deleteMany();
		await prisma.damageType.createMany({
			data: t.damageType,
		});
	}

	if (t.users) {
		await prisma.user.createMany({
			data: t.users,
			skipDuplicates: true,
		});
	}

	return res.status(200).json({ error: false, message: "Success" });
}