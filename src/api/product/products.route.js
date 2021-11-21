import express from 'express'
import productController from './products.controller.js';
import '../../middlewares/passport.js'
const router = express.Router();
router.get('/',productController.all)
router.get('/sync',productController.sync)
router.get('/reset',productController.reset)
export default router;