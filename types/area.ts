export interface Area {
    id: number | string;
    _id?: number | string; // For backward compatibility if any
    name: string;
    cityId: number | string;
    city?: {
        id: number | string;
        name: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface AreaResponse {
    success: boolean;
    data: Area[];
}

export interface SingleAreaResponse {
    success: boolean;
    data: Area;
}
