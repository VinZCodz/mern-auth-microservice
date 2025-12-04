import type { Repository } from 'typeorm'
import type { UserData } from '../types'
import type { User } from '../entity/User'
import { Roles } from '../constants'
import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'

export class UserService {
    constructor(private readonly userRepository: Repository<User>) {}

    public create = async ({
        firstName,
        lastName,
        email,
        password,
    }: UserData) => {
        const user = await this.userRepository.findOneBy({ email })

        if (user) {
            throw createHttpError(400, 'E-Mail already exists!')
        }

        const saltRounds = 10
        const hashedPW = await bcrypt.hash(password, saltRounds)

        return await this.userRepository.save({
            firstName,
            lastName,
            email,
            password: hashedPW,
            role: Roles.CUSTOMER,
        })
    }
}
