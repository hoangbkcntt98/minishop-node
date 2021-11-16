import User from '../../models/user.model.js'
import bcrypt from 'bcrypt'
const userServices = {
    deleteAll : async() =>{
        await User.deleteMany();
    },
    loginWithFacebook : async(id) =>{
        var user = await User.findOne({facebookId:id})
        if(user){
            return {
                user:await user.toAuthJSON(),
                token:await user.generateJWT()
            }
        }
        return {
            error: "login facebook failure"
        }
    },
    loginWithGoogle : async(email) =>{
        var user = await User.findOne({email:email})
        if(user){
            let token = user.generateJWT();
            return {
                user:await user.toAuthJSON(),
                token:token
            }
        }
        return {
            error: "login google failure"
        }
    },
    delete: async(userId)=>{
        return await User.findByIdAndDelete(userId)
    } ,
    all: async () =>{
        return await User.find({})
    },
    createUser : async(data) =>{
        const saltRounds = 10;
        const {email,password,phone,name} = data
        const passwordHashed = await bcrypt.hash(password,saltRounds)
        const user = new User({
            email:email,
            password:passwordHashed,
            phone:phone,
            name:name
        })
        await user.save()
    },
    login : async(data) =>{
        try{
            const {email,password } = data;
            console.log(email,password)
            let user = await User.findOne({email:email})
            let compare = await user.isValidPassword(password)
            console.log(compare)
            if(user&&compare){
                var token =  await user.generateJWT()
                var userInfo = await user.toAuthJSON();
                // console.log(token)
                return userInfo
            }
            return null ;
        }catch(err){
            console.log(err)
        }
       
    }
}
export default userServices;
