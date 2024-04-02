import { Request, Response } from "express";
import { asyncWrapper } from "../../utilities/app/async.wrapper";
import { StatusCodes } from "http-status-codes";

import supabase from "../../utilities/app/supabase-client";

export const createTodoController = asyncWrapper(async (req: Request, res: Response) => {
    const { user_id: userID } = req as any;

    const { title, description } = req.body;

    // Check if title and description are provided
    if (!title || !description) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Title and description are required.",
        });
    }

    let { data: todos, error } = await supabase.from("todos").select("*").eq("title", title).eq("user_id", userID);
    if (todos?.length !== 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Duplicate title",
        });
    }
    try {
        const { data, error } = await supabase
            .from("todos")
            .insert([{ user_id: userID, title: title, description: description, status: "not_started" }])
            .select();
        if (error) {
            throw new Error(error.message);
        }

        return res.status(StatusCodes.OK).json({
            ...data[0],
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: (error as any).message,
        });
    }
});
