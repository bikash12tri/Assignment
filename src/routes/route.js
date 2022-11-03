const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController')
const middleware = require('../middleware/auth')

router.post('/createUser', userController.createUser)
router.post('/login',userController.login)
router.get('/getUser/:userId', middleware.authentication, middleware.authorization, userController.getUser)

router.all("/*", (req,res) => {return res.status(400).send({status: false , msg : "Invalid request"})})

module.exports = router