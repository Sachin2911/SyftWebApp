const express = require("express")
const { infoElement, infoElementParticular} = require("../controllers/infoControllers")
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()
router.use(requireAuth) //Will fire the middleware function to check for the JWT token

router.get('/:element', infoElement)
router.get('/:element/:id', infoElementParticular)

module.exports = router