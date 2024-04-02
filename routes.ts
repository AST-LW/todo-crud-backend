import express, { NextFunction, Request, Response } from "express";

import { createTodoController } from "./controllers/v1/create-todo.controller";
import { readTodoController } from "./controllers/v1/read-todo.controller";
import { updateTodoController } from "./controllers/v1/update-todo.controller";
import { deleteTodoController } from "./controllers/v1/delete-todo.controller";
import { statusUpdateController } from "./controllers/v1/status-change.controller";

// Create an Express router
const router = express.Router();

// Define a middleware function for loading version-specific routes
export const loadRouterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Extract the API version from the request parameters
    const version = req.params.version;

    // Check the API version and define routes accordingly
    switch (version) {
        case "v1":
            // If the version is "v1", configure routes for version 1
            router.post("/create", createTodoController);
            router.get("/read", readTodoController);
            router.patch("/status/:todoID", statusUpdateController);
            router.put("/update/:todoID", updateTodoController.put);
            router.delete("/delete/:todoID", deleteTodoController);

            // Store the router instance in the request object for later use
            (req as any).router = router;
            break;
        default:
            // If the version is not recognized, set a flag in the request object
            (req as any).versionNotFound = true;
    }

    // Continue to the next middleware in the Express middleware chain
    next();
};
