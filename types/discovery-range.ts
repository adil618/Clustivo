export interface DiscoveryRange {
  id: string;
  label: string;
  km: number;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscoveryRangeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DiscoveryRange[];
}

export interface SingleDiscoveryRangeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DiscoveryRange;
}
