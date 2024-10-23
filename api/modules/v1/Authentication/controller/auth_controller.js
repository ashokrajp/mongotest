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


/*==================================================FORGOT OTP======================================================*/
const forgotpassword = async (req, res) => {
    const valid = await middleware.checkValidationRules(req.body,checkValidationRule.forgotOtp);
    const request = {
        ...req.body,
    }

    if (valid.status) {
        return authModel.forgotOtp(request, res)
    } else {
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR, valid.error, null)
    }
}



//*==================================================SIGNUP======================================================*//


const addcard = async(req,res)=>{
    const valid = await middleware.checkValidationRules(req.body,checkValidationRule.addcardValidation);

    const request=req.body

    if(valid.status){
        return authModel.addcard(request,res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR,valid.error,null)
    }


}

//*==================================================edit card======================================================*//


const editcard = async(req,res)=>{
    const valid = await middleware.checkValidationRules(req.body,checkValidationRule.editValidation);

    const request=req.body;
    // console.log('reqqqqqqq', request)
    console.log("---calid",valid.status);
    
    if(valid.status){
        return authModel.editcard(request,res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR,valid.error,null)
    }


}
//*==================================================edit card======================================================*//


const editprofile = async(req,res)=>{
    const valid = await middleware.checkValidationRules(req.body,checkValidationRule.editdataprofile);

    const request=req.body;
    // console.log('reqqqqqqq', request)
    console.log("---calid",valid.status);
    
    if(valid.status){
        return authModel.editprofile(request,res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR,valid.error,null)
    }


}


//*==================================================LOGIN======================================================*//

const cardlisting = async (req,res)=>{

    return authModel.cardlisting(req.body,res)
}

//*==================================================cms pages======================================================*//


const cmspages = async(req,res)=>{
    const valid = await middleware.checkValidationRules(req.body,checkValidationRule.cmspValidation);

    const request=req.body;
    // console.log('reqqqqqqq', request)
    console.log("---calid",valid.status);
    
    if(valid.status){
        return authModel.cmspages(request,res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR,valid.error,null)
    }


}



//*==================================================SIGNUP======================================================*//


const contactus = async(req,res)=>{
    const valid = await middleware.checkValidationRules(req.body,checkValidationRule.contactusdata);

    const request=req.body

    if(valid.status){
        return authModel.contactUs(request,res)
    }else{
        return middleware.sendResponse(res, Codes.VALIDATION_ERROR,valid.error,null)
    }


}

//*==================================================LOGIN======================================================*//

const logout = async (req,res)=>{
    req.body.userId=req.user_id

    return authModel.logOut(req.body,res)
}

module.exports = {
    singup,
    viewprofile,
    login,
    forgotpassword,
    addcard,
    editcard,
    cardlisting,
    cmspages,
    editprofile,
    contactus,
    logout,
 
}