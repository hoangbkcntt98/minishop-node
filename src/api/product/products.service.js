import Product from '../../models/product.model.js';
import bcrypt from 'bcrypt'
import axios from 'axios'
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
            display: "ÁO CHOÀNG",
            code: "AC",
        },
        {
            display: "ÁO KHOÁC",
            code: "AK",
        },
        {
            display: "QUẦN",
            code: "AK",
        },
        {
            display: "VÁY",
            code: "VAY",
        },
        {
            display: "SET",
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
    } else if (newCate == "VA") {
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
                for(let variation of item.variations){
                    let v_color = variation.fields.find(vari => vari.name =="Màu")
                    let v_size = variation.fields.find(vari => vari.name =="Size")
                    variation.color = v_color?v_color.value:"Free"
                    variation.size = v_size?v_size.value:"Free"
                }
                return item;
            })
            // console.log(products)
            await Product.insertMany(products)
        } catch (err) {
            console.log(err)
        }
        return {
            products: products,
            categories: Array.from(temp)
        }
    }
}
export default productServices;
