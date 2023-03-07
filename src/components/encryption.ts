import bcrypt from 'bcrypt';
import getConfig from '@/components/getConfig';

const { SALT_ROUNDS } = getConfig();

if (!SALT_ROUNDS) {
  throw new Error('Unable to start server. Missing SALT_ROUNDS.');
}

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export const isPasswordValid = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
}

export default {
  encryptPassword,
  isPasswordValid,
};
