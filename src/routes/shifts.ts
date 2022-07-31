import { Router } from "express"
import { shiftController } from "../controllers/shift"

const shiftRouter = Router()
shiftRouter.get('/', shiftController.getShifts)
shiftRouter.get('/:id', shiftController.getShift)
shiftRouter.post('/', shiftController.insertShift)
shiftRouter.put('/:id', shiftController.updateShift)
shiftRouter.delete('/:id', shiftController.deleteShift)

export {
    shiftRouter
}