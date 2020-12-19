import crypto from 'crypto';

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export const hashPassword = (password: string, salt: string): string => {
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH);
  return hash.toString('hex');
};

export const generateSalt = (): string => {
  const salt = crypto.randomBytes(SALT_LENGTH);
  return salt.toString('hex');
}



