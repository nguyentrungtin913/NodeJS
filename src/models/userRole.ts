import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function store(
  userId: any,
  roleId: any,
  createDate: any,
  createBy: number
) {
  const result = await prisma.gd_user_role.create({
    data: {
      user_id: parseInt(userId),
      role_id: parseInt(roleId),
      user_role_create_date: createDate,
      user_role_create_by: createBy,
    },
  });
  return result;
}

export async function update(
  userId: number,
  roleId: number,
  oldRoleId: number,
  updateDate: string,
  updateBy: number
) {
  const result = await prisma.gd_user_role.update({
    data: {
      role_id: roleId,
      user_role_update_date: updateDate,
      user_role_update_by: updateBy,
    },
    where: {
      user_id_role_id: {
        user_id: userId,
        role_id: oldRoleId,
      },
    },
  });
  return result;
}
export async function findByUserId(userId: any) {
  const userRoles = await prisma.gd_user_role.findMany({
    where: {
      user_id: parseInt(userId),
    },
  });
  let userRole = userRoles[0] ?? null;
  return userRole;
}
