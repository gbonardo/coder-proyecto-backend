import chai from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import 'dotenv/config'
//import { createHash } from '../src/utils/bcrypt.js'

const expect = chai.expect

const requester = supertest('http://localhost:8080')

await mongoose.connect(`mongodb+srv://gbonardo:${process.env.MONGODB_PASS}@cluster0.2wx3ldq.mongodb.net/?retryWrites=true&w=majority`)

let token = null
let cookie = {}
let idcarttest = null
let idprodtest = '65061e92642a11bc481dd88c'

describe('test CRUD de las rutas /api/carts', function () {

    it('Inicio de sesion api/session/login con Metodo POST', async function () {
        this.timeout(10000);
        const user = {
            email: "perez@perez.com",
            password: "coderhouse"
        }
        const { statusCode, _body, ok} = await requester.post('/api/sessions/login').send(user)
        token = _body.token
        expect(statusCode).to.be.equal(200)
        expect(token).to.be.ok
    })

    it('crear un cart mediante post ', async function() { 
        this.timeout(10000)
        const { statusCode, _body, ok} = await requester.post('/api/carts')
        console.log(_body)
        idcarttest = _body.mensaje._id
        expect(statusCode).to.be.equal(200)
        
    })

    it('agregar un producto a un cart mediante POST en /carts/:cid/products/:pid', async function() { 
        this.timeout(10000)
        const quantity = {
            quantity: 1
        };
        const { statusCode, _body, ok} = await  requester.post(`/api/carts/${idcarttest}/products/${idprodtest}`).send(quantity)
        console.log(_body)
        expect(statusCode).to.be.equal(200)
    })

    it('eliminar cart mediante DELETE en /carts/:id', async function() { 
        this.timeout(10000)
        const { statusCode, _body, ok} = await requester.delete(`/api/carts/${idcarttest}`)
        expect(statusCode).to.be.equal(200)

    })
})