let moment = require('moment');
let mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  
    image: {
        type: String,
    },
    headline: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    ctaText: {
        type: String,
        default: null,
    },
    ctaLink: {
        type: String,
        default: null,
    },
    

})

const userModel = mongoose.model('tbl_banner', userSchema);
module.exports = userModel; 