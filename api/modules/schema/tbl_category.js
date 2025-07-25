let moment = require('moment');
let mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  
 
    name: {
        type: String,
    },
   

})

const userModel = mongoose.model('tbl_category', userSchema);
module.exports = userModel; 