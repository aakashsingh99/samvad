import { Options } from '@mikro-orm/core';
import { Post } from "./entities/Post";
import path from 'path';
import { User } from './entities/User';

const config: Options = {
    migrations: {
        path: path.join(__dirname,'./migrations'),
        glob: '!(*.d).{js,ts}'
    },
    entities: [Post, User],
    dbName: 'samvad2db',
    user: 'aakas',
    password: 'password',
    debug: process.env.ENVIRONMENT === "DEV",
    type: 'postgresql'
};

export default config;