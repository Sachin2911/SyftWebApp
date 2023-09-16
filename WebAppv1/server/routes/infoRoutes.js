const express = require("express")
const { infoElement, infoElementParticular} = require("../controllers/infoControllers")
const router = express.Router()

router.get('/:element', infoElement)
router.get('/:element/:id', infoElementParticular)

module.exports = router