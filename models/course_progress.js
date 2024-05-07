const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lesson_progress = new mongoose.Schema({
    roll_no: {
        type: String,
        required: true,
      },
    courseid : {type: String , required:true},
    completed: 
         { type : [{
         
            module:{type:String},
            lessons:[{
                      lesson: { type: String },
                      points: { type: Number },
          }],
          
        }],
            default : [],
          },
  });
const lessonProgress = mongoose.model('Progress', lesson_progress);
module.exports = lessonProgress;