import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function get() {
  const projects = await prisma.gd_project.findMany({
    where: {
      project_deleted: 0,
    },
  });
  return projects;
}

export async function store(
  name: string,
  digdagProjectId: number,
  revision: string,
  createDate: any,
  createBy: number
) {
  const result = await prisma.gd_project.create({
    data: {
      project_name: name,
      project_create_date: createDate,
      project_revision: revision,
      project_create_by: createBy,
      digdag_project_id: digdagProjectId,
    },
  });
  return result;
}

export async function update(
  projectId: number,
  revision: string,
  updateDate: string,
  updateBy: number,
  digdagProjectId: number
) {
  const result = await prisma.gd_project.update({
    where: {
      project_id: projectId,
    },
    data: {
      project_update_date: updateDate,
      project_update_by: updateBy,
      project_revision: revision,
      digdag_project_id: digdagProjectId,
    },
  });
  return result;
}

export async function findByName(name: string) {
  const projects = await prisma.gd_project.findMany({
    where: {
      project_name: {
        contains: name,
      },
      project_deleted: 0,
    },
  });
  let project = projects[0] ?? null;
  return project;
}

export async function findById(id: any) {
  const projects = await prisma.gd_project.findMany({
    where: {
      project_deleted: 0,
      project_id: parseInt(id),
    },
  });
  let project = projects[0] ?? null;
  return project;
}

export async function softDelete(idProject: any, dateDelete: any) {
  const project = await prisma.gd_project.update({
    where: {
      project_id: parseInt(idProject),
    },
    data: {
      project_deleted: 1,
      project_deleted_at: dateDelete,
    },
  });
  return project;
}
