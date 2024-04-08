const router = require('express').Router();
const {spoj_stats}=require('../controllers/spojcontroller');

router.get('/:handle',spoj_stats);
router.get('/', (req, res) => { 
    res.send('SPOJ');
});

module.exports = router;