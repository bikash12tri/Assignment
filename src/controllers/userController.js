const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const nameRegex = /^[A-Za-z ]+$/ 
const emailRegex = /.+\@.+\..+/
const passwordRegex = /^[a-zA-Z0-9@]{6,}$/
const phoneRegex = /^[6-9]\d{9}$/

const createUser = async (req, res) => {
    try {
        let data = req.body
        let {name, phone, email, password} = data
        if (!name) {
            return res.status(400).send({status: false, msg: 'name is required'})
        }
        if (!nameRegex.test(name)) {
            return res.status(400).send({status: false, msg: 'please enter your name in valid format'})
        }
        if (phone) {
            if (!phoneRegex.test(phone)) {
                return res.status(400).send({status: false, msg: 'phone number should be 10 digits only'})
            }
            let findPhone = await userModel.findOne({phone: phone,isDeleted: false})
            if (findPhone) {
                return res.status(409).send({status: false, msg: 'This phone number is already exist'})
            }
        }
        if (!email) {
            return res.status(400).send({status: false, msg: 'email is required'})
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({status: false, msg: 'please enter your emailId in valid format'})
        }
        let findEmail = await userModel.findOne({email: email,isDeleted: false})
        if (findEmail) {
            return res.status(409).send({status: false, msg: 'This email is already exist'})
        }
        if (!password) {
            return res.status(400).send({status: false, msg: 'password is required'})
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send({status: false, msg: 'Your password must contain at least one alphabet one number and one special character minimum 6 character'})
        }
        let saveData = await userModel.create(data)
        return res.status(201).send({status: true, msg: saveData})
    } catch (error) {
        return res.status(500).send({status: false, msg: error.message})
    }
}

const login = async (req, res) => {
    try {
        let {email, password} = req.body
        if (!email) {
            return res.status(400).send({status: false, msg: 'email is required for login'})
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({status: false, msg: 'please enter your emailId in valid format'})
        }
        if (!password) {
            return res.status(400).send({status: false, msg: 'password is required for login'})
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send({status: false, msg: 'Your password must contain at least one alphabet one number and one special character minimum 6 character'})
        }
        let findData = await userModel.findOne({email: email, password: password, isDeleted: false})
        if (!findData) {
            return res.status(404).send({status: false, msg: 'emailId or password is incorrect'})
        }

        const token = jwt.sign(
            {userId: findData._id.toString()},
            "secret-key"
        )
        res.setHeader("key", token)
        return res.status(200).send({ status: true, msg: "loggedin successfully ",token: token});
    } catch (error) {
        return res.status(500).send({status: false, msg: error.message})
    }
}

const getUser = async (req, res) => {
    try {
        let paramId = req.params.userId
        if (!paramId) {
            return res.status(400).send({ status: false, msg: "please give userId" })
        }
        if (!mongoose.Types.ObjectId.isValid(paramId)) {
            return res.status(400).send({ status: false, msg: "please give userId in valid format" })
        }
        let findData = await userModel.findOne({ _id: paramId, isDeleted: false })
        if (!findData) {
            return res.status(404).send({ status: false, msg: "Data not exist" })
        }
        return res.status(200).send({status: true, msg: findData})
    } catch (error) {
        return res.status(500).send({status: false, msg: error.message})
    }
}

module.exports = {createUser, login, getUser}