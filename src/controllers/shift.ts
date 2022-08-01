import { Request, Response } from "express";
import { Shift, shiftModel} from "../models/shifts";
import { badRequest, dataNotFound, internalError } from "../services/helper";

const getShifts = (request: Request, response: Response) => {
    let page: any = request.query.page ?? 1
    let limit: any = request.query.limit ?? 10
    {
        if( isNaN(+page) || isNaN(+limit)) {
            return badRequest(response, 'invalid query string value!')
        }
    }
    page = parseInt(page)
    limit = parseInt(limit)
    let offset = (page - 1) * limit
    shiftModel.getShifts(offset, limit).then((shifts) => {
        shiftModel.getTotal().then((total) => {
            return response.json({
                shifts: shifts,
                page: page,
                limit: limit,
                total: total,
                total_page: Math.ceil(total / limit),
                total_display: shifts.length
            })
        }).catch(err => internalError(response, err))
    }).catch(err => internalError(response, err))
}

const getShift = (request: Request, response: Response) => {
    const id = parseInt(request.params.id)
    {
        if(id < 0) return badRequest(response, 'invalid id!')
    }

    shiftModel.getShift(id).then((shift) => {
        if(shift) return response.json(shift)
        else return dataNotFound(response, 'data not found.')
    }).catch(err => internalError(response, err))
}

const insertShift = async (request: Request, response: Response) => {
    {
        const shift = request.body
        if(!shift) return badRequest(response, 'Invalid')
        if(!shift.name) return badRequest(response, 'name cannot be empty!')
        if(!shift.date) return badRequest(response, 'date cannot be empty!')
        if(!shift.start_time) return badRequest(response, 'start time cannot be empty!')
        if(!shift.end_time) return badRequest(response, 'end time cannot be empty!')

        const shiftExist = await shiftModel.getExistingShift(shift.date, shift.start_time, shift.end_time, 0)
        if(shiftExist) return badRequest(response, 'shift\'s start time or end time clashing with existing shift!')
    }

    const shift = request.body as Shift
    shiftModel.insertShift(shift).then((shift) => {
        return response.json({shift})
    }).catch(err => internalError(response, err))
}

const updateShift = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id)
    {
        if(id < 0) return badRequest(response, 'invalid id!')
        
        const shift = request.body
        if(!shift) return badRequest(response, 'Invalid')
        if(!shift.name) return badRequest(response, 'name cannot be empty!')
        if(!shift.date) return badRequest(response, 'date cannot be empty!')
        if(!shift.start_time) return badRequest(response, 'start time cannot be empty!')
        if(!shift.end_time) return badRequest(response, 'end time cannot be empty!')

        const shiftToUpdate = await shiftModel.getShift(id)
        if(!shiftToUpdate) return dataNotFound(response, 'data not found.')

        const shiftExist = await shiftModel.getExistingShift(shift.date, shift.start_time, shift.end_time, 0)
        if(shiftExist) return badRequest(response, 'shift\'s start time or end time clashing with existing shift!')
    }

    const shift = request.body as Shift
    shift.id = id
    shiftModel.updateShift(shift).then((shift) => {
        return response.json({shift})
    }).catch(err => internalError(response, err))
}

const deleteShift = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id)
    {
        if(id < 0) return badRequest(response, 'invalid id!')

        const shiftToDelete = await shiftModel.getShift(id)
        if(!shiftToDelete) return dataNotFound(response, 'data not found.')
    }

    shiftModel.deleteShift(id).then(() => {
        return response.sendStatus(200)
    }).catch(err => internalError(response, err))
}

export const shiftController = {
    getShifts,
    getShift,
    insertShift,
    updateShift,
    deleteShift
}