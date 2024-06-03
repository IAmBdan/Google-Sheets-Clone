"use client"
import { appRouter } from "../server/api/root";
import { db } from "../server/db";
import {test , expect, describe} from 'vitest';

const headers = new Headers({ "content-type": "application/json" });

describe('publisherRoutes', () => {
    test('register publisher', async () => {
        const caller = appRouter.createCaller({ headers, db, session: null });
        const result = await caller.publisher.register({ name: "test" });
        console.log(result)
        expect(result).toBeDefined();
    });
});


// test('test' , async () => {
//   const caller = appRouter.createCaller({headers, db});
//   const result = await caller.post.create({name : "world"});
//   expect(result).toEqual({name : "world"}); 
// })