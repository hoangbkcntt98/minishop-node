import Product from '../../models/product.model.js';
import bcrypt from 'bcrypt'
import axios from 'axios'
import Attribute from '../../models/atrribute.model.js'
const getColor = (color) =>{
    if(color.toUpperCase().includes("VÀNG")) return "VÀNG"
    if(color.toUpperCase().includes("ĐỎ")) return "ĐỎ"
    if(color.toUpperCase().includes("ĐEN")) return "ĐEN"
    if(color.toUpperCase().includes("XANH")) return "XANH"
    if(color.toUpperCase().includes("CAM")) return "CAM"
    if(color.toUpperCase().includes("HỒNG")) return "HỒNG"
    if(color.toUpperCase().includes("XÁM")) return "XÁM"
    if(color.toUpperCase().includes("TRẮNG")) return "TRẮNG"
    if(color.toUpperCase().includes("GHI")) return "GHI"
    if(color.toUpperCase().includes("NÂU")) return "NÂU"
    return "KHÁC"
}
const getUnique = (arr) =>{
    return Array.from(new Set(arr))
}
const extendArray = (temp,arr) =>{
    arr.forEach(a => {
        temp.push(...a)
    });
}
const getColors = (colors ) =>{
    let temp = [];
    if(colors.toUpperCase().includes("VÀNG")) temp = [...temp,"VÀNG"]
    if(colors.toUpperCase().includes("ĐỎ")) temp = [...temp,"ĐỎ"]
    if(colors.toUpperCase().includes("ĐEN")) temp = [...temp,"ĐEN"]
    if(colors.toUpperCase().includes("XANH")) temp = [...temp,"XANH"]
    if(colors.toUpperCase().includes("CAM")) temp = [...temp,"CAM"]
    if(colors.toUpperCase().includes("HỒNG")) temp = [...temp,"HỒNG"]
    if(colors.toUpperCase().includes("XÁM")) temp = [...temp,"XÁM"]
    if(colors.toUpperCase().includes("TRẮNG")) temp = [...temp,"TRẮNG"]
    if(colors.toUpperCase().includes("GHI")) temp = [...temp,"GHI"]
    if(colors.toUpperCase().includes("NÂU")) temp = [...temp,"NÂU"]
    if(
        !colors.toUpperCase().includes("VÀNG")&&
        !colors.toUpperCase().includes("ĐỎ")&&
        !colors.toUpperCase().includes("ĐEN")&&
        !colors.toUpperCase().includes("XANH")&&
        !colors.toUpperCase().includes("CAM")&&
        !colors.toUpperCase().includes("HỒNG")&&
        !colors.toUpperCase().includes("XÁM")&&
        !colors.toUpperCase().includes("TRẮNG")&&
        !colors.toUpperCase().includes("GHI")&&
        !colors.toUpperCase().includes("NÂU")
    )temp = [...temp,"KHÁC"]
    return temp
}
const getSize = (size) =>{
    if(size=='80'||size == "S") return "S"
    if(size=="90"||size == "M") return "M"
    if(size == "100" ||size == "110"|| size=="L") return "L"
    if(size == "120"|| size =="XL") return "XL"
    if(size == "130"|| size == "XXL") return "XXL"
    return "KHÁC"
}
const onlyAlphabet = (str) => {
    var regExp = /[a-zA-Z]/g;
    var testString = str

    if (regExp.test(testString)) {
        return true
        /* do something if letters are found in your string */
    } else {
        return false
        /* do something if letters are not found in your string */
    }
}
const formatCategory = (item) => {
    let indexs = [
        {
            display: "Áo Choàng",
            code: "AC",
        },
        {
            display: "Áo Khoác",
            code: "AK",
        },
        {
            display: "Quần",
            code: "AK",
        },
        {
            display: "Váy",
            code: "VAY",
        },
        {
            display: "Set",
            code: "SB",
        },
        {
            display: "SET BỘ",
            code: "SB",
        },
    ]

    for (let index of indexs) {
        console.log(index.display)
        if (item.name.toUpperCase().includes(index.display)) {
            return index.code
        }
    }
    return "NONE"
}
const getCate = (cate) => {
    let sample = ["SB", "SE", "SA", "S", "A", "AD", "AC", "AK", "Q", "QD", "QN", "V", "CV", "VC"]
    let newCate;
    if (cate == "NONE") return "NONE NE"
    if (cate.length >= 2) {
        newCate = cate.substring(0, 2).toUpperCase()

    } else {
        newCate = cate
    }
    if (newCate == "SB" || newCate == "SE" || newCate == "SA") {
        newCate = "S"
    } else if (newCate == "VA"||newCate == "VC") {
        newCate = "V"
    } else if (newCate == "QU") {
        newCate = "Q"
    }
    return sample.includes(newCate) ? newCate : "OTHER"
}
const productServices = {
    getCategories: async () => {
        let products = await Product.find({});

    },
    get: async (id) => {
        console.log(id)
        console.log(await Product.find({ custom_id: { $regex: id, $options: "i" } }))
        return {
            product: await Product.find({ custom_id: { $regex: id, $options: "i" } }).limit(10)
        }
    },
    reset: async () => {
        await Product.deleteMany();
    },
    getAtttributes: async (params) =>{
        console.log('param',params)
        let res = await Attribute.find({attribute_type:params.type})
        return res
    },
    all: async (params) => {
        console.log('param', params)

        var totalPages = await Product.countDocuments()

        var products = [];
        if (params && params.page) {
            console.log('has param', params)
            totalPages = Math.round(totalPages / params.page_size)
            console.log('totalPage', totalPages)
            console.log('items skip', params.page * params.page_size)
            products = await Product.find({})
                .skip(Number(params.page * params.page_size))
                .limit(Number(params.page_size))
            // console.log('pd size',products.length)

        } else {
            console.log('none param')
            products = await Product.find({});
        }
        return {
            products: products,
            total_pages: totalPages
        }
    },
    sync: async (query) => {
        await Product.deleteMany();
        await Attribute.deleteMany();
        var apiUrl = "https://pos.pages.fm/api/v1/shops/2254195/"
        const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1NmNkNTYwNS1mZWU0LTQ4NDAtODI3NS1iY2M4YTlmZjZiOGMiLCJpYXQiOjE2MzU2NzM4ODksImZiX25hbWUiOiJkZW1vIGRlbW8iLCJmYl9pZCI6bnVsbCwiZXhwIjoxNjQzNDQ5ODg5fQ.1IZ5KaD3W5M439yefj-scqHGFlONK9gOkSGKLAKVbz0"
        var products = await axios.get(apiUrl + 'products', {
            params: {
                access_token: accessToken,
                page: 1,
                page_size: 1000
            }
        }).then(res => res.data.data)
        // handle categories ( custom_id)
        let temp = products.map(item => {
            let cus_id = '';
            if (onlyAlphabet(item.custom_id)) {
                cus_id = item.custom_id
            }
            else {
                cus_id = formatCategory(item)
            }
            return {
                id: cus_id.replace(/[^a-z]/gi, '')
            }
        }
        )

        temp = new Set(temp.map(item => {
            let cate = item.id
            return getCate(cate)
        }))

        try {
            products = products.map(item => {
                let cus_id = '';
                if (onlyAlphabet(item.custom_id)) {
                    cus_id = item.custom_id
                }
                else {
                    cus_id = formatCategory(item)
                }
                item.categories = [getCate(cus_id)]
                let colors = item.product_attributes.find(item => item.name == "Màu")
                let sizes = item.product_attributes.find(item => item.name == "Size")
               
                item.colors = colors ? colors.values : ["Free"]
                item.sizes = sizes ? sizes.values : ["Free"]
                let colors_type = item.colors.map(c => getColors(c))
                let sizes_type = item.sizes.map(s => getSize(s))
                let temp = []
                extendArray(temp,colors_type)
                temp = getUnique(temp)
                item.colors_type = temp

                item.sizes_type = getUnique(sizes_type)
                for(let variation of item.variations){
                    let v_color = variation.fields.find(vari => vari.name =="Màu")
                    let v_size = variation.fields.find(vari => vari.name =="Size")
                    variation.color = v_color?v_color.value:"Free"
                    variation.size = v_size?v_size.value:"Free"
                    variation.color_type = getColor(variation.color)
                    variation.size_type = getSize(variation.size)
                }
                return item;
            })
            // console.log(products)
            await Product.insertMany(products)
            temp = Array.from(temp)
            // add categories
            let indexs = [
                {
                    display:"Khác...",
                    code:"A",
                    subType:1
                },
                {
                    display: "Áo dài",
                    code: "AD",
                    subType:1
                },
                {
                    display: "Áo choàng",
                    code: "AC",
                    subType:1
                },
                {
                    display: "Áo khoác",
                    code: "AK",
                    subType:1
                },
                {
                    display: "Khác...",
                    code: "Q",
                    subType:2
                },
                {
                    display: "Quần dài",
                    code: "QD",
                    subType:2
                },
                {
                    display: "Quần ngắn",
                    code: "QN",
                    subType:2
                },
                {
                    display: "Váy",
                    code: "V",
                    subType:3
                },
                {
                    display: "Chân váy",
                    code: "CV",
                    subType:3
                },
                {
                    display: "Set",
                    code: "S",
                    subType:4
                },
                {
                    display: "Khác",
                    code: "OTHER",
                    subType:5
                },
            ]
        
            let categories = temp.map(cate => {
                let data = indexs.find(c => c.code==cate)
                return {
                    attribute_type:"CATE",
                    display: data.display,
                    code:cate,
                    sub_type:data.subType

                }
            })
            // console.log(categories);
            // format color and size value
            
            // add colors to attribute collection 
            let colors = []
            let sizes = []
            for(let p of products){
                colors.push(...p.colors)
                sizes.push(...p.sizes)
            }
            colors = colors.map(color => getColor(color))
            sizes = sizes.map(size => getSize(size))
            colors = new Set(colors)
            sizes = new Set(sizes)
            colors = Array.from(colors)
            sizes = Array.from(sizes)
            sizes = sizes.map(size => {
                return {
                    attribute_type:"SIZE",
                    display: size,
                    code:size,
                    sub_type:-1
                }
            })
            colors = colors.map(color => {
                return {
                    attribute_type:"COLOR",
                    display: color,
                    code:color,
                    sub_type:-1
                }
            })
            console.log(colors)
            console.log(sizes)
            await Attribute.insertMany(categories)
            await Attribute.insertMany(colors)
            await Attribute.insertMany(sizes)
           
        } catch (err) {
            console.log(err)
        }
        return {
            products: products,
            categories: await Attribute.find({})
        }
    }
}
export default productServices;
