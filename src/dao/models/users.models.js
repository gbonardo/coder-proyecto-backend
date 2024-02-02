import { Schema, model } from "mongoose";
import { cartModel } from './carts.models.js'
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    last_connection: {
        type : Date,
        default: Date.now
    },
    documents:[{
        name: String,
        reference: String
    }]
})

userSchema.plugin(mongoosePaginate)

userSchema.pre('save', async function(next) {
    try{
        const newCart = await cartModel.create({})
        this.cart = newCart._id
    } catch(error) {
        next(error)
    }
})

userSchema.pre(['save', 'findOneAndUpdate'], function(next) {
    this.last_connection = Date.now();
    next();
});

//const userModel = model('users', userSchema)
//export default userModel 

export const userModel = model('users', userSchema)