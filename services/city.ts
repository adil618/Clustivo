import api from "@/lib/axios";
import { City, CityResponse, SingleCityResponse } from "@/types/city";

// GET all cities
export const getCities = async (): Promise<City[]> => {
    const res = await api.get<CityResponse>("/city");
    return res.data.data;
};

// ADD city
export const addCity = async (data: { name: string }): Promise<City> => {
    const res = await api.post<SingleCityResponse>("/city", data);
    return res.data.data;
};

// UPDATE city
export const updateCity = async (
    id: string,
    data: { name: string }
): Promise<City> => {
    const res = await api.put<SingleCityResponse>(`/city/${id}`, data);
    return res.data.data;
};

// DELETE city
export const deleteCity = async (id: string): Promise<void> => {
    await api.delete(`/city/${id}`);
};