export interface BasicUserInfo {
  _id: string;
  Name: string;
  Email: string;
  Role: string;
}

export interface AuthResponse {
  token: string;
  user: BasicUserInfo;
}

export interface BasicAccountInfo {
  _id: string;
  Domain: string;
  CompanyName: string;
}
