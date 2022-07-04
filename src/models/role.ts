import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function findById(roleId: any) {
    const roles = await prisma.gd_role.findMany({
        where: {
            role_id: parseInt(roleId)
        }
    })
    let role = roles[0] ?? null;
    return role;
}
export async function get() {
    let roles = await prisma.gd_role.findMany();
    roles = roles ?? null;
    return roles;
}