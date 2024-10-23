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

    description: {
        type: String,
        require: true
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

const userModel = mongoose.model('tbl_contactus', userSchema);
module.exports = userModel; 