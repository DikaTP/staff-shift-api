import sqlite3 from 'sqlite3'
import {getDateString} from './helper'

const DBSOURCE = process.env.DBSOURCE
if(!DBSOURCE) throw new Error('DB NOT FOUND')

export const openConn = () => {
    let db = new sqlite3.Database(DBSOURCE)
    return db
}

export const query = async (queryString: string, params?: any[]) => {
    let db = openConn()
    try {
        return await new Promise<any[]>((resolve, reject) => {
            db.all(queryString, params, (error, rows) => {
                if (error)
                    reject(error)
                else
                    resolve(rows)
            })
        })
    } finally {
        db.close()
    }
}

export const selectFirst = async (queryString: string, params?: any[]) => {
    const queryResult = await query(queryString, params)
    return queryResult[0]
}

export const initData = () => {
    console.log('Initiate Data')
    let db = openConn()
    db.run(`CREATE TABLE shifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        is_deleted TEXT 
        )`,
    (err :any) => {
        if (err) {
            console.log('Table already created')
        }else{
            const insert = db.prepare('INSERT INTO shifts (name, date, start_time, end_time) VALUES (?,?,?,?)')
            for (let i = 0; i < 30; i++) {
                let name = i % 2 == 0 ? "Morning Shift" : "Night Shift" 
                let date = new Date()
                date.setDate(date.getDate() + (i/2))
                let dateString = getDateString(date)
                let start_time = i % 2 == 0 ? '07:00' : '15:00'
                let end_time = i % 2 == 0 ? '15:00' : '23:00'
                insert.run([name, dateString, start_time, end_time])
            }
            insert.finalize()
            console.log('Finish inserting data')
        }
    });
}