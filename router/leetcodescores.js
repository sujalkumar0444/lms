const router = require('express').Router();
const {leetcodestats} = require('../controllers/leetcodecontroller');


router.get('/:id', leetcodestats);
router.get('/', (req, res) => {
    res.status(200).send("this router for leetcode");
});
module.exports = router;