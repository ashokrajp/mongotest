let moment = require('moment');
let mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  
    name: {
        type: String,
        default: null
    },
    description: {
        type: String,
    },
    price: {
        type: String,
        default: null,
    },

    image: {
        type: String,
        require: true
    },

  
    brand: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    colors: {
        type: Array,
        require: true
    },
    sizes: {
        type: Array,
        require: true
    },
    rating: {
        type: String,
        require: true
    },
    popularity: {
        type: String,
        require: true
    },

  

    // is_forget: {
    //     type: String,
    //     enum: ['1', '0'],
    //     default: '0',
    // },

    // is_active: {
    //     type: String,
    //     enum: ['1', '0'],
    //     default: '1'
    // },

    // is_delete: {
    //     type: String,
    //     enum: ['1', '0'],
    //     default: '0'
    // },

    // created_at: {
    //     type: String,
    //     default: new Date()
    // },

    // updated_at: {
    //     type: String,
    //     default: new Date()
    // }

})

const userModel = mongoose.model('tbl_product', userSchema);
module.exports = userModel; 