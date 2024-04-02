import { Request, Response } from "express";
import { asyncWrapper } from "../../utilities/app/async.wrapper";
import { StatusCodes } from "http-status-codes";

import supabase from "../../utilities/app/supabase-client";

export const readTodoController = asyncWrapper(async (req: Request, res: Response) => {
    const { user_id: userID } = req as any; // Assuming user ID is available in request
    const { status } = req.query;

    try {
        let todosQuery = supabase.from("todos").select("*").eq("user_id", userID);

        // If status filter is provided, add it to the query
        if (status) {
            todosQuery = todosQuery.eq("status", status);
        }

        const { data: todos, error } = await todosQuery;

        if (error) {
            throw new Error(error.message);
        }

        return res.status(StatusCodes.OK).json({
            todos,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: (error as any).message,
        });
    }
});
