let moment = require('moment');
let mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  
    title: {
        type: String,
    },
    content: {
        type: String,
        default: null,
    }
    

})

const userModel = mongoose.model('tbl_cms', userSchema);
module.exports = userModel; 