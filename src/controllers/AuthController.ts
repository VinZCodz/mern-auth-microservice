import type { Response } from 'express'
import type RegisterUserRequest from '../types'
import type { UserService } from '../services/UserService.ts'

export class AuthController {
    constructor(private readonly userService: UserService) {}

    async register(req: RegisterUserRequest, res: Response) {
        await this.userService.create(req.body)
        res.status(201).json()
    }
}
