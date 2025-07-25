let moment = require('moment');
let mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  
    name: {
        type: String,
    },
    logo: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    founded: {
        type: String,
        default: null,
    },
    headquarters: {
        type: String,
        default: null,
    },
 

   

})

const userModel = mongoose.model('tbl_brand', userSchema);
module.exports = userModel; 