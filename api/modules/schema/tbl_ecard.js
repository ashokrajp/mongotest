let moment = require('moment');
let mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  
    email: {
        type: String,
    },
    fname: {
        type: String,
        default: null,
    },
    jtitle: {
        type: String,
        default: null,
    },
    cname: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: null,
    },
    website: {
        type: String,
        default: null,
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

const userModel = mongoose.model('tbl_ecards', userSchema);
module.exports = userModel; 