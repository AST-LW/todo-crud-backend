import { Request, Response } from "express";
import { asyncWrapper } from "../../utilities/app/async.wrapper";
import { StatusCodes } from "http-status-codes";

import supabase from "../../utilities/app/supabase-client";

export const deleteTodoController = asyncWrapper(async (req: Request, res: Response) => {
    const { todoID } = req.params; // Assuming the todo ID is passed in the request parameters

    if (!todoID) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Todo ID is required.",
        });
    }

    try {
        const { data, error } = await supabase.from("todos").delete().eq("todo_id", todoID).select();

        console.log(error);
        if (error) {
            throw new Error(error.message);
        }

        if (data.length === 0) {
            return res.status(StatusCodes.OK).json({
                message: "Todo already deleted",
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Todo deleted successfully",
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: (error as any).message,
        });
    }
});
