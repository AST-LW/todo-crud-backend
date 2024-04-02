import { Request, Response } from "express";
import { asyncWrapper } from "../../utilities/app/async.wrapper";
import { StatusCodes } from "http-status-codes";

import supabase from "../../utilities/app/supabase-client";

export const statusUpdateController = asyncWrapper(async (req: Request, res: Response) => {
    const { user_id: userID } = req as any;
    const { todoID } = req.params;
    const { status } = req.body;

    try {
        // Check if the user has access to update this todo
        const { data: todoToUpdate } = await supabase.from("todos").select("user_id").eq("todo_id", todoID).single();
        if (!todoToUpdate || todoToUpdate.user_id !== userID) {
            return res.status(StatusCodes.FORBIDDEN).json({
                error: "You do not have permission to update this todo",
            });
        }

        // Update the status of the to-do item
        const { data: updatedTodo, error } = await supabase
            .from("todos")
            .update({ status })
            .eq("todo_id", todoID)
            .select();
        if (error) {
            throw new Error(error.message);
        }

        return res.status(StatusCodes.OK).json({
            updatedTodo,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: (error as any).message,
        });
    }
});
