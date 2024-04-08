const mongoose=require("mongoose");

const leaderboardSchema = new mongoose.Schema({
    // user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user_name: { type: String},
    roll_no: { type: String,unique:true, required: true },
    lc_leaderboard_score: { type: Number, default: 0 },
    cc_leaderboard_score: { type: Number, default: 0 },
    cf_leaderboard_score: { type: Number, default: 0 },
    hr_leaderboard_score: { type: Number, default: 0 },
    spoj_leaderboard_score: { type: Number, default: 0 },
    // coursework_score: { type: Number, required: true },
    total_leaderboard_score: { type: Number, default: 0 },
});

leaderboardSchema.index({ roll_no: 1 });
const Leaderboard=mongoose.model("Leaderboard",leaderboardSchema);
module.exports=Leaderboard;