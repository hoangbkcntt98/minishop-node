import User from '../../models/user.model.js'
const userServices = {
    createUser : async() =>{
        const user = new User({
            username:"hoangbk"
        })
        await user.save()
    }
}
export default userServices;
