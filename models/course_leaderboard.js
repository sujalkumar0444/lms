const mongoose=require("mongoose");

const courseleaderboardSchema = new mongoose.Schema({
    user_name: { type: String},
    graduation_year: { type: Number, default: 0 },
    courseid:{type:String,required:true},
    roll_no: { type: String,required: true },
    score: { type: Number, default: 0 },
});

courseleaderboardSchema.index({ roll_no: 1 });
const CourseLeaderboard=mongoose.model("CourseLeaderboard",courseleaderboardSchema);
module.exports=CourseLeaderboard;