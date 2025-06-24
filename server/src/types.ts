export interface TokenPayload {
  id: string;
}

export interface UserMain {
  id: string;
  fullName: string;
  email: string;
  profilePic: string | null;
  friendIds: string[];
  friendOfIds: string[];
  isOnboarded: boolean;
}

export interface UserData {
  id: string;
  name: string;
  image: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserMain;
    }
  }
}
