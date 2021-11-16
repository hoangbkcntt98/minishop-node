import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_CODE } from '../config/config.js'
const Schema = mongoose.Schema
const UserSchema = new Schema(
    {
        facebookId:{
            type:String
        },
        googleId:{
            type:String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            // required: true
        },
        phone: {
            type: String,
            // required: true
        },
        name: {
            type: String
        },
        avatar:{
            type:String
        }
    },
    {
        timestamps: true,
    }

)

UserSchema.methods.hashPassword = async (password) => {
    const user = this;
    this.password = await bcrypt(password)

}
UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}
UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            exp: parseInt(exp.getTime() / 1000)
        },
        SECRET_CODE
    );
};

//Method giúp trả về thông tin của user.
UserSchema.methods.toAuthJSON = function () {
    return {
        name: this.name,
        email: this.email,
        token: this.generateJWT(),
        phone: this.phone,
        
    };
};

const User = mongoose.model('users', UserSchema);
export default User;
