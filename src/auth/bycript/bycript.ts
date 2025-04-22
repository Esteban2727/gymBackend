import * as bcrypt from 'bcryptjs';

export const comparePasswords = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const HashearPassword = async (password: string) => {
  const hashedPassword: string = await bcrypt.hash(
    password,
    await bcrypt.genSalt(),
  );
  return hashedPassword;
};
