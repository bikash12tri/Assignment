const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const authentication = (req, res, next) => {
    try {
        let token = req.headers["key"];
        if (!token) {
            return res.status(401).send({ status: false, msg: "token is missing" });
        }
        jwt.verify(token, 'secret-key', (error, decode) => {
            if (error) {
                return res.status(401).send({ status: false, msg: "Authentication failed" });
            } else {
                req.token = decode
                next()
            }
        })
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
};

const authorization = async (req, res, next) => {
    try {
        let paramId = req.params.userId
        let decodedUserId = req.token.userId // userId from token
       
        if (decodedUserId != paramId) {
            return res.status(403).send({ status: false, msg: "unAuthorized person" })
        }
        next()
    } catch (error) {
        return res.status(500).send({ status: false, err: error.message });

    }
}

module.exports = { authentication, authorization }