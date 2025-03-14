import {rolEnum} from "../enum/rol.enum"
export const validateDatasMessages={

    email:{
        isString: 'the Email must be a string',
        isEmail: 'The email must be a valid email',
        isNotEmpty: 'You cant leave this field empty'
    },
    username:{
        isString: 'the name must be a string',
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
        isString: 'el rol  es string',
         isNotEmpty: 'You cant leave this field empty',
         typeRol: "you must write some Rol",rolEnum
    },
    identification:{
        isString: 'the identification  is string',
        isNotEmpty: 'You cant leave this field empty',
    },
    
    primaryColor:{
        isString: 'the primaryColor  is string',
        isNotEmpty: 'You cant leave this field empty',
    },

secondaryColor:{
    isString: 'the secondaryColor  is string',
        isNotEmpty: 'You cant leave this field empty',
},

font:{
    isString: 'the font  is string',
    isNotEmpty: 'You cant leave this field empty',
},
gender:{
    isString: 'the gender  is string',
    isNotEmpty: 'You cant leave this field empty',
},
yearExperience:{
    isString: 'the experience  is string',
    isNotEmpty: 'You cant leave this field empty',
},
name:{
    isString: 'the name  is string',
    isNotEmpty: 'You cant leave this field empty',
},
description:{
    isString: 'the description  is string',
    isNotEmpty: 'You cant leave this field empty',
},
difficulty_level:{
    isString: 'the difficulty_level  is string',
    isNotEmpty: 'You cant leave this field empty',
},
equipment:{
    isString: 'the equipment  is string',
    isNotEmpty: 'You cant leave this field empty',
}


}