/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT: string;
    readonly DATABASE_PORT?: string;
    readonly DATABASE_HOST?: string;
    readonly DATABASE_USER?: string;
    readonly DATABASE_PASSWORD?: string;
    readonly DATABASE_NAME?: string;
    readonly DATABASE_ACL_NAME?: string;
    readonly DATABASE_SYNC?: 'true' | 'false';
    readonly DATABASE_LOGGING?: 'true' | 'false';

    // Amazon
    readonly AWS_ACCESS_KEY_ID?: string;
    readonly AWS_SECRET_KEY_ACCESS?: string;
    readonly AWS_S3_BUCKET_NAME?: string;
  }
}
