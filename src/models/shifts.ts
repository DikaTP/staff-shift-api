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
    let shifts = await query(`SELECT * FROM shifts WHERE (is_deleted IS NULL or is_deleted != 'true') ORDER BY date ASC, start_time ASC LIMIT ?, ?`, [offset, limit])
    return shifts as Shift[]
}

const getTotal = async () => {
    let total = await selectFirst(`SELECT count(*) as total FROM shifts  WHERE (is_deleted IS NULL or is_deleted != 'true')`)
    return total['total']
}

const getShift = async (id: number) => {
    let shift = await selectFirst(`SELECT * FROM shifts WHERE (is_deleted IS NULL or is_deleted != 'true') and id = ?`, [id])
    return shift as unknown as Shift
}

const getExistingShift = async (date :string, start_time :string, end_time :string, id :number) => {
    let shift = await selectFirst(`SELECT *, date || ' ' || start_time || ':00' as start, date || ' ' || end_time || ':00' as end FROM shifts WHERE (is_deleted IS NULL or is_deleted != 'true') and id != ? and date = ? and (? between start and end or ? between start and end)`, [id, date, date + ' ' + start_time + ':00', date + ' ' + end_time + ':00'])
    return shift as Shift
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
    await query(`UPDATE shifts set name = ?, date = ?, start_time = ?, end_time = ? WHERE (is_deleted IS NULL or is_deleted != 'true') and id = ?`, [
        shift.name,
        shift.date,
        shift.start_time,
        shift.end_time,
        shift.id
    ])

    return getShift(shift.id)
}

const deleteShift = async (id: number) => {
    await query(`UPDATE shifts set is_deleted = 'true' WHERE (is_deleted IS NULL or is_deleted != 'true') and id = ?`, [id]) 
}

export const shiftModel = {
    getShifts,
    getTotal,
    getShift,
    getExistingShift,
    insertShift,
    updateShift,
    deleteShift
}