const router = require('express').Router();
let Codechefclass=require('../modules/sites/codechef');
const {codechefstats,recent_submissions}=require('../controllers/cccontroller');


router.get('/:handle', codechefstats);
router.get('/recent/:handle', recent_submissions);
router.get('/', (req,res)=>{
    res.send("data from code chef");
});

module.exports = router;    