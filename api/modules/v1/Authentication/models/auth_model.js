require('dotenv').config();
const { default: mongoose } = require('mongoose');
const Codes = require('../../../../config/status_code');
const middleware = require('../../../../middleware/headerValidators');
const userModel = require('../../../schema/tbl_users');
const moment = require('moment');
const common = require('../../../../config/common');
const cryptoLib = require('cryptlib');
const { AwsInstance } = require('twilio/lib/rest/accounts/v1/credential/aws');
const shakey = cryptoLib.getHashSha256(process.env.KEY, 32);


const authModel = {



    //*========================================CHECK UNIQUE EMAILS=================================================*//
    async checkUniqueEmail(req) {
        try {
            const user = await userModel.findOne({
                email: req.email
            });
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
        const checkUniqueEmail = await authModel.checkUniqueEmail(req);
        if(checkUniqueEmail){
            return middleware.sendResponse(res, Codes.ALREADY_EXISTS,'please check your email',null);
        }



        const obj={
            fname:req.fname,
            email:req.email,
            password:req.password ? cryptoLib.encrypt(req.password,shakey,process.env.IV): '',
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


   async verifyOtp(req,res){
    try {
        if(!req.id || !req.otp|| !req.type){
            return middleware.sendResponse(res, Codes.BAD_REQUEST, 'Missing required fields',null);
        }

        const  findUser = await userModel.findById(req.id);
        if (!findUser) {
            return middleware.sendResponse(res.Codes.NOT_FOUND,'User Not Found ',null)
        } 

        if (findUser.otp !== req.otp) {
            return middleware.sendResponse(res,Codes.INVALID,'invalid otp',null);
        }

        let updateParams;
        if (req.type === 'otp_signup') {
            updateParams = {
                otp_time: null,
                otp: null,
                is_step: '2',
                is_verify: '1'
            };
        } else if (req.type === 'otp_forget') {
            updateParams = {
                otp_time: null,
                otp: null,
                is_forget: '0'
            };
        } else {
            return middleware.sendResponse(res, Codes.BAD_REQUEST, 'Invalid OTP type', null);
        }
        const  updateUser= await userModel.findByIdAndUpdate(findUser._id , updateParams , {new :true});
        if (updateUser) {
            return middleware.sendResponse(res,Codes.SUCCESS,'OTP Verified',null);

        }else{
            return middleware.sendResponse(res,Codes.INTERNAL_ERROR,'Failed to update error', null)
            
        }

    }catch (error) {

            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Something went wrong', error);
        }


      
   },


   async resendOtp(req,res){
    try {
        let otp = await common.generateOTP();
        const findUser = await userModel.findById(req.user_id)
         if (!findUser) {
            return  middleware.sendResponse(res,Codes.NOT_FOUND,'User Not Found',null);
         }

         let param = {
            otp:otp,
            otp_time:new Date()
         };

         const UpdateUser= await userModel.findByIdAndUpdate(req.user_id,param,{new:true});
         if (UpdateUser) {
            const mobileNumber = `${findUser.country_code}${findUser.phone}`;
            const message = `Welcome to our service! Your re-send OTP is ${otp}`;

            const smsSent = await common.sendSMS(mobileNumber, message);

            if (smsSent) {
                return middleware.sendResponse(res, Codes.SUCCESS, 'OTP sent successfully', null);
            } else {
                return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Failed to send OTP', null);
            }
         }else {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR, 'Failed to update OTP', null);
        }
    }catch(error){
        return middleware.sendResponse(res, Codes.INTERNAL_ERROR,'something went wrong',error)
    }
   },

   async login(req,res){
    try {
      const findUser = await userModel.findOne({
        email:req.email,
        is_active:{ $eq :'1'},
        is_delete:{ $eq :'0'}
      })
      
      if(!findUser){
        return middleware.sendResponse(res,Codes.NOT_FOUND, 'no data found',error)
      }
      let password =cryptoLib.decrypt(findUser.password,shakey,process.env.IV);
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
                                                          changepassword
    =============================================================================================================================*/

    async changepassword(req,res){
        try {
            const findUser =  await userModel.findOne({_id : req.user_id})
            if (!findUser) {
                const password = cryptoLib.decrypt(findUser[0].password, shakey, process.env.IV);
                if (password !=req.old_password) {
                    return middleware.sendResponse(res, Codes.INVALID_CREDENTIALS, 'Old password is incorrect', null);
                    
                }else if(req.new_password == password){

                    return middleware.sendResponse(res, Codes.INVALID_CREDENTIALS, 'New password should be different from old password', null);
                } else if (req.new_password !== req.confirm_password) {
                    return middleware.sendResponse(res, Codes.INVALID_CREDENTIALS, 'New password and confirm password should be same', null);
                }else {
                    let param ={
                        password : cryptoLib.encrypt(req.new_password,shakey,process.env.IV)
                    }

                    const updatePassword= await authModel.updateOne({_id:req.userId},{$set : param});

                    if (updatePassword) {
                        return middleware.sendResponse(res, Codes.SUCCESS,'password change successfully',null)
                    } else {
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR,'something went wrong',null)
                        
                    }
                }
                return middleware.sendResponse(res, Codes.NOT_FOUND, 'User not found', null);
            }else{
                return middleware.sendResponse(res, Codes.SUCCESS, 'Profile found', findUser);

            }
        }catch(error){
            return middleware.sendResponse(res, Codes.INTERNAL_ERROR,'something went wrong',error)
        }
        
    }






















}



module.exports = authModel