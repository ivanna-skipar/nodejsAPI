const db = require('../db');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require("./config")

const generateAccessToken = (id, email) => {
    const payload = {
        id,
        email
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class UserController {
    async createUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Create user error", errors });
        }
        const { first_name, last_name, email, phone, password } = req.body;
        const userByEmail = await db.query('SELECT * FROM list_of_users WHERE email=$1', [email]);
        if (userByEmail.rows[0]) {
            return res.status(400).json({message: `User with email ${email} already exist`})
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        const newUser = await db.query('INSERT INTO list_of_users (first_name, last_name, email, phone, password) values ($1, $2, $3, $4, $5) RETURNING *', [first_name, last_name, email, phone, hashPassword]);
        res.json(newUser.rows[0]);
    }
    
   
    async getOneUser(req, res) {
        const id = req.params.id;
        const userById = await db.query('SELECT * FROM list_of_users WHERE id=$1', [id]);
        res.json(userById.rows[0])        
    }


    async updateUser(req, res) {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Update user error", errors });
        }

        const id = req.params.id;
        const { first_name, last_name, email, phone, password } = req.body;
        const userByEmail = await db.query('SELECT * FROM list_of_users WHERE email=$1', [email]);

        if (userByEmail.rows[0]) {
            return res.status(400).json({message: `User with email ${email} already exist`})
        };
        
        const updateById = await db.query('UPDATE list_of_users SET first_name=$1, last_name=$2, email=$3, phone=$4, password=$5 WHERE id=$6 RETURNING *', [first_name, last_name, email, phone, password, id]);
        res.json(updateById.rows[0])
    }

    
    async loginUser(req, res) {
        const { email, password } = req.body;
        const userPassword = await db.query('SELECT password FROM list_of_users WHERE email=$1', [email]);
        const userId = await db.query('SELECT id FROM list_of_users WHERE email=$1', [email]);
        const storagePassword = userPassword.rows[0];

        if (!storagePassword) {
            return res.status(400).json({message: `User with email ${email} doesn\'t exist`})
        }

        const validPassword = bcrypt.compareSync(password, storagePassword.password);
        
        if (!validPassword) {
            return res.status(400).json({ message: 'Uncorrect password' });
        }

        const token = generateAccessToken(userId, email);
        res.json({token})
    }
   
}

module.exports = new UserController();