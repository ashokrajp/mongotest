const checkValidationsRules = {

    sigupValidation: {
        fname: 'required',
        email: 'required|email',
        password: 'required',
    },
    signinValidation: {
        email: 'required|email',
        password: 'required',
    },

  
    forgotPassword: {
        new_password: 'required',
        confirm_password: 'required',
    },

    login: {
        email: 'required',
        // password: 'required',
    },
    changePassword: {
        old_password: 'required',
        new_password: 'required',
        confirm_password: 'required',
    },

  





}

module.exports = checkValidationsRules;