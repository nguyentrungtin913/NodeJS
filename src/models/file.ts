import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getListFile(projectId: any, workflowId: any) {
  const files = await prisma.gd_file.findMany({
    where: {
      project_id: parseInt(projectId),
      workflow_id: parseInt(workflowId),
      file_deleted: 0,
    },
  });
  return files;
}

export async function findFileByFileName(
  projectId: any,
  workflowId: any,
  fileName: any
) {
  const files = await prisma.gd_file.findFirst({
    where: {
      project_id: parseInt(projectId),
      workflow_id: parseInt(workflowId),
      file_path: fileName,
      file_deleted: 0,
    },
  });
  return files;
}

export async function findFile(id: any, filePath: string) {
  const path = filePath.toString();
  const files = await prisma.gd_file.findMany({
    where: {
      workflow_id: parseInt(id),
      file_path: path,
      file_deleted: 0,
    },
  });
  console.log(files);
  let file = files[0] ?? null;
  return file;
}

export async function store(
  filePath: string,
  projectId: any,
  workflowId: any,
  createDate: any,
  createBy: any
) {
  const result = await prisma.gd_file.create({
    data: {
      file_path: filePath,
      project_id: parseInt(projectId),
      workflow_id: parseInt(workflowId),
      file_create_date: createDate,
      file_create_by: parseInt(createBy),
    },
  });
  return result;
}

export async function findByPath(projectId: number, path: string) {
  const files = await prisma.gd_file.findMany({
    where: {
      project_id: projectId,
      file_path: path,
      file_deleted: 0,
    },
  });
  let file = files[0] ?? null;
  return file;
}

export async function findByPathUpdate(fileId: any, path: string) {
  const files = await prisma.gd_file.findMany({
    where: {
      NOT: {
        file_id: parseInt(fileId),
      },
      file_path: path,
      file_deleted: 0,
    },
  });
  let file = files[0] ?? null;
  return file;
}

export async function findById(id: string) {
  const files = await prisma.gd_file.findMany({
    where: {
      file_id: parseInt(id),
      file_deleted: 0,
    },
  });
  let file = files[0] ?? null;
  return file;
}

export async function update(fileId: any, updateDate: any, updateBy: any) {
  const file = await prisma.gd_file.update({
    where: {
      file_id: parseInt(fileId),
    },
    data: {
      file_update_date: updateDate,
      file_update_by: parseInt(updateBy),
    },
  });
  return file;
}
export async function renameFile(fileId: any, fileName: string) {
  const file = await prisma.gd_file.update({
    where: {
      file_id: parseInt(fileId),
    },
    data: {
      file_path: fileName,
    },
  });
  return file;
}

export async function find(projectId: any, workflowId: any, fileName: string) {
  const files = await prisma.gd_file.findMany({
    where: {
      project_id: parseInt(projectId),
      workflow_id: parseInt(workflowId),
      file_path: fileName,
      file_deleted: 0,
    },
  });
  let file = files[0] ?? null;
  return file;
}

export async function softDelete(fileId: any, deleteDate: any) {
  const file = await prisma.gd_file.update({
    where: {
      file_id: parseInt(fileId),
    },
    data: {
      file_deleted: 1,
      file_deleted_at: deleteDate,
    },
  });
  return file;
}
