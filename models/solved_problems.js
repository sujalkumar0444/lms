const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProblemsSolvedByStudentSchema = new Schema({
    roll_no: { type: String, required: true, unique: true },
    codechef_last_refreshed: { type: Date, default: new Date(0) },
    codechef_solved: [{ problem: { type: Schema.Types.ObjectId, ref: 'Problem' }, date: { type: Date } }],
    codeforces_last_refreshed: { type: Date, default: new Date(0) },
    codeforces_solved: [{ problem: { type: Schema.Types.ObjectId, ref: 'Problem' }, date: { type: Date } }],
    hackerrank_last_refreshed: { type: Date, default: new Date(0) },
    hackerrank_solved: [{ problem: { type: Schema.Types.ObjectId, ref: 'Problem' }, date: { type: Date } }],
    spoj_last_refreshed: { type: Date, default: new Date(0) },
    spoj_solved: [{ problem: { type: Schema.Types.ObjectId, ref: 'Problem' }, date: { type: Date } }],
});



ProblemsSolvedByStudentSchema.index({ roll_no: 1 });


const ProblemsSolvedByStudent = mongoose.model('ProblemsSolvedByStudent', ProblemsSolvedByStudentSchema);

module.exports = ProblemsSolvedByStudent;