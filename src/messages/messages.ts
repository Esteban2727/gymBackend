import {rolEnum} from "../enum/rol.enum"
export const validateDatasMessages={

    email:{
        isString: 'the Email must be a string',
        isEmail: 'The email must be a valid email',
        isNotEmpty: 'You cant leave this field empty'
    },
    username:{
        isString: 'the username must be a string',
        isUsername: 'The username already exist',
        isNotEmpty: 'You cant leave this field empty'
    },
    password:{
        isString: 'the password must be a string',
        isPasswordlength: 'The password is very short',
        isNotEmpty: 'You cant leave this field empty'
    },
    cellphone:{
        isNumber: 'the number must be numeric',
        isCellphone: 'the cellphone must have +57',
        isNotEmpty: 'You cant leave this field empty'
    },
    rol:{
        isString: 'el rol no es string',
         isNotEmpty: 'You cant leave this field empty',
         typeRol: "you must write some Rol",rolEnum
    }

}