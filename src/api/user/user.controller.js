import userService from './user.service.js'
const userController = {
    delete: async (req,res) =>{
        try{
            console.log(req.params.id)
            var user = await userService.delete(req.params.id);
            res.status(200).json({
                messages:"Deleted user" + user.name
            })

        }catch(err){
            res.status(400).json({
                messages: err
            })
        }
    },
    all: async (req,res) =>{
        try{
            var users = await userService.all()
            res.status(200).json({
                messages:"all users",
                content: users
            })
        }catch(err){
            res.status(500).json({
                messages:err
            })
        }
    },
    login: async (req, res) => {
        try {
            console.log(req.body)
            var user = await userService.login(req.body);
            res.status(200).json({
                success: "login success",
                content: user
            })
        } catch (err) {
            console.log(err)
        }
    },
    signup: async (req, res, next) => {
        try {
            console.log(req.body)
            var newUser = await userService.createUser(req.body)
            res.status(200).json({
                message: 'Signup successful',
                user: req.user
            });
        } catch (err) {
            res.status(200).json({
                message:'erorr',
                error:err
            })
            console.log(err)
        }
    },
    loginWithGoogle:async(req,res) =>{
        try{
            var response = await userService.loginWithGoogle(req.user.email);
            return res.json({
                message:"login ok",
                content: response
            })
        }catch(err){
            console.log(err)
        }
    },
    loginWithFacebook : async(req,res) =>{
        try{
            
            // var response = await userService.loginWithFacebook(req.user.facebookId)
            return res.json({
                content: req.user,
                message:"login facebook ok"
                // content:req.user
            })
        }catch(error){
            console.log(error)
        }
    }
    ,
    deleteAll : async(req,res) =>{
        try{
            await userService.deleteAll();
            return res.json({
                content:"delete okd"
            })
        }catch(err){
            return res.json({
                error:err
            })
        }
    }
}
export default userController;