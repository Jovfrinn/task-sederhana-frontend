import api from "@/api";

export const login = async (email: string, password: string) => {
    const res = await api.post("/login", { email, password });
    localStorage.setItem("token", res.data.token);
    return res.data;
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};