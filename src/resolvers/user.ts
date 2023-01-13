import { Resolver, Mutation, InputType, Field, Arg, Ctx, ObjectType } from 'type-graphql'
import { MyContext } from '../types'
import { User } from '../entities/User';
import argon2 from 'argon2';
import generateToken from '../utils/generateToken';

//Alternate way to take input
@InputType()
class InputUsernamePassword{
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError{
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse{
    @Field(()=> [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(()=> User, {nullable: true})
    user?: User;

    @Field(()=> String)
    token?: string;
}

@Resolver()
export class UserResolver {
    @Mutation(()=> UserResponse)
    async register(
        @Arg('options') options: InputUsernamePassword,
        @Ctx() ctx: MyContext
    ): Promise<UserResponse>{

        if(options.username.length < 3){
            return {
                errors: [{
                    field: 'username',
                    message: 'Username too short'
                }]
            }
        }
        if(options.password.length < 8){
            return {
                errors: [{
                    field: 'username',
                    message: 'Password must be atleast 8 characters'
                }]
            }
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = ctx.em.create(User, {username: options.username, password: hashedPassword});
        const token = generateToken(user.username);
        try{
            await ctx.em.persistAndFlush(user);
        } catch(e){
            console.log(e);
            if(e.code === "23505"){
                return {
                    errors: [{
                        field: 'Username',
                        message: 'Username already taken'
                    }]
                }
            }
        }
        return {
            user,
            token
        };
    }

    @Mutation(()=> UserResponse)
    async login(
        @Arg('options') options: InputUsernamePassword,
        @Ctx() ctx: MyContext
    ): Promise<UserResponse>{
        const user = await ctx.em.findOne(User, {username: options.username});
        if(!user){
            return {
                errors: [
                    {
                        field: "username",
                        message: 'Username doesnt exits'
                    }
                ]
            }
        }

        const valid = await argon2.verify(user.password, options.password);
        if(!valid){
            return {
                errors: [
                    {
                        field: "password",
                        message: 'Incorrect Password'
                    }
                ]
            }
        }

        const token = generateToken(user.username);
        return {
            user,
            token
        }
    }
}