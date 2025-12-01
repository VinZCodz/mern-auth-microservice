import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express'
import 'reflect-metadata'
import { HttpError } from 'http-errors'
import logger from './config/logger.ts'
import authRouter from './routes/auth.ts'

const app = express()

app.get('/', (req, res) => {
    return res.send('Welcome to Authentication endpoints!')
})

/*
Middleware: for our service routes. 
*/
app.use('/auth', authRouter)

/*
Global error handler.
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack)

    res.status(err.statusCode).json({
        errors: [
            {
                type: err.name,
                message: err.message,
                path: '',
                location: '',
            },
        ],
    })
})

export default app
