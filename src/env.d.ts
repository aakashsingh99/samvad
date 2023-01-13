declare namespace NodeJS {
    export interface ProcessEnv {
        JWT_TOKEN_SECRET: string;
        DATABASE_URL: string;
        REDIS_URL: string;
        PORT: string;
        SESSION_SECRET: string;
        CORS_ORIGIN: string;
    }
}  