import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getByProjectId(id: any) {
  const workflows = await prisma.gd_workflow.findMany({
    where: {
      project_id: parseInt(id),
      workflow_delete: 0,
    },
    include: {
      project: true,
    },
  });
  return workflows;
}

export async function findById(id: any) {
  const workflows = await prisma.gd_workflow.findMany({
    where: {
      workflow_id: parseInt(id),
      workflow_delete: 0,
    },
    include: {
      project: true,
    },
  });
  let workflow = workflows[0] ?? null;
  return workflow;
}

export async function update(workflowId: number, digdagWorkflowId: number) {
  const result = await prisma.gd_workflow.update({
    where: {
      workflow_id: workflowId,
    },
    data: {
      digdag_workflow_id: digdagWorkflowId,
    },
  });
  return result;
}

export async function findByName(name: string, proId: any) {
  const workflows = await prisma.gd_workflow.findMany({
    where: {
      project_id: parseInt(proId),
      workflow_name: name,
      workflow_delete: 0,
    },
    include: {
      project: true,
    },
  });
  let workflow = workflows[0] ?? null;
  return workflow;
}

export async function findByNameAndProjectId(name: string, projectId: any) {
  const workflows = await prisma.gd_workflow.findMany({
    where: {
      workflow_name: {
        contains: name,
      },
      project_id: parseInt(projectId),
      workflow_delete: 0,
    },
    include: {
      project: true,
    },
  });
  let workflow = workflows[0] ?? null;
  return workflow;
}

export async function store(
  name: string,
  projectId: number,
  createDate: string,
  createBy: number,
  digdagWorkflowId: number
) {
  const result = await prisma.gd_workflow.create({
    data: {
      workflow_name: name,
      project_id: projectId,
      workflow_create_date: createDate,
      workflow_create_by: createBy,
      digdag_workflow_id: digdagWorkflowId,
    },
  });
  return result;
}
export async function softDelete(workflowId: any, updateDelete: any) {
  const result = await prisma.gd_workflow.update({
    data: {
      workflow_delete: 1,
      workflow_delete_at: updateDelete,
    },
    where: {
      workflow_id: parseInt(workflowId),
    },
  });
  return result;
}
