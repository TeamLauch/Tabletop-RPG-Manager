import { getCookie } from "@/utils/cookies";
import prisma from "@/utils/prisma";
import { checkCookie, checkRoleUser } from "@/utils/roles";
import { Formidable } from "formidable";
import { copyFile, existsSync, mkdirSync, rm } from "fs";

export const config = {
	api: {
		bodyParser: false, // Disable body parsing, multer will handle it
	},
};

export default async function handler(req: any, res: any) {
	if (req.method === "POST") {
		const data: any = await new Promise((resolve, reject) => {
			const form = new Formidable();

			form.parse(req, (err: any, fields: any, files: any) => {
				if (err) reject({ err });
				resolve({ err, fields, files });
			});
		});

		const id = data.fields.id[0];

		const character = await prisma.npc.findUnique({
			where: {
				id: id ?? "",
			},
		});

		if (!character) {
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
			!(await checkRoleUser("uploader", user)) ||
			(!(await checkRoleUser("gamemaster", user)) &&
				character.createdBy != user.username)
		) {
			return res
				.status(200)
				.json({ error: true, message: "Unauthorized no Permission" });
		}
		if (!data.files || !data.files.file || !data.files.file[0]) {
			return res.status(200).json({ error: true, message: "Invalid File" });
		}

		if (!(await existsSync("./upload"))) {
			await mkdirSync("./upload");
		}
		if (!(await existsSync("./upload/npcs"))) {
			await mkdirSync("./upload/npcs");
		}

		const pFile = data.files.file[0];
		const sp = pFile.originalFilename.split(".");
		await rm("./upload/npcs/" + id + ".jpg", (err) => err);
		await rm("./upload/npcs/" + id + ".png", (err) => err);
		await rm("./upload/npcs/" + id + ".jpeg", (err) => err);
		await copyFile(
			pFile.filepath,
			"./upload/npcs/" + id + "." + sp[sp.length - 1],
			(err) => err
		);
		await rm(pFile.filepath, (err) => err);

		return res.status(200).json({ error: false, message: "Success" });
	} else {
		res.status(405).json({ message: "Method Not Allowed" });
	}
}
