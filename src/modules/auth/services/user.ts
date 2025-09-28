import type { PrismaClient } from "@prisma/client";
import { hashPassword } from "./password";

export const createUser = async (
	prisma: PrismaClient,
	email: string,
	login: string,
	password: string,
) => {
	const hashed = await hashPassword(password);

	return prisma.user.create({
		data: {
			email,
			login,
			password: hashed,
		},
	});
};

export const findUserByEmail = async (prisma: PrismaClient, email: string) => {
	return prisma.user.findUnique({
		where: { email },
	});
};

export const findUserByLogin = async (prisma: PrismaClient, login: string) => {
	return prisma.user.findUnique({
		where: { login },
	});
};
