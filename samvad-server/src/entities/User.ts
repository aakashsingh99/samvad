import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import {ObjectType, Field, Int} from 'type-graphql'

//Field : Exposes that Field to graphql schema

@ObjectType()
@Entity()
export class User {
    [OptionalProps]?: "title" | "updatedAt" | "createdAt";

    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: 'date'})
    createdAt = new Date();

    @Field(() => String)
    @Property({ type:'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({type:'text', unique: true})
    username!: string;

    @Property({type:'text'})
    password!: string;
}