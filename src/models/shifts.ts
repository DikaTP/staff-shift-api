import { query, selectFirst } from "../services/database"

export type Shift = {
    id: number,
    name: string,
    date: string,
    start_time: string,
    end_time: string,
    is_deleted: string
}

const getShifts = async (offset :any, limit :any) => {
    let shifts = await query(`SELECT * FROM shifts where (is_deleted IS NULL or is_deleted != 'true') ORDER BY date ASC, start_time ASC LIMIT ?, ?`, [offset, limit])
    return shifts as Shift[]
}

const getTotal = async () => {
    let total = await selectFirst(`SELECT count(*) as total FROM shifts  where (is_deleted IS NULL or is_deleted != 'true')`)
    return total['total']
}

const getShift = async (id: number) => {
    let shift = await selectFirst(`SELECT * FROM shifts where (is_deleted IS NULL or is_deleted != 'true') and id = ?`, [id])
    return shift as unknown as Shift
}

const insertShift = async (shift :Shift) => {
    await query('INSERT INTO shifts (name, date, start_time, end_time) VALUES (?,?,?,?)', [
        shift.name,
        shift.date,
        shift.start_time,
        shift.end_time
    ])

    let insertedShift = await query(`SELECT seq AS id FROM sqlite_sequence WHERE name='shifts'`)
    return getShift(insertedShift[0].id)
}

const updateShift =async (shift: Shift) => {
    await query(`UPDATE shifts set name = ?, date = ?, start_time = ?, end_time = ? where (is_deleted IS NULL or is_deleted != 'true') and id = ?`, [
        shift.name,
        shift.date,
        shift.start_time,
        shift.end_time,
        shift.id
    ])

    return getShift(shift.id)
}

const deleteShift = async (id: number) => {
    await query(`UPDATE shifts set is_deleted = 'true' where (is_deleted IS NULL or is_deleted != 'true') and id = ?`, [id]) 
}

export const shiftModel = {
    getShifts,
    getTotal,
    getShift,
    insertShift,
    updateShift,
    deleteShift
}