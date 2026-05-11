import api from "@/lib/axios";
import { Avatar, AvatarResponse, SingleAvatarResponse } from "@/types/avatar";

// GET all avatars
export const getAvatars = async (): Promise<Avatar[]> => {
  const res = await api.get<AvatarResponse>(
    process.env.NEXT_PUBLIC_AVATAR_LIST || "/avatar"
  );
  return res.data.data;
};

// ADD avatar
export const addAvatar = async (data: { url: string }): Promise<Avatar> => {
  const res = await api.post<SingleAvatarResponse>(
    process.env.NEXT_PUBLIC_AVATAR_LIST || "/avatar",
    data
  );
  return res.data.data;
};

// UPDATE avatar URL
export const updateAvatar = async (
  id: string,
  data: { url: string }
): Promise<Avatar> => {
  const res = await api.put<SingleAvatarResponse>(`/avatar/${id}`, data);
  return res.data.data;
};

// ACTIVATE or DEACTIVATE avatar
export const toggleAvatarStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<Avatar> => {
  const res = await api.patch<SingleAvatarResponse>(`/avatar/${id}`, {
    status,
  });
  return res.data.data;
};

// DELETE avatar
export const deleteAvatar = async (id: string): Promise<void> => {
  await api.delete(`/avatar/${id}`);
};
