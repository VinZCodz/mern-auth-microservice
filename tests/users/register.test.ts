import request from 'supertest'
import app from '../../src/app'
import { AppDataSource } from '../../src/config/data-source.ts'
import { DataSource } from 'typeorm'
import { User } from '../../src/entity/User.ts'
import { truncateTables } from '../utils/index.ts'

let dataSource: DataSource

beforeAll(async () => {
    dataSource = await AppDataSource.initialize()
})

beforeEach(async () => {
    await truncateTables(dataSource)
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
            const userTable = dataSource.getRepository(User)
            const users = await userTable.find()

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
            const userTable = dataSource.getRepository(User)
            const users = await userTable.find()

            expect(response.body).toHaveProperty('id')
            expect(response.body.id).toBe(users[0].id)
        })
    })

    describe('Missing fields', () => {})
})

afterAll(async () => {
    if (dataSource?.destroy) {
        await dataSource.destroy()
    }
})
