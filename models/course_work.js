const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assessmentsSchema = new mongoose.Schema({
    assignment_name: { type: String, required: true },
    total_time: { type: Number },
    problems: [
      {
        problem_ref: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'CourseProblem', // Assuming 'CourseProblem' is the model name for course problems
          required: true,
        },
        points: { type: Number, required: true },
      },
    ],
  });


  const CourseSchema = new mongoose.Schema({
    courseid: { type: String, required: true , unique: true },
    coursetags: [{ type: String }],
    title: { type: String, required: true },
    description: { type: String },
    modules: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Module', // Reference to Module documents
        },
    ], // Array of Module documents
  });
  
  const courseProblemSchema = new mongoose.Schema({
    problem_title: { type: String, required: true },
    problem_description: { type: String },
    sample_test_cases: [
      {
        input: { type: String },
        output: { type: String },
      },
    ],
    hidden_test_cases: [
      {
        input: { type: String },
        output: { type: String },
      },
    ],
  });

  const lessonSchema = new mongoose.Schema({
    lesson_no: { type: Number, required: true },
    contentype: {
      type: String,
      enum: ['text-material', 'problem', 'assessment'],
      required: true,
    },
    lesson_title: { type: String, required: true },
    lesson_points: { type: Number, required: true },
    text_content: { type: String },
    problem_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseProblem', // Assuming 'CourseProblem' is the model name for course problems
    },
    assessment_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessments', // Assuming 'Assessment' is the model name for assessments
    },
  });

  const ModuleSchema = new mongoose.Schema({
    module_title: { type: String, required: true },
    module_no: { type: Number, required: true },
    module_total_score: { type: Number, required: true },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson', // Reference to Lesson documents
    }], // Reference to Lesson documents
  });
  

// Define models
const Module = mongoose.model('Module', ModuleSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const CourseProblem = mongoose.model('CourseProblem', courseProblemSchema);
const Assessments = mongoose.model('Assessments', assessmentsSchema);
const Course = mongoose.model('Course', CourseSchema);


module.exports = {
    Lesson,
   CourseProblem,
   Assessments,
    Module,
    Course,
};
