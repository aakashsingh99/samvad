import { Request, Response } from "express";
import { Connection, IDatabaseDriver,EntityManager } from "@mikro-orm/core";

export type MyContext = {
    req: Request;
    res: Response;
    em: EntityManager<IDatabaseDriver<Connection>>
}