import { axiosInstance } from "./axios";

interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

interface Onboarding {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  location: string;
  profilePic?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const signup = async (data: SignupData) => {
  const response = await axiosInstance.post("/auth/signup", data);
  return response.data;
};

export const completeOnboarding = async (userData: Onboarding) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const login = async (userData: LoginData) => {
  const response = await axiosInstance.post("/auth/login", userData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId: string) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId: string) {
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}