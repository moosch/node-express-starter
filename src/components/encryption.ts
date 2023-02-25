import { EncryptionPayload } from '@/types';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = process.env.SALT_ROUNDS;

if (!SALT_ROUNDS) {
  throw new Error('Unable to start server. Missing SALT_ROUNDS.');
}

export const encryptPassword = async (password: string): Promise<EncryptionPayload> => {
  const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
}

export default { encryptPassword };
