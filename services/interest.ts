import api from "@/lib/axios";
import {
  Interest,
  InterestResponse,
  SingleInterestResponse,
} from "@/types/interest";

// GET all interests
export const getInterests = async (): Promise<Interest[]> => {
  const res = await api.get<InterestResponse>(
    process.env.NEXT_PUBLIC_INTERESTS_LIST || "/interests"
  );
  return res.data.data;
};

// ADD interest (admin)
export const addInterest = async (data: {
  name: string;
  icon: string;
}): Promise<Interest> => {
  const res = await api.post<SingleInterestResponse>(
    process.env.NEXT_PUBLIC_INTERESTS_LIST || "/interests",
    data
  );
  return res.data.data;
};

// UPDATE interest
export const updateInterest = async (
  id: string,
  data: { name: string; icon: string }
): Promise<Interest> => {
  const res = await api.put<SingleInterestResponse>(`/interests/${id}`, data);
  return res.data.data;
};

// TOGGLE status
export const toggleInterestStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<Interest> => {
  const res = await api.patch<SingleInterestResponse>(`/interests/${id}`, {
    status,
  });
  return res.data.data;
};

// DELETE interest
export const deleteInterest = async (id: string): Promise<void> => {
  await api.delete(`/interests/${id}`);
};
