const authModel = require('../models/auth_model');
const Codes = require('../../../../config/status_code')
const checkValidationRule = require('../validation')
const middleware = require('../../../../middleware/headerValidators')
    

//*==================================================SIGNUP======================================================*//


const singup = async(req,res)=>{
    const valid = await middleware.checkValidationRules(req.body,checkValidationRule.sigupValidation);

    const request=req.body

    if(valid.status){
        return authModel.signup(request,res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR,valid.error,null)
    }


}


//*==================================================LOGIN======================================================*//


const login = async(req,res)=>{
    
    const valid = await middleware.checkValidationRules(req.body,checkValidationRule.signinValidation);

    const request=req.body

    if(valid.status){
        return authModel.login(request,res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR,valid.error,null)
    }

}


//*==================================================LOGIN======================================================*//

const viewprofile = async (req,res)=>{
    req.body.userId=req.user_id

    return authModel.viewprofile(req.body,res)
}

module.exports = {
    singup,
    viewprofile,
    login,
 
}