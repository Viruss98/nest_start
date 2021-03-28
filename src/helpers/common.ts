import { Sonyflake, Epoch } from 'sonyflake';

export const snowflake = new Sonyflake({
  machineId: 1,
  epoch: Epoch.TWITTER, // timestamp
});

export const encode = (str: string): string => {
  return Buffer.from(str, 'utf8').toString('base64');
};

export const decode = (str: string): string => {
  return Buffer.from(str, 'base64').toString('utf8');
};
