import dotenv from 'dotenv'
dotenv.config()

import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { useRoutes } from './routes'
import { initData } from './services/database'

const app =  express()
const HTTP_PORT = process.env.HTTP_PORT || '8080'

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

initData()
useRoutes(app)

app.listen(HTTP_PORT, () => {
    return console.log(`Server running at http://localhost:${HTTP_PORT}`)
});

app.use((_request: Request, response :Response) => {
    response.status(404).json({ error: 'Not found' })
})
