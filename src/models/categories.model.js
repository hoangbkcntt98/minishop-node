import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_CODE } from '../config/config.js'
const Schema = mongoose.Schema
const CategorySchema = new Schema(
    {
        display: String,
        code: String
    },
    {
        timestamps: true,
    }

)


const Categories = mongoose.model('categories', CategorySchema);
export default Categories;
