const express = require("express")
const { dataPullAll, dataPullElement} = require("../controllers/dataPullControllers")
const router = express.Router()


router.get('/all', dataPullAll)
router.get('/:element', dataPullElement)

module.exports = router