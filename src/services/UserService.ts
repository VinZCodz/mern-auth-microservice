import type { Repository } from 'typeorm'
import type { UserData } from '../types'
import type { User } from '../entity/User'

export class UserService {
    constructor(private readonly userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: UserData) {
        await this.userRepository.save({ firstName, lastName, email, password })
    }
}
