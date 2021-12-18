
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const productSchema = new Schema(
    {
        total_quantity:Number,
        remain_quantity:Number,
        categories : [String],
        colors :[String],
        sizes:[String],
        colors_type:[String],
        sizes_type:[String],
        custom_id: {
            type: String,
            unique: true
        },
        display_id: {
            type: Number,
        },
        name: {
            type: String
        },
        product_attributes: [
            {
                name: String,
                values: [
                    String
                ]
            }
        ],
       
        variations: [
            {
                color_type:String,
                size_type:String,
                custom_id:{
                    type:String
                },
                fields: [
                    {
                        name: String,
                        value: String
                    }
                ],
                color:String,
                size:String,
                actual_remain_quantity:Number,
                defect_quantity:Number,
                remain_quantity:Number,
                returning_quantity:Number,
                shipping_quantity:Number,
                total_quantity:Number,
                images: [
                    String
                ],
                retail_price: Number,
                sellingStatus: [
                    {
                        near_out_of_stock: Boolean,
                        sell_fast: Boolean,
                        sell_slow: Boolean,
                    }

                ],
                weight:Number,
                wholesale_price:Number,
                // wholesale_price2:[Number]
            }
        ]

    },
    {
        timestamps: true,
    }

)
const Product = mongoose.model('products', productSchema);
export default Product;
