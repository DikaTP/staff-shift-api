import { Application, Router } from "express";
import { shiftRouter } from "./shifts";

export const useRoutes = (app: Application) => {
    const apiRouter = Router()
    apiRouter.use('/shift', shiftRouter)

    app.use('/api/v1', apiRouter)
}