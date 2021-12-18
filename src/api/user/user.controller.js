import userService from './user.service.js'
const userController = {
    googleAuthSuccess: async (req, res) => {
        console.log('user from google',req.user)
        if(req.user){
            return res.status(200).json({
                messages: "Gg auth success",
                content: req.user
            })
        }else{
            return res.status(400).json({
                messages: "Not found user",
                content: undefined
            })
        }
        
    }
    ,
    delete: async (req, res) => {
        try {
            console.log(req.params.id)
            var user = await userService.delete(req.params.id);
            res.status(200).json({
                messages: "Deleted user" + user.name
            })

        } catch (err) {
            res.status(400).json({
                messages: err
            })
        }
    },
    all: async (req, res) => {
        try {
            var users = await userService.all()
            res.status(200).json({
                messages: "all users",
                content: users
            })
        } catch (err) {
            res.status(500).json({
                messages: err
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
            // console.log(req.body)
            var newUser = await userService.createUser(req.body)
            res.status(200).json({
                message: 'Signup successful!!',
                content: newUser
            });
        } catch (err) {
            res.status(500).json({
                message: 'erorr',
                content: err
            })
            console.log(err)
        }
    },
    loginWithGoogle: async (req, res) => {
        try {
            console.log('login with google')
            // console.log(req.user)
            var userData = await userService.loginWithGoogle(req.user.email);
            // console.log(req.user)
            console.log(userData)
            res.cookie('token',userData.token);
            return res.redirect('http://localhost:3000/')
        } catch (err) {
            console.log(err)
        }
    },
    loginWithFacebook: async (req, res) => {
        try {

            // var response = await userService.loginWithFacebook(req.user.facebookId)
            return res.json({
                content: req.user,
                message: "login facebook ok"
                // content:req.user
            })
        } catch (error) {
            console.log(error)
        }
    }
    ,
    deleteAll: async (req, res) => {
        try {
            await userService.deleteAll();
            return res.json({
                content: "delete okd"
            })
        } catch (err) {
            return res.json({
                error: err
            })
        }
    }
}
export default userController;