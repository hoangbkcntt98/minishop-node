import express from 'express'
import userController from "./user.controller.js"
import passport from 'passport';
import '../../middlewares/passport.js'
const router = express.Router();
router.get("/", passport.authenticate('jwt',{session:false}),userController.all)
router.delete("/:id", userController.delete)
router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.get("/secret", passport.authenticate('jwt', { session: false }), userController.all)
router.get("/error", (req, res) => {
    res.json(500).json({
        message: "errors"
    })
})
router.get('/auth/google/success',userController.googleAuthSuccess);
router.get('/auth/google',
    passport.authenticate('google',
        {
            scope: ['email', 'profile'],
        }
    ));
router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/error',
        successFlash: true,
        session: false
    }),
    userController.loginWithGoogle
);
router.get('/auth/facebook',
    passport.authenticate('facebook',
        {
            scope:'email',
        }));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        // successRedirect: '/user/google_success',
        failureRedirect: '/error',
        // successFlash: true,
        session: false
    }),
    userController.loginWithFacebook
);
router.get('/reset',userController.deleteAll)
export default router;