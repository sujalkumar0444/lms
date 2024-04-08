const mongoose=require("mongoose");

const tracked_scoresSchema = new mongoose.Schema({
    roll_no: { type: String, required: true, unique: true },
    lc_solved: { type: Number, default: 0, required: true },
    lc_rating: { type: Number, default: 0, required: true },
    cc_solved: { type: Number, default: 0, required: true },
    cc_rating: { type: Number, default: 0, required: true },
    cf_solved: { type: Number, default: 0, required: true },
    cf_rating: { type: Number, default: 0, required: true },
    hr_solved: { type: Number, default: 0, required: true },
    spoj_solved: { type: Number, default: 0, required: true },
    
    //  coursework_score: { type: Number,default: 0, required: true },
    lc_leaderboard_score: { type: Number, required: true,default: 0 },
    cc_leaderboard_score: { type: Number, required: true,default: 0 },
    cf_leaderboard_score: { type: Number, required: true,default: 0 },
    hr_leaderboard_score: { type: Number, required: true,default: 0 },
    spoj_leaderboard_score: { type: Number, required: true,default: 0 },
    // total_leaderboard_score: { type: Number, required: true,default: 0 },
});

tracked_scoresSchema.pre('save', function (next) { 
    let temp=(this.lc_rating>1300?this.lc_rating:1300);
    this.lc_leaderboard_score = ((this.lc_solved * 50)) + (( Math.pow(temp - 1300, 2)) / 30);

    temp=(this.cc_rating>1200?this.cc_rating:1200);
    this.cc_leaderboard_score = ((this.cc_solved * 10)) + ((Math.pow(temp - 1200, 2)) / 30);

    temp=(this.cf_rating>1000?this.cf_rating:1000);
    this.cf_leaderboard_score = ((this.cf_solved * 30)) + ((Math.pow(temp - 1000, 2)) / 30);

    this.hr_leaderboard_score = ((this.hr_solved * 10 ));
    this.spoj_leaderboard_score = ((this.spoj_solved * 20 ));
    // this.total_leaderboard_score = ((this.lc_leaderboard_score) + (this.cc_leaderboard_score) + (this.cf_leaderboard_score) + (this.hr_leaderboard_score) + (this.spoj_leaderboard_score));
    next();
});

tracked_scoresSchema.index({ roll_no: 1 });
const Tracked_Scores=mongoose.model("Tracked_Scores",tracked_scoresSchema);
module.exports=Tracked_Scores;