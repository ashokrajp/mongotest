
exports.verify_otp = function (otpcode) {
    const template = ` <!DOCTYPE html>
    <html>
    <head>
    <title>Otp Verify</title>
    </head>
    <body>
    <h1>Verify OTP</h1>
    <h3>OTP code is: ${otpcode}</h3>
    </body>
    </html>`;
    return template
}
