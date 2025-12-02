import type { Repository } from 'typeorm'
import type { UserData } from '../types'
import type { User } from '../entity/User'

export class UserService {
    constructor(private readonly userRepository: Repository<User>) {}

    public create = async ({
        firstName,
        lastName,
        email,
        password,
    }: UserData) => {
        return await this.userRepository.save({
            firstName,
            lastName,
            email,
            password,
        })
    }
}
