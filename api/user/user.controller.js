import userService from './user.service.js'
const  userController = {
    createUser : async(req,res) =>{
        try{
            const user = await  userService.createUser();
            res.status(200).json({
                success:true,
                messages:'ok',
                content: user
            })
        }catch(error){
            console.log(error);
        }
    }
}
export default userController;