import api from "@/api"

export interface Project {
    id: number
    title: string
    description: string
    start_date: string
    end_date: string
    created_at: string
    updated_at: string
    joined?: boolean
}

const API_URL = "http://localhost:8000/api"

export const ProjectService = {
    async getAll(): Promise<Project[]> {
        const res = await api.get(`${API_URL}/projects`)
        return res.data.data
    },
    async getProjectJoined(): Promise<Project[]> {
        const res = await api.get(`${API_URL}/projects/joined`)
        return res.data.data
    },
    async create(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> {
    const res = await api.post(`${API_URL}/projects`, project)
    return res.data.data
    },
    async update(id: number, project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> {
    const res = await api.put(`${API_URL}/projects/${id}`, project)
    return res.data.data
    },
    async delete(id: number): Promise<void> {
    await api.delete(`${API_URL}/projects/${id}`)
    },
    async join(id: number): Promise<void> {
    await api.post(`/projects/${id}/join`);
    }


}
