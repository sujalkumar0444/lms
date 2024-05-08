const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lesson_progress = new mongoose.Schema({
    roll_no: {
        type: String,
        required: true,
        unique:true,
    },
    courses: [
        {
            courseid: {
                type: String,
                required: true
            },
            completed: [
                {
                    moduleid: { type: String },
                    lessons: [
                        {
                            lessonid: { type: String },
                        }
                    ]
                }
            ]
        }
    ]
});

const lessonProgress = mongoose.model('Progress', lesson_progress);
module.exports = lessonProgress;
