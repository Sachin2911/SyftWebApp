const express = require("express")
const { dataPullAll, dataPullElement} = require("../controllers/dataPullControllers")
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()
router.use(requireAuth) //Will fire the middleware function to check for the JWT token

router.get('/all', dataPullAll)
router.get('/:element', dataPullElement)

module.exports = router