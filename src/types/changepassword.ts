export type LoginDto = {
  email: string;
  password: string;
};

export type JwtRequest = {
  userId: number;
  oldPassword: string;
  newPassword: string;
};
