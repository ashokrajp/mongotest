let moment = require('moment');
let mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  
    token: {
        type: String,
        default: null
    },
    email: {
        type: String,
    },
    fname: {
        type: String,
        default: null,
    },

    password: {
        type: String,
        require: true
    },

  

    is_forget: {
        type: String,
        enum: ['1', '0'],
        default: '0',
    },

    is_active: {
        type: String,
        enum: ['1', '0'],
        default: '1'
    },

    is_delete: {
        type: String,
        enum: ['1', '0'],
        default: '0'
    },

    created_at: {
        type: String,
        default: new Date()
    },

    updated_at: {
        type: String,
        default: new Date()
    }

})

const userModel = mongoose.model('tbl_users', userSchema);
module.exports = userModel; 