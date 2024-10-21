const checkValidationsRules = {

    sigupValidation: {
        fname: 'required',
        email: 'required|email',
        password: 'required',
    },

    addcardValidation: {
        fname: 'required',
        email: 'required',
        jtitle: 'required',
        cname: 'required',
        bio: 'required',
        website: 'required',
    },

    editValidation: {
        id: 'required',
      
    },

    cmspValidation: {
        title: 'required',
      
    },

    signinValidation: {
        email: 'required|email',
        password: 'required',
    },

  
    
    forgotOtp: {
        email: 'required',
    },

    login: {
        email: 'required',
        // password: 'required',
    },
  





}

module.exports = checkValidationsRules;