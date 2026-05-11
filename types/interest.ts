export interface Interest {
  id: string;
  name: string;
  icon: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
}

export interface InterestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Interest[];
}

export interface SingleInterestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Interest;
}
