const { Course, Module, Lesson, CourseProblem, Assessments } = require('./models/course_work');

async function main() {

    let is_present = await CourseProblem.find();
    // console.log(is_present);
    if (is_present.length > 0) {
        console.log('Sample data already present');
        return;
    }

    let problems_data = await CourseProblem.insertMany(
        [
            {
                problem_title: 'Problem 1',
                problem_description: 'Description for Problem 1',
                sample_test_cases: [{ input: 'Input 1', output: 'Output 1' }],
                hidden_test_cases: [{ input: 'Input 2', output: 'Output 2' }],
            },
            {
                problem_title: 'Problem 2',
                problem_description: 'Description for Problem 2',
                sample_test_cases: [{ input: 'Input 3', output: 'Output 3' }],
                hidden_test_cases: [{ input: 'Input 4', output: 'Output 4' }],
            },
        ]
    );
    console.log(problems_data);


    let lessons_data = await Lesson.insertMany(
        [

            {
                lesson_no: 1,
                contentype: 'text-material',
                lesson_title: 'Lesson 1',
                lesson_points: 100,
                text_content: 'Text content for Lesson 1',
            },
            {
                lesson_no: 2,
                contentype: 'problem',
                lesson_title: 'Lesson 2',
                lesson_points: 150,
                problem_id: problems_data[0]._id, // Assuming you have IDs generated for CourseProblem data
            },
            {
                lesson_no: 1,
                contentype: 'text-material',
                lesson_title: 'Lesson 1 for module 2',
                lesson_points: 100,
                text_content: 'Text content for Lesson 1',
            },
            {
                lesson_no: 2,
                contentype: 'problem',
                lesson_title: 'Lesson 2 for module 2',
                lesson_points: 150,
                problem_id: problems_data[1]._id, // Assuming you have IDs generated for CourseProblem data
            },
        ]
    );
    console.log(lessons_data);

    let modules_data = await Module.insertMany(
        [
            {
                module_title: 'Module 1',
                module_no: 1,
                module_total_score: 500,
                lessons: [lessons_data[0]._id, lessons_data[1]._id], // Assuming you have IDs generated for Lesson data
            },
            {
                module_title: 'Module 2',
                module_no: 2,
                module_total_score: 500,
                lessons: [lessons_data[2]._id, lessons_data[3]._id], // Assuming you have IDs generated for Lesson data
            },
        ]
    );
    console.log(modules_data);

    let courses_data = await Course.insertMany(
        [
            {
                courseid: 'CS101',
                coursetags: ['Programming', 'Computer Science'],
                title: 'Introduction to Programming',
                description: 'This course introduces basic programming concepts.',
                modules: [modules_data[0]._id, modules_data[1]._id], // Assuming you have IDs generated for Module data
            },
        ]
    );
    console.log(courses_data);

}

module.exports = { main };
