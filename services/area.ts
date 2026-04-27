import api from "@/lib/axios";
import { Area, AreaResponse, SingleAreaResponse } from "@/types/area";

// GET all areas
export const getAreas = async (): Promise<Area[]> => {
    const res = await api.get<AreaResponse>("/area");
    // Some APIs nest the array in res.data, others in res.data.data.
    // Assuming res.data.data as per previous files
    return res.data.data || res.data;
};

// ADD area
export const addArea = async (data: { name: string; cityId: number | string }): Promise<Area> => {
    const res = await api.post<SingleAreaResponse>("/area", data);
    return res.data.data || res.data;
};

// UPDATE area
export const updateArea = async (
    id: string | number,
    data: { name: string; cityId: number | string }
): Promise<Area> => {
    const res = await api.put<SingleAreaResponse>(`/area/${id}`, data);
    return res.data.data || res.data;
};

// DELETE area
export const deleteArea = async (id: string | number): Promise<void> => {
    await api.delete(`/area/${id}`);
};
