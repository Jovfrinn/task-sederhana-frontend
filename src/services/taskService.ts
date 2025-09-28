import api from "@/api"


export interface Tasks {
    id: number
    project_id: number
    title: string
    status: string
    assigned_to: number
    created_by: number
    created_at: string
    updated_at: string
    user_create?: string
    user?: string
}

interface User {
  nama: string,
  role: string
}

const API_URL = "http://localhost:8000/api"

export const TaskService = {
    async getTaskById(id: number): Promise<Tasks[]> {
        const res = await api.get(`${API_URL}/projects/${id}/tasks`)
        return res.data.data
    },
    async create(projectId:number, task: Omit<Tasks, "id" | "created_at" | "updated_at">): Promise<Tasks> {   
    const res = await api.post(`${API_URL}/projects/${projectId}/tasks`, task)
    return res.data.data
    },
    async update(id: number, project: Omit<Tasks, "id" | "created_at" | "updated_at">): Promise<Tasks> {
    const res = await api.put(`${API_URL}/tasks/${id}`, project)
    return res.data.data
    },
    async delete(id: number): Promise<void> {
    await api.delete(`${API_URL}/tasks/${id}`)
    },
    async assignUser(taskId: number, userId: number): Promise<Tasks> {
    const res = await api.put(`/tasks/${taskId}/assign`, { user_id: userId });
    return res.data.data;
    },
    async getJoinedUsers(projectId: number): Promise<User[]> {
    const res = await api.get(`/projects/${projectId}/joined-users`);
    return res.data;
    },

}
