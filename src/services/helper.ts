import { Response } from "express"

export const getDateString = (date: Date) => {
    const map: any = {
        dd: ('0' + date.getDate()).slice(-2),
        mm: ('0' + (date.getMonth()+1)).slice(-2),
        yyyy: date.getFullYear()
    }

    return 'yyyy-mm-dd'.replace(/mm|dd|yyyy/gi, matched => map[matched])
}

export const dataNotFound = (response: Response, err: string) => {[
    response.status(404).json({message: err})
]}

export const badRequest = (response: Response, err: string) => {
    response.status(400).json({message: err})
}

export const internalError = (response: Response, err: Error) => {
    response.status(500).json({message: err.message})
}