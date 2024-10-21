const twilio = require('twilio');

var common = {

    // *========================================GENRATE OTP===============================================* //
    async generateOTP() {
        const otp = await Math.floor(1000 + Math.random() * 9000)
        return otp;
    },

    // *========================================GENRATE TOKEN===============================================* //
    generateToken: function (length = 5) {
        let possible = "ABCDEFGHIJKLMNOPQRSTUVQXYZabcdefghijklmnopqrstuvqxyz0123456789";
        let text = "";
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        return text;
    },



    // *========================================SEND OTP===============================================* // 
    async sendSMS(mobile_number, message) {
        console.log('mobile_number: ', mobile_number);
        if (mobile_number && message) {
            const client = twilio(globals.TWILLIO_ACCOUNT_SID, globals.TWILLIO_ACCOUNT_AUTH);

            try {
                const response = await client.messages.create({
                    body: message,
                    from: globals.TWILLIO_ACCOUNT_PHONE,
                    to: mobile_number
                });
                // console.log('Message sent successfully: ', response.sid);
                return true;
            } catch (e) {
                console.error('Failed to send message: ', e.message);
                return false;
            }
        } else {
            console.error('Invalid mobile number or message');
            return false;
        }
    }

}

module.exports = common