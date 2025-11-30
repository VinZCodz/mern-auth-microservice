import request from 'supertest'
import app from '../../src/app'

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

        it('should save the user info to database', async () => {
            //Arrange
            const usersData = {
                firstName: 'vin',
                lastName: 'z',
                email: 'vinz@hotmail.com',
                password: 'secrete',
            }

            //Act
            await request(app).post('/auth/register').send(usersData)
        })
    })

    describe('Missing fields', () => {})
})
