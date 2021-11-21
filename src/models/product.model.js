
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const productSchema = new Schema(
    {
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
                custom_id:{
                    type:String
                },
                fields: [
                    {
                        name: String,
                        value: String
                    }
                ],
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
