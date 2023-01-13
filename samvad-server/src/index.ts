import * as dotenv from 'dotenv'
dotenv.config()

import { MikroORM } from "@mikro-orm/core";
// import { Post } from './entities/Post';
import mikroOrmConfig from './mikro-orm.config';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

// import redis from 'redis'
// import session from "express-session";
// import connectRedis from 'connect-redis';

//https://javascript.plainenglish.io/authentication-and-authorization-with-jwt-in-a-graphql-server-d9cf6085f961

//MikroORM.init() returns a promise

//Cant use await in a top level function
//Reoslution: put all your code in a function

const main = async () => {
    const orm  = await MikroORM.init(mikroOrmConfig);   //create db
    await orm.getMigrator().up();                       //run migrations

    const emFork = orm.em.fork();                       //https://stackoverflow.com/a/72799993

    // const post = emFork.create(Post, {title: 'Third post'});
    // await emFork.persistAndFlush(post);
        
    // const posts = await emFork.find(Post, {});
    // console.log(posts);

    const app = express();

    // app.get('/', (_,res)=>{
    //     res.send('Server running');
    // })

    // const RedisStore = connectRedis(session)
    // const redisClient = redis.createClient({
    //     url: '127.0.0.1:6379'
    // });

    // app.use(
    //     session({
    //         store: new RedisStore({ client: redisClient }),
    //         saveUninitialized: false,
    //         secret: "keyboard cat",
    //         resave: false,
    //     })
    // )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: () => ({em: emFork})
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({app});

    app.listen(4000, ()=> {
        console.log('Server started on localhost:4000');
    })
}

main();
console.log('@ENV '+process.env.ENVIRONMENT);
console.log("Hello World");