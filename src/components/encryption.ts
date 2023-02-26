import { EncryptionPayload } from '@/types';
import bcrypt from 'bcrypt';
import getConfig from '@/components/getConfig';

const { SALT_ROUNDS } = getConfig();

if (!SALT_ROUNDS) {
  throw new Error('Unable to start server. Missing SALT_ROUNDS.');
}

export const encryptPassword = async (password: string): Promise<EncryptionPayload> => {
  const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
}

export default { encryptPassword };
