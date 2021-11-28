import mongoose from 'mongoose'
const Schema = mongoose.Schema
const AttributeSchema = new Schema(
    {
        attribute_type: String,
        display: String,
        code: String,
        sub_type:Number
    },
    {
        timestamps: true,
    }

)


const Attribute = mongoose.model('product_attributes', AttributeSchema);
export default Attribute;
