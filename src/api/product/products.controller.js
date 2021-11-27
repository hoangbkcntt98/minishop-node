import productServices from "./products.service.js";
const productController = {
    getCategories : async(req,res) =>{
        try{
            let categories = await productServices.getCategories()
            return res.json({
                content:categories
            })
        }catch(err){
            return res.json({
                error: err
            })
        }
    },
    get: async(req,res) =>{
        try{
            console.log(req.params.id)
            let data =  await productServices.get(req.params.id)
            return res.json({
                content: data
            })

        }catch(error){
            return res.json({
                error:error,
                message:'get product error'
            })
        }
    },
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
            console.log(req.query)
            let params = req.query?req.query:undefined;
            var data =  await productServices.all(params);
            // console.log('data',data)
            return res.status(200).json({
                content: data,
                message:"get product ok"
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