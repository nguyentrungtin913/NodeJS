import { PrismaClient } from "@prisma/client";
import _ from "lodash";
const prisma = new PrismaClient();

export async function listUsers(
  page: number = 0,
  limit: number = 5,
  status: number = -1,
  email: string = "",
  excluded_user_id: number = 0,
  parentId: number = 0
) {
  const params: any = {
    user_deleted: 0,
    user_id: {
      not: {
        equals: excluded_user_id,
      },
    },
  };
  if (status !== -1) {
    params["user_status"] = status;
  }
  if (!_.isEmpty(email)) {
    params["user_email"] = {
      contains: email,
    };
  }
  if (parentId > 0) {
    params["user_create_by"] = parentId;
  }

  const users = await prisma.$transaction([
    prisma.gd_user.count({
      where: params,
    }),
    prisma.gd_user.findMany({
      skip: page,
      take: limit,
      where: params,
      select: {
        user_id: true,
        user_email: true,
        user_first_name: true,
        user_last_name: true,
        user_status: true,
        user_create_at: true,
        user_update_at: true,
        user_create_by: true,
        user_update_by: true,
        user_roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        user_id: "asc",
      },
    }),
  ]);
  return users;
}

export async function findByEmail(email: string) {
  const users = await prisma.gd_user.findMany({
    where: {
      user_email: email,
      user_deleted: 0,
    },
    include: {
      user_roles: {
        include: {
          role: true,
        },
      },
    },
  });
  let user = users[0] ?? null;
  return user;
}

export async function findById(userId: number, parentId: number = 0) {
  const params: any = {
    user_deleted: 0,
  };
  params["user_id"] = userId;
  if (parentId > 0) {
    params["user_create_by"] = parentId;
  }
  const users = await prisma.gd_user.findMany({
    where: params,
    select: {
      user_id: true,
      user_email: true,
      user_first_name: true,
      user_last_name: true,
      user_status: true,
      user_create_at: true,
      user_update_at: true,
      user_create_by: true,
      user_update_by: true,
      user_roles: {
        include: {
          role: true,
        },
      },
    },
  });
  let user = users[0] ?? null;
  return user;
}

export async function create(
  userEmail: string,
  userCreateAt: string,
  userCreateBy: number,
  status: number
) {
  const user = await prisma.gd_user.create({
    data: {
      user_email: userEmail,
      user_status: status,
      user_create_at: userCreateAt,
      user_create_by: userCreateBy,
      user_update_by: userCreateBy,
      user_deleted: 0,
    },
  });
  return user;
}

export async function update(
  userId: number,
  firstName: string,
  lastName: string,
  password: string,
  userUpdateAt: any,
  status: number
) {
  const user = await prisma.gd_user.update({
    where: {
      user_id: userId,
    },
    data: {
      user_first_name: firstName,
      user_last_name: lastName,
      user_password: password,
      user_update_at: userUpdateAt,
      user_status: status,
    },
  });
  return user;
}

export async function softDelete(
  userId: number,
  userDeleteAt: any,
  parentId: number = 0
) {
  const user = await prisma.gd_user.updateMany({
    where: {
      user_id: userId,
      user_create_by: parentId,
    },
    data: {
      user_deleted: 1,
      user_deleted_at: userDeleteAt,
    },
  });
  return user;
}
