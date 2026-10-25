export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";

export interface AdminUser {
  id: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountStatus: AccountStatus;
  provider: string;
  roles: string[];
  profile: {
    firstName: string;
    lastName: string;
    username: string;
    city: string | null;
    profileImage: string | null;
    trustScore: number | null;
  } | null;
  lastLogin: string | null;
  createdAt: string;
  isDeleted: boolean;
}

export interface AdminUserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: AccountStatus;
  city?: string;
  verified?: boolean;
  role?: string;
}
