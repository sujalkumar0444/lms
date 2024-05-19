const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new mongoose.Schema({

  problem_id: {
    type: String,
    required: true
  },
  users: [
    {
        roll_no: {
            type: String,
            required: true
        },
        overall_status : {
            type:String,
            enum: ['pending', 'accepted'],
                    default: 'pending'
        },
        submissions: [
            {
                submission_time: {
                    type: Date,
                    default: Date.now
                  },
                  submission_code: {
                    type: String,
                    required: true
                  },
                  lang: {
                    type: String,
                  },
                  submission_status: {
                    type: String,
                    enum: ['pending', 'accepted', 'rejected'],
                    default: 'pending'
                  }
            }
        ]
    }
],
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
