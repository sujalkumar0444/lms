const router = require('express').Router();
const { JUDGE0_URL } = require("../../config");
const axios = require('axios');
const { CourseProblem } = require("../../models/course_work");
const Base64Converter = require('../../helpers/convert');

async function getSubmissionStatus(token) {
    let a=0;
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

async function handleMultipleTestCases(req,res,type) {
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
            let problemsStatus =[]
            for (const item of response.data) {
                try {
                    let res = await getSubmissionStatus(item.token);
                    problemsStatus.push(res);
                } catch (error) {
                    console.error(error);
                    // Handle error as needed
                }
            }
            // res.json(problemsStatus);
            let  i=0;
            let finalresponse;
            if(type=="sample_test_cases") {
             finalresponse=problemsStatus.map((problemStatus) => {
                return {
                    ...problemStatus,
                    input: Base64Converter.encodeUtf8ToBase64(inputAndOutput[i].input),
                    expected_output: Base64Converter.encodeUtf8ToBase64(inputAndOutput[i++].output)
                }
            });
            }
            else{
                finalresponse=problemsStatus.map((problemStatus) => {
                    return {
                        ...problemStatus
                    }
                });
            }
            res.send (finalresponse);    
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        });
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
    handleMultipleTestCases(req,res,"sample_test_cases");
});




router.post("/submitcode", async (req, res) => {
    handleMultipleTestCases(req,res,"hidden_test_cases");
});


router.get("/getTestCases/:problem_id", async (req, res) => {
    let problem = await CourseProblem.findById(req.params.problem_id);
    let resp=problem.sample_test_cases.map((item)=>{
        return {
            input: (item.input),
            output: (item.output)
        }
    })
    res.json(resp);
});
module.exports = router;