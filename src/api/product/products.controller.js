import productServices from "./products.service.js";
const productController = {
    reset: async(req,res) =>{
        try{
            await productServices.reset();
            return res.status(200).json({
                content:"delete all"
            })
        }catch(err){
            return res.status(500).json({
                error:err
            })
        }
    },
    all: async(req,res) =>{
        try{
            var products =  await productServices.all();
            return res.status(200).json({
                content: products
            })
        }catch(err){
            return res.status(500).json({
                error:err
            })
        }
    },
    sync : async(req,res) =>{
        try{
            var products = await productServices.sync();
            return res.status(200).json((
                {
                    content:products
                }
            ))
        }catch(err){
            return res.status(500).json(
                {
                    error:err
                }
            )
        }
     
    }
}
export default productController