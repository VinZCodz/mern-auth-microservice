import winston from 'winston'
import { Config } from './index.ts'

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: {
        serviceName: 'service',
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
            silent: Config.NODE_ENV === 'prod',
        }),
        new winston.transports.File({
            level: 'error',
            dirname: 'logs',
            filename: 'error.log',
            silent: Config.NODE_ENV === 'dev',
        }),
        new winston.transports.File({
            level: 'info',
            dirname: 'logs',
            filename: 'combined.log',
            silent: Config.NODE_ENV === 'dev',
        }),
    ],
})

export default logger
