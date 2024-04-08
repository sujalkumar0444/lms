const router = require('express').Router();
const {codeforces_stats}=require('../controllers/codeforcescontroller')

router.use('/:handle', codeforces_stats);
router.get('/', (req, res) => { 
    res.send('codeforcescore home page');
});

module.exports = router;