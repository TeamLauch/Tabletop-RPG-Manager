import { getRoles } from "./constants";
import prisma from "./prisma";

/**
 *
 * @param role Role to Check
 * @param user Username
 * @returns Has User the Role
 */
export default async function checkRole(role: string, user: string) {
	var pUser = await prisma.user.findUnique({
		where: {
			username: user,
		},
	});
	return checkRoleUser(role, pUser);
}

export async function checkCookie(cookie: any) {
	let c = await prisma.cookies.findUnique({
		where: { cookie },
		include: {
			owner: {
				include: {
					Characters: true,
				},
			},
		},
	});
	if (cookie.validTill >= new Date(Date.now())) {
		return undefined;
	}
	return c.owner;
}

export async function checkToken(token: any) {
	if (Array.isArray(token)) {
		token = token[0];
	}
	let t = await prisma.accessToken.findUnique({
		where: {
			token: token,
		},
		include: {
			user: {
				include: {
					Characters: true,
				},
			},
		},
	});
	if (!t || (t.validTill && t.validTill < new Date(Date.now()))) {
		return undefined;
	}
	return t.user;
}

/**
 *
 * @param role Role to Check
 * @param user Username
 * @returns Has User the Role
 */
export async function checkRoleUser(role: string, user: any) {
	if (!user) {
		return false;
	}
	if (role == "uploader") {
		return user.canUpload;
	}
	if (!user.activated) {
		return false;
	}
	if (getRoles(user?.roles).includes(role)) {
		return true;
	}
	return false;
}
