import api from "@/lib/axios";
import {
  DiscoveryRange,
  DiscoveryRangeResponse,
  SingleDiscoveryRangeResponse,
} from "@/types/discovery-range";

// GET all discovery ranges
export const getDiscoveryRanges = async (): Promise<DiscoveryRange[]> => {
  const res = await api.get<DiscoveryRangeResponse>(
    process.env.NEXT_PUBLIC_DISCOVERY_RANGE || "/discovery-range"
  );
  return res.data.data;
};

// ADD discovery range (admin)
export const addDiscoveryRange = async (data: {
  label: string;
  km: number;
  description?: string;
}): Promise<DiscoveryRange> => {
  const res = await api.post<SingleDiscoveryRangeResponse>(
    process.env.NEXT_PUBLIC_DISCOVERY_RANGE || "/discovery-range",
    data
  );
  return res.data.data;
};

// UPDATE discovery range
export const updateDiscoveryRange = async (
  id: string,
  data: { label: string; km: number; description?: string }
): Promise<DiscoveryRange> => {
  const res = await api.put<SingleDiscoveryRangeResponse>(
    `/discovery-range/${id}`,
    data
  );
  return res.data.data;
};

// TOGGLE status
export const toggleDiscoveryRangeStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<DiscoveryRange> => {
  const res = await api.patch<SingleDiscoveryRangeResponse>(
    `/discovery-range/${id}`,
    { status }
  );
  return res.data.data;
};

// DELETE discovery range
export const deleteDiscoveryRange = async (id: string): Promise<void> => {
  await api.delete(`/discovery-range/${id}`);
};
