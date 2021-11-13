
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const productSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true,
    }
    
)
const Product = mongoose.model('products',productSchema);
export default Product;
