const Router = require('express');
const router = new Router();

const userController = require('../controller/user.controller');

const { check } = require('express-validator');


router.post('/users', [
    check('first_name', "Enter first name.").notEmpty(),
    check('first_name', "Field 'First name' can contain only letters.").isAlpha(),
    check('last_name', "Field 'Last name' can contain only letters.").isAlpha(),
    check('email', "Enter email.").notEmpty(),
    check('email', "Enter correct email").isEmail(),
    check('phone', "Enter correct phone number. Use only numbers. More then 10 and less then 15 numbers").isNumeric().isLength({min: 6, max: 10}),
    check('password', "Enter the password").notEmpty()
], userController.createUser);
    
router.post('/login', userController.loginUser);

router.get('/users/:id', userController.getOneUser);

router.put('/users/:id', [
    check('first_name', "Enter first name.").notEmpty(),
    check('first_name', "Field 'First name' can contain only letters.").isAlpha(),
    check('last_name', "Field 'Last name' can contain only letters.").isAlpha(),
    check('email', "Enter email.").notEmpty(),
    check('email', "Enter correct email").isEmail(),
    check('phone', "Enter correct phone number. Use only numbers").isNumeric(),
    check('password', "Enter the password").notEmpty()
],userController.updateUser);

module.exports = router;