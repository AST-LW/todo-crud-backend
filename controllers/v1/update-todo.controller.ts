import { Request, Response } from "express";
import { asyncWrapper } from "../../utilities/app/async.wrapper";
import { StatusCodes } from "http-status-codes";
import momentTimezone from "moment-timezone";

import supabase from "../../utilities/app/supabase-client";

export const updateTodoController = {
    put: asyncWrapper(async (req: Request, res: Response) => {
        const { todoID } = req.params;
        const { title, description } = req.body;

        try {
            // Check if todo exists
            const { data: existingTodo, error: todoError } = await supabase
                .from("todos")
                .select("*")
                .eq("todo_id", todoID)
                .select();

            if (todoError) {
                throw new Error(todoError.message);
            }

            if (!existingTodo) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    error: "Todo not found.",
                });
            }

            const updateTodo = {
                ...existingTodo[0],
                title,
                description,
                created_at: momentTimezone().tz("Asia/Kolkata").format(),
            };

            // Update todo with provided data
            const { data: updatedTodo, error: updateError } = await supabase
                .from("todos")
                .update({ ...updateTodo })
                .eq("todo_id", updateTodo["todo_id"])
                .select();

            if (updateError) {
                throw new Error(updateError.message);
            }

            return res.status(StatusCodes.OK).json({
                message: "Todo updated successfully",
                updatedTodo,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: (error as any).message,
            });
        }
    }),
};
