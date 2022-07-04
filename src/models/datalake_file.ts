import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listFiles = async (userId: number = 0, folderId: number = 0) => {
  const params: any = {
    dl_file_deleted: 0,
    dl_file_created_by: userId,
  };
  if (folderId > 0) {
    params["dl_folder_id"] = folderId;
  }
  const files = await prisma.gd_datalake_file.findMany({
    where: params,
  });
  return files;
};

export const findFileById = async (
  userId: number = 0,
  folderId: number = 0,
  fileId: number = 0
) => {
  const params: any = {
    dl_file_created_by: userId,
    dl_folder_id: folderId,
    dl_file_id: fileId,
  };
  const files = await prisma.gd_datalake_file.findMany({
    where: params,
  });
  return files?.[0] || null;
};

export const createFile = async (
  userId: number = 0,
  folderId: number = 0,
  fileName: string = "",
  fileContent: string = "",
  createdAt: string = ""
) => {
  const result = await prisma.gd_datalake_file.create({
    data: {
      dl_file_name: fileName,
      dl_file_created_by: userId,
      dl_folder_id: folderId,
      dl_file_content: fileContent,
      dl_file_created_at: createdAt,
    },
  });
  return result;
};

export const updateFile = async (
  fileId: number = 0,
  folderId: number = 0,
  userId: number = 0,
  fileContent: string = "",
  updatedAt: string = ""
) => {
  const file = await prisma.gd_datalake_file.update({
    where: {
      dl_file_id: fileId,
    },
    data: {
      dl_folder_id: folderId,
      dl_file_content: fileContent,
      dl_file_updated_at: updatedAt,
      dl_file_updated_by: userId,
    },
  });
  return file;
};

export const updateParentFolder = async (
  fileId: number = 0,
  userId: number = 0,
  newParentFolderId: number = 0,
  updatedAt: string = ""
) => {
  const file = await prisma.gd_datalake_file.update({
    where: {
      dl_file_id: fileId,
    },
    data: {
      dl_folder_id: newParentFolderId,
      dl_file_updated_at: updatedAt,
      dl_file_updated_by: userId,
    },
  });
  return file;
};

export const deleteFile = async (fileId: number = 0) => {
  const result = await prisma.gd_datalake_file.update({
    where: {
      dl_file_id: fileId,
    },
    data: {
      dl_file_deleted: 1,
    },
  });
  return result;
};
