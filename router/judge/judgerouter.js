const router = require('express').Router();
const { JUDGE0_URL } = require("../../config");
const axios = require('axios');
const { CourseProblem } = require("../../models/course_work");
const Base64Converter = require('../../helpers/convert');
const { SERVER_URL } = require("../../config");

async function getSubmissionStatus(token) {
    let a = 0;
    while (true) {
        let status = await axios.get(`${JUDGE0_URL}/submissions/${token}?base64_encoded=true`);
        console.log(a++);
        // console.log(status.data); // Assuming you want to log the status
        if (status.data.status.description != "In Queue" && status.data.status.description != "Processing") {
            return (status.data);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 1 second
    }
}


async function handleMultipleTestCases(req, res, type) {
    let { source_code, language_id, problem_id } = req.body;
    let problem = await CourseProblem.findById(problem_id);
    let sampleTestCases = (problem[type]);
    let inputAndOutput = sampleTestCases.map((testcase) => {
        return {
            input: testcase.input,
            output: testcase.output
        }
    });
    let data = JSON.stringify({
        "submissions": inputAndOutput.map((testcase) => {
            return {
                "source_code": source_code,
                "language_id": language_id,
                "stdin": Base64Converter.encodeUtf8ToBase64(testcase.input),
                "expected_output": Base64Converter.encodeUtf8ToBase64(testcase.output)
            }
        })

    });

    // res.json(data);
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${JUDGE0_URL}/submissions/batch?base64_encoded=true`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then(async (response) => {
            console.log(JSON.stringify(response.data));
            // res.json(response.data);
            let problemsStatus = []
            for (const item of response.data) {
                try {
                    let res = await getSubmissionStatus(item.token);
                    problemsStatus.push(res);
                } catch (error) {
                    res.status(504).send(error);
                    // Handle error as needed
                }
            }
            // res.json(problemsStatus);
            let i = 0;
            let finalresponse;
            if (type == "sample_test_cases") {
                finalresponse = problemsStatus.map((problemStatus) => {
                    return {
                        ...problemStatus,
                        input: Base64Converter.encodeUtf8ToBase64(inputAndOutput[i].input),
                        expected_output: Base64Converter.encodeUtf8ToBase64(inputAndOutput[i++].output)
                    }
                });
            }
            else {
                finalresponse = problemsStatus.map((problemStatus) => {
                    return {
                        ...problemStatus
                    }
                });

            }
            const allAccepted = finalresponse.every(item => item.status.description === "Accepted");
            if (req.body.roll_no!=req.roll_no && type == "hidden_test_cases") {
                let { moduleId, courseid, lessonPoints, lessonId } = req.body;
                console.log(moduleId, courseid, lessonPoints, lessonId);
                if (allAccepted) {
                    await addsubbmission(req.roll_no, problem_id, new Date(), getLanguage(language_id), Base64Converter.decodeBase64ToUtf8(source_code), "accepted");
                    await addDone(req.roll_no, moduleId, courseid, lessonPoints, lessonId);
                } else {
                    await addsubbmission(req.roll_no, problem_id, new Date(), getLanguage(language_id), Base64Converter.decodeBase64ToUtf8(source_code), "pending");
                }
            }
            res.send(finalresponse);
        })
        .catch((error) => {
            console.log(error);
            res.status(504).send(error.message);
        });
}
async function addsubbmission(roll_no, problem_id, submission_time, lang, submission_code, submission_status) {
    // console.log(roll_no, problem_id, submission_time, lang, submission_code, submission_status);
    let data = JSON.stringify({
        "roll_no": `${roll_no}`,
        "problem_id": `${problem_id}`,
        "submission_time": `${submission_time}`,
        "submission_code": `${submission_code}`,
        "lang": `${lang}`,
        "submission_status": `${submission_status}`
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${SERVER_URL}/add/submission`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}
async function addDone(roll_no, moduleId, courseid, lessonPoints, lessonId) {
    const axios = require('axios');
    let data = JSON.stringify({
        "roll_no": roll_no,
        "courseid": courseid,
        "moduleid": moduleId,
        "lessonid": lessonId,
        "lessonpoints": lessonPoints
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${SERVER_URL}/add/addProblemSubmissionProgress`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

}
function getLanguage(id) {
    switch (id) {
        case 71: return "Python";
        case 62: return "Java";
        case 54: return "Cpp";
    }

}
router.get('/', (req, res) => {
    res.json({ message: "Judge is working ..." });
});


router.post("/customtestcases", async (req, res) => {
    const { source_code, language_id, stdin } = req.body;
    let data = JSON.stringify({
        "source_code": source_code,
        "language_id": language_id,
        "stdin": stdin
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${JUDGE0_URL}/submissions/?base64_encoded=true&wait=false`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then(async (response) => {
            console.log(JSON.stringify(response.data));
            let tokenobj = response.data;
            let token = tokenobj.token;
            let a = 0;
            while (true) {
                let status = await axios.get(`${JUDGE0_URL}/submissions/${token}?base64_encoded=true`);
                console.log(a++);
                console.log(status.data); // Assuming you want to log the status
                if (status.data.status.description != "In Queue" && status.data.status.description != "Processing") {
                    res.json(status.data);
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 1 second
            }
        })
        .catch((error) => {
            console.log(error);
        });

});



router.post("/runcode", async (req, res) => {
    // res.json({ message: "run code" });
    try {
        handleMultipleTestCases(req, res, "sample_test_cases");
    } catch (error) {
        res.status(504).send(error.message);
    }
});




router.post("/submitcode", async (req, res) => {
    try {
        handleMultipleTestCases(req, res, "hidden_test_cases");
    } catch (error) {
        res.status(504).send(error.message);
    }
});


router.get("/getTestCases/:problem_id", async (req, res) => {
    let problem = await CourseProblem.findById(req.params.problem_id);
    let resp = problem.sample_test_cases.map((item) => {
        return {
            input: (item.input),
            output: (item.output)
        }
    })
    res.json(resp);
});
module.exports = router;