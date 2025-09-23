import type { PrismaClient, User } from "@prisma/client";
import { hashPassword } from "./password";

export const createUser = async (
	prisma: PrismaClient,
	email: string,
	login: string,
	token: string,
	password: string,
) => {
	const hashed = await hashPassword(password);
	return prisma.user.create({
		data: {
			email,
			token,
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

export const updateUser = async (
	prisma: PrismaClient,
	id: string,
	data: Partial<User>,
) => {
	await prisma.user.update({
		where: { id: id },
		data: data,
	});
};
