const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProblemSchema = new Schema({
    problem_name: { type: String, required: true },
    problem_id_in_site : { type: String },
    problem_tags: [{ type: String }],
    problem_href: { type: String, required: true },
    site_name: { type: String ,required: true },
});

const Problems=mongoose.model('Problem', ProblemSchema);





const cfsampleProblemData = {
    problem_name: 'Rudolf and the Ugly String',
    problem_href: 'https://codeforces.com/problemset/problem/1941/C',
    site_name: 'CodeForces',
};
const ccsampleProblemData = {
    problem_name: 'DICEGAME3',
    problem_href: 'https://www.codechef.com/problems/DICEGAME3',
    site_name: 'CodeChef',
};
const hrsampleProblemData = {
    problem_name: 'Tree: Height of a Binary Tree',
    problem_href: "/challenges/tree-height-of-a-binary-tree",
    site_name: 'HackerRank',
};
const spojsampleProblemData = {
    problem_name: 'Finding the Kth Prime',
    problem_href: 'https://www.spoj.com/problems/TDKPRIME/',
    site_name: 'Spoj',
};



async function insertDataIfNotExists() {
    try{
        const existingProblem = await Problems.findOne({ problem_name: cfsampleProblemData.problem_name });
        if(!existingProblem){
            let cf=await Problems.collection.insertOne(cfsampleProblemData);
            let cc=await Problems.collection.insertOne(ccsampleProblemData);
            let hr=await Problems.collection.insertOne(hrsampleProblemData);
            let spoj=await Problems.collection.insertOne(spojsampleProblemData);

            console.log('Data inserted:', cf,cc,hr,spoj);
        }else{
            console.log('stater Data already exists:');
        }

    }catch(err){
        console.log('Error inserting data:', err);
    }
};
async function main(){
    await insertDataIfNotExists();
}
main();


module.exports = Problems ;
