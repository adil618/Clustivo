export interface Avatar {
  id: string;
  url: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
}

export interface AvatarResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Avatar[];
}

export interface SingleAvatarResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Avatar;
}
