export interface City {
    _id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CityResponse {
    success: boolean;
    data: City[];
}

export interface SingleCityResponse {
    success: boolean;
    data: City;
}