import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listFolders = async (
  userId: number = 0,
  parentFolderId: number = 0
) => {
  const params: any = {
    dl_folder_deleted: 0,
    dl_folder_created_by: userId,
  };
  if (parentFolderId > 0) {
    params["dl_parent_folder_id"] = parentFolderId;
  }
  const folders = await prisma.gd_datalake_folder.findMany({
    where: params,
    include: {
      files: {
        where: {
          dl_file_deleted: 0,
        },
      },
    },
  });
  return folders;
};

export const findFolderById = async (
  folderId: number = 0,
  userId: number = 0
) => {
  const params: any = {
    dl_folder_deleted: 0,
    dl_folder_created_by: userId,
    dl_folder_id: folderId,
  };
  const folders = await prisma.gd_datalake_folder.findMany({
    where: params,
  });
  return folders?.[0] || null;
};

export const createFolder = async (
  userId: number = 0,
  parentFolderId: number = 0,
  folderName: string = "",
  createdAt: string = ""
) => {
  const result = await prisma.gd_datalake_folder.create({
    data: {
      dl_folder_name: folderName,
      dl_folder_created_by: userId,
      dl_parent_folder_id: parentFolderId,
      dl_folder_created_at: createdAt,
    },
  });
  return result;
};

export const updateFolder = async (
  folderId: number = 0,
  folderName: string = "",
  updatedAt: string = ""
) => {
  const folder = await prisma.gd_datalake_folder.update({
    where: {
      dl_folder_id: folderId,
    },
    data: {
      dl_folder_name: folderName,
      dl_folder_updated_at: updatedAt,
    },
  });
  return folder;
};

export const deleteFolder = async (folderId: number = 0) => {
  const result = await prisma.$transaction([
    prisma.gd_datalake_folder.update({
      where: {
        dl_folder_id: folderId,
      },
      data: {
        dl_folder_deleted: 1,
      },
    }),
    prisma.gd_datalake_file.updateMany({
      where: {
        dl_folder_id: folderId,
      },
      data: {
        dl_file_deleted: 1,
      },
    }),
  ]);

  return result;
};
