import Product from '../../models/product.model.js';
import bcrypt from 'bcrypt'
import axios from 'axios'
const productServices = {
    reset : async() =>{
        await Product.deleteMany();
    },
    all: async() =>{
        var products =  await Product.find({})
        console.log(products)
        return products
    },
    sync : async(query) =>{
        
        var apiUrl = "https://pos.pages.fm/api/v1/shops/2254195/"
        const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1NmNkNTYwNS1mZWU0LTQ4NDAtODI3NS1iY2M4YTlmZjZiOGMiLCJpYXQiOjE2MzU2NzM4ODksImZiX25hbWUiOiJkZW1vIGRlbW8iLCJmYl9pZCI6bnVsbCwiZXhwIjoxNjQzNDQ5ODg5fQ.1IZ5KaD3W5M439yefj-scqHGFlONK9gOkSGKLAKVbz0"
        var products = await axios.get(apiUrl+'products',{
            params:{
                access_token: accessToken,
                page:1,
                page_size:1000
            }
        }).then(res => res.data.data)
        // products = products.data.data
        console.log('data',products);
        try{
            await Product.insertMany(products)
        }catch(err) {
            console.log(err)
        }
        return products;
    }
}
export default productServices;
