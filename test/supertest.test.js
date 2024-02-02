import chai from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import dotenv from 'dotenv'
import { createHash } from '../src/utils/bcrypt.js';

const expect = chai.expect

const requester = supertest('http://localhost:8080')

await mongoose.connect('mongodb+srv://gbonardo:MDBG45t0n99@cluster0.2wx3ldq.mongodb.net/?retryWrites=true&w=majority')

let token = null;
let cookie = {}

describe('Test Users Session api/session', function(){
    
    it('Ruta: api/session/register con  Metodo POST', async function() {
        this.timeout(5000);
        const newPassword = createHash('1234');
        const newUser = {
            first_name: "test3",
            last_name: "test",
            age: 37,
            email: "test3@test15.com",
            password: newPassword
        }

        const { statusCode, _body } = await requester.post('/api/sessions/register').send(newUser)
        console.log(_body)
        expect(statusCode).to.equal(200)
        expect( _body.mensaje).to.be.equal('Usuario registrado')
    })

    it('Ruta: api/session/login con  Metodo POST', async function () {
        this.timeout(5000);
        const user = {
            email: "test@test.com",
            password: "test"
        }
        
        const resultado = await requester.post('/api/sessions/login').send(user);

        const cookieResult = resultado.headers['set-cookie'][0];

        expect(cookieResult).to.be.ok;

        cookie = {
            name: cookieResult.split("=")[0],
            value: resultado._body.token
        }
        expect(cookie.name).to.be.ok.and.equal('jwtCookie');
        expect(cookie.value).to.be.ok;
    }) 

    
    it('Ruta api/sessions/current con metodo GET', async() => {

        const {statusCode, _body} = await requester.get('/api/sessions/current').set('authorization', `${cookie.value}`);
        //console.log(_body)
        //console.log(_body.email)
        expect(_body.user.user.email).to.be.equal('test@test.com');
        expect(statusCode).to.be.equal(200);

    })
})

describe('test de la ruta productos de api/products', function () {
    this.timeout(10000);
    it('Ruta: api/products metodo GET', async () => {

        const { ok } = await requester.get('/api/products');
        expect(ok).to.be.ok;
    })

    it('Ruta: api/products metodo POST', async () => {
        const newProduct = {
            title: 'Prueba2',
            description: 'prueba2 ',
            code: 'ABCD',
            price: 200,
            stock: 100,
            category: 'Prueba'
        }


        const { statusCode, _body, ok } = await requester.post('/api/products').set('authorization', `${cookie.value}`).send(newProduct);

        //consultar por los tres valores para ver si el test pasa o no

        expect(statusCode).to.be.equal(201);
        expect(_body.status).to.be.equal(true);
        expect(ok).to.be.ok;

    })

    it('Ruta: api/products metodo PUT', async () => {
        const id = '65b6e82052aae93ff9bc43b7'
        const productUpdate = {
            title: 'Prueba - Actualizado',
            description: 'prueba ',
            code: 'AA150AA3',
            price: 200,
            stock: 10,
            category: 'Prueba'
        }

        const { statusCode } = await requester.put(`/api/products/${id}`).set('authorization', `${cookie.value}`).send(productUpdate);

        expect(statusCode).to.be.equal(201);
    })

    it('Ruta: api/products metodo DELETE', async () => {
        const id = '65b6ea23bb4b0d3180511bde'
        const { statusCode } = await requester.delete(`/api/products/${id}`).set('authorization', `${cookie.value}`);

        expect(statusCode).to.be.equal(201);
    })

})

describe('test de la ruta carts de api/carts', function () {
    this.timeout(5000);

    it('Ruta: api/carts metodo POST', async () => {
        const cid = '65b6531985982b14e6cf32aa';
        const pid = '65061e92642a11bc481dd88c';

        const { statusCode, ok, _body } = await requester.post(`/api/carts/${cid}/product/${pid}`).set('authorization', `${cookie.value}`).send({ quantity: 1 });

        expect(ok).to.be.equal(true);
        expect(_body.respuesta).to.be.equal('ok');
        expect(statusCode).to.be.equal(200);
    })
})