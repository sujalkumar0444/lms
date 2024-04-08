const { hackerrankstat } = require('../controllers/hackerrankcontroller');
const router = require('express').Router();



router.get("/:handle", hackerrankstat); 

router.get('/', (req,res)=>{
    res.send('Hackerrank');
});
module.exports = router;