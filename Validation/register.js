const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateRegisterInput(data)
{
    let errors = {}
    data.name = !isEmpty(data.name) ? data.name:""
    data.email = !isEmpty(data.email)?data.email:""
    data.password = !isEmpty(data.password)?data.password:""
    data.password2 = !isEmpty(data.password2)?data.password2:""
    if(Validator.isEmpty(data.name))
    {
        errors.failure = "Name field is required"
    }
    if(Validator.isEmpty(data.email))
    {
        errors.failure = "Name field is required"
    }
    if(!Validator.isEmail(data.email))
    {
        errors.failure = "Email is invalid"
    }

    if(Validator.isEmpty(data.password))
    {
        errors.failure = "Password field is required"
    }
    if(!Validator.isLength(data.password,{min:6,max:30}))
    {
        errors.failure = "Password must be atleast 6 characters and atmost 30 characters";
    }
    if(!Validator.equals(data.password,data.password2))
    {
        errors.failure = "Passwords must match"
    }
    return {
        errors,
        isValid:isEmpty(errors)
    };

}