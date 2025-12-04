import request from 'supertest'
import app from '../../src/app'
import { AppDataSource } from '../../src/config/data-source.ts'
import { DataSource } from 'typeorm'
import { Roles } from '../../src/constants'
import { User } from '../../src/entity/User.ts'

let dataSource: DataSource

beforeAll(async () => {
    dataSource = await AppDataSource.initialize()
})

beforeEach(async () => {
    await dataSource.dropDatabase()
    await dataSource.synchronize()
    // await truncateTables(dataSource)
})

describe('POST /auth/register', () => {
    describe('Given all fields', () => {
        it('should return 201 status code', async () => {
            //Arrange
            const usersData = {
                firstName: 'vin',
                lastName: 'z',
                email: 'vinz@hotmail.com',
                password: 'secrete',
            }

            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(usersData)

            //Assert
            expect(response.statusCode).toBe(201)
        })

        it('should return json response', async () => {
            //Arrange
            const usersData = {
                firstName: 'vin',
                lastName: 'z',
                email: 'vinz@hotmail.com',
                password: 'secrete',
            }

            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(usersData)

            //Assert
            expect(response.headers['content-type']).toContain('json')
        })

        it('should persist the user to database', async () => {
            //Arrange
            const usersData = {
                firstName: 'vin',
                lastName: 'z',
                email: 'vinz@hotmail.com',
                password: 'secrete',
            }

            //Act
            await request(app).post('/auth/register').send(usersData)

            //Assert
            const userRepository = dataSource.getRepository(User)
            const users = await userRepository.find()

            expect(users).toHaveLength(1)
            expect(users[0].firstName).toBe(usersData.firstName)
            expect(users[0].lastName).toBe(usersData.lastName)
            expect(users[0].email).toBe(usersData.email)
        })

        it('should return the id of the persisted user', async () => {
            //Arrange
            const usersData = {
                firstName: 'vin',
                lastName: 'z',
                email: 'vinz@hotmail.com',
                password: 'secrete',
            }

            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(usersData)

            //Assert
            const userRepository = dataSource.getRepository(User)
            const users = await userRepository.find()

            expect(response.body).toHaveProperty('id')
            expect(response.body.id).toBe(users[0].id)
        })

        it('should assign customer role to user', async () => {
            //Arrange
            const usersData = {
                firstName: 'vin',
                lastName: 'z',
                email: 'vinz@hotmail.com',
                password: 'secrete',
            }

            //Act
            await request(app).post('/auth/register').send(usersData)

            //Assert
            const userRepository = dataSource.getRepository(User)
            const users = await userRepository.find()

            expect(users[0]).toHaveProperty('role')
            expect(users[0].role).toBe(Roles.CUSTOMER)
        })

        it('should save hashed pw of the user', async () => {
            //Arrange
            const usersData = {
                firstName: 'vin',
                lastName: 'z',
                email: 'vinz@hotmail.com',
                password: 'secrete',
            }

            //Act
            await request(app).post('/auth/register').send(usersData)

            //Assert
            const userRepository = dataSource.getRepository(User)
            const users = await userRepository.find()

            expect(users[0].password).not.toBe(usersData.password)
            expect(users[0].password).toHaveLength(60)
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/)
        })

        it('should return 400 status code if email of the user exists', async () => {
            //Arrange
            const usersData = {
                firstName: 'vin',
                lastName: 'z',
                email: 'vinz@hotmail.com',
                password: 'secrete',
            }
            const userRepository = dataSource.getRepository(User)
            await userRepository.save({ ...usersData, role: Roles.CUSTOMER })

            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(usersData)

            //Assert
            expect(response.statusCode).toBe(400)

            const users = await userRepository.find()
            expect(users).toHaveLength(1)
        })
    })

    describe('Missing fields', () => {})
})

afterAll(async () => {
    if (dataSource?.destroy) {
        await dataSource.destroy()
    }
})
