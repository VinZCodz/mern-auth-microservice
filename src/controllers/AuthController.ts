import type { Response } from 'express'
import type RegisterUserRequest from '../types'
import type { UserService } from '../services/UserService.ts'
import type { Logger } from 'winston'

export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly logger: Logger
    ) {}

    public register = async (req: RegisterUserRequest, res: Response) => {
        const user = await this.userService.create(req.body)
        this.logger.info(`User Registered id: ${user.id}`)
        res.status(201).json({ id: user.id })
    }
}
