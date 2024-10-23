require('dotenv').config();
const { default: mongoose } = require('mongoose');
const Codes = require('../../../../config/status_code');
const middleware = require('../../../../middleware/headerValidators');
const userModel = require('../../../schema/tbl_users');
const ecardModel = require('../../../schema/tbl_ecard');
const cmsModel = require('../../../schema/tbl_cms');
const contactModel = require('../../../schema/tbl_contactus');
const moment = require('moment');
const common = require('../../../../config/common');
const otpTemplate = require('../../../../config/template');
const cryptoLib = require('cryptlib');
const { AwsInstance } = require('twilio/lib/rest/accounts/v1/credential/aws');
const shakey = cryptoLib.getHashSha256(process.env.KEY, 32);


const authModel = {



    //*========================================CHECK UNIQUE EMAILS=================================================*//
    async checkUniqueEmail(req , user_id) {
        try {
            let condition = {email: req.email};
            user_id != undefined && user_id != '' ? condition = {email: req.email, _id: {$ne: user_id}} : condition;
            const user = await userModel.findOne(condition)
            return user ? true : false;
        } catch (err) {

            return err;
        }

     
    },

    //*========================================CHECK UNIQUE PHONE=================================================*//
    async checkUniquePhone(req) {
        try {
            const user = await userModel.findOne({
                phone: req.phone
            });
            return user ? true : false;
        } catch (err) { 

            return err
        }
    },


    /*=============================================================================================================================
                                                             SINGUP
   =============================================================================================================================*/

   async signup(req,res){
    try{
        const checkUniqueEmail = await authModel.checkUniqueEmail(req,'');
        if(checkUniqueEmail){
            return middleware.sendResponse(res, Codes.ALREADY_EXISTS,'please check your email',null);
        }



        const obj={
            fname:req.fname,
            email:req.email,
            otp_Code:"",
            password:req.password,
        }

        const newUser = new userModel(obj);
        await newUser.validate();
        const response = await newUser.save()

        if (response) {
                return middleware.sendResponse(res, Codes.SUCCESS, 'Signup Success', response);
          
        }
        else {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Signup Failed', null);
        }

    } catch (error){
        console.log("---------erererer",error);

        return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Something went wrong', error);

    }
   },


   async login(req,res){
    console.log("--------------------reerer",req);
    
    try {
      const findUser = await userModel.findOne({
        email:req.email,
        is_active:{ $eq :'1'},
        is_delete:{ $eq :'0'}
      })
    console.log("--------------------findUser",findUser);
      
      if(!findUser){
        return middleware.sendResponse(res,Codes.NOT_FOUND, 'no data found',error)
      }
      let password =findUser.password;
    console.log("--------------------password",password);

      if(password !==   req.password){
        return middleware.sendResponse(res,Codes.INTERNAL_ERROR,'Invalid request',null)
    } else {
        let token = common.generateToken(32);
        let param = {
            token: token,
        }
        const updateUser = await userModel.findByIdAndUpdate(findUser._id, param, { new: true });
        if (updateUser) {
            return middleware.sendResponse(res, Codes.SUCCESS, 'Login successfully', updateUser);
        } else {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Failed to update user status', null);
        }
    }
    //   else if(findUser.is_step !==2)
    }catch(error){
        return middleware.sendResponse(res, Codes.INTERNAL_ERROR,'something went wront5ertrtrtrtrtrtrt',error)
    }
   },


    /*=============================================================================================================================
                                                          VIEW PROFILE   
    =============================================================================================================================*/

    async viewprofile(req,res){
        try {
            const findUser =  await userModel.findOne({_id : req.user_id})
            if (!findUser) {
                
                return middleware.sendResponse(res, Codes.NOT_FOUND, 'User not found', null);
            }else{
                return middleware.sendResponse(res, Codes.SUCCESS, 'Profile found', findUser);

            }
        }catch(error){
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR,'something went wrong',error)
        }
        
    },

    /*=============================================================================================================================
                                                            FORGOT PASSWORD SEND OTP   
    =============================================================================================================================*/
    async forgotOtp(req, res) {
        try {
            const findUser = await userModel.findOne({ email: req.email});
            if (!findUser) {
                return middleware.sendResponse(res, Codes.NOT_FOUND, 'User not found', null);
            }
            let otp = await common.generateOTP();
            let param = {
                otp: otp,
            }
            const updateUser = await userModel.findByIdAndUpdate(findUser._id, param, { new: true });
            if (updateUser) {
                const mailOptions      = otpTemplate.verify_otp(otp);
                const emailSent = await common.send_email(`Your OTP for verification`, findUser.email, mailOptions);
                if (emailSent) {
                    return middleware.sendResponse(res, Codes.SUCCESS, 'OTP sent successfully', otp);

                } else {
                    return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Failed to send OTP', null);

                }
            } else {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Failed to update OTP', null);
            }


        } catch (error) {

            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Something went wrong', error);

        }
    },


    async addcard(req,res){
        try{

           
            const obj={
                fname:req.fname,
                email:req.email,
                jtitle:req.jtitle,
                email:req.email,
                cname:req.cname,
                bio:req.bio,
                website:req.website,
              
            }
    
            const newUser = new ecardModel(obj);
            const response = await newUser.save()
    
            if (response) {
                    return middleware.sendResponse(res, Codes.SUCCESS, 'add card  Success', response);
              
            }
            else {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Signup Failed', null);
            }
    
        } catch (error){
            console.log("---------erererer",error);
    
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Something went wrong', error);
    
        }
       },
    

    async editcard(req,res){
        try{

            // const checkUniqueEmail = await authModel.checkUniqueEmail(req);
            // if(checkUniqueEmail){
            //     return middleware.sendResponse(res, Codes.ALREADY_EXISTS,'please check your email',null);
            // }
    
            const obj={
                fname:req.fname,
                email:req.email,
                jtitle:req.jtitle,
                email:req.email,
                cname:req.cname,
                bio:req.bio,
                website:req.website,
              
            }
            const updateUser = await ecardModel.findByIdAndUpdate(req.id, obj, { new: true });

            if (updateUser) {
                    return middleware.sendResponse(res, Codes.SUCCESS, 'edit card  Success', null);
              
            }
            else {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Signup Failed', null);
            }
    
        } catch (error){
            console.log("---------erererer",error);
    
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Something went wrong', error);
    
        }
       },
    

    /*=============================================================================================================================
                                                          VIEW PROFILE   
    =============================================================================================================================*/

    async cardlisting(req,res){
        try {
            const findUser =  await ecardModel.find()
            if (!findUser) {
                
                return middleware.sendResponse(res, Codes.NOT_FOUND, 'User not found', null);
            }else{
                return middleware.sendResponse(res, Codes.SUCCESS, 'details found', findUser);

            }
        }catch(error){
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR,'something went wrong',error)
        }
        
    },



    async cmspages(req,res){
        try {
            console.log("-------------------",req.title);
            const findData =  await cmsModel.findOne({title:req.title})
            
            if (!findData) {
                
                return middleware.sendResponse(res, Codes.NOT_FOUND, 'User not found', null);
            }else{
                return middleware.sendResponse(res, Codes.SUCCESS, 'details found', findData);

            }
        }catch(error){
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR,'something went wrong',error)
        }
        
    },



    async editprofile(req,res){
        try{

            const checkUniqueEmail = await authModel.checkUniqueEmail(req,req.user_id);
            if(checkUniqueEmail){
                return middleware.sendResponse(res, Codes.ALREADY_EXISTS,'please check your email',null);
            }
    
            const obj={
                fname:req.fname,
                email:req.email,
               password:req.password
              
            }
            const updateUser = await userModel.findByIdAndUpdate(req.user_id, obj, { new: true });

            if (updateUser) {
                    return middleware.sendResponse(res, Codes.SUCCESS, 'edit profile  Success', null);
              
            }
            else {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Signup Failed', null);
            }
    
        } catch (error){
            console.log("---------erererer",error);
    
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Something went wrong', error);
    
        }
       },
    


    /*=============================================================================================================================
                                                             contact us
   =============================================================================================================================*/

   async contactUs(req,res){
    try{

        const obj={
            fname:req.fname,
            email:req.email,
            description:req.description,
        }

        const newUser = new contactModel(obj);
        const response = await newUser.save()

        if (response) {
                return middleware.sendResponse(res, Codes.SUCCESS, 'contact us Success', response);
          
        }
        else {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'contact Failed', null);
        }

    } catch (error){
        console.log("---------erererer",error);

        return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Something went wrong', error);

    }
   },


    async logOut(req,res){
        try {
            const findUser =  await userModel.findOne({_id : req.user_id})
            if (!findUser) {
                
                return middleware.sendResponse(res, Codes.NOT_FOUND, 'User not found', null);
            }else{

              const obj={
                token:'',
            }
            const updateUser = await userModel.findByIdAndUpdate(req.user_id, obj, { new: true });

            if (updateUser) {
                    return middleware.sendResponse(res, Codes.SUCCESS, 'logout  Success', null);
              
            }
            else {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'logout Failed', null);
            }

            }
        }catch(error){
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR,'something went wrong',error)
        }
        
    },

}



module.exports = authModel