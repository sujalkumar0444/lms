const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
//dbconnect
const {databaseconnect}=require("./dbconfig");

//starter problem model
const { Problems}= require("./models/all_problems");
const {main}=require('./temp');
 main();

const ccrouter = require('./router/codechefscores');
const lcrouter = require('./router/leetcodescores');
const hrrouter = require('./router/hackerrankscore');
const spojrouter = require('./router/spojscores');
const codeforcesrouter = require('./router/codeforcesscore');
const regisrationrouter = require('./router/registration/register');
const leaderboardsortedrouter = require('./router/leaderboardroutes/sortedboard');
//added route for fetching course details
const addsubmissionrouter=require('./router/courseworkroutes/addsubmission');
const fetchsubmissionrouter=require('./router/courseworkroutes/fetchsubmission');
const lessonpreviewrouter=require('./router/courseworkroutes/lessonpreview');
const coursedeleterouter=require('./router/courseworkroutes/coursedelete');
const lessondeleterouter=require('./router/courseworkroutes/lessondelete');
const moduledeleterouter=require('./router/courseworkroutes/moduledelete');
const lessonupdaterouter=require('./router/courseworkroutes/updatelesson');
const courserouter=require('./router/courseworkroutes/coureworkrouter');
const availablecoursesrouter=require('./router/courseworkroutes/availablecourses');
const courseselectrouter=require('./router/courseworkroutes/courseselect');
const courseaddprogressrouter=require('./router/courseworkroutes/addprogress');
const coursefetchprogressrouter=require('./router/courseworkroutes/fetchprogress');
const courseleaderboardrouter=require('./router/courseworkroutes/courseleaderboardrouter');
const usercourserouter=require('./router/courseworkroutes/usercourses');
const reorderrouter=require('./router/courseworkroutes/reorder');
const authenticaterouter = require("./router/registration/authenticate");
const sendotprouter = require("./router/registration/send_otp");
const getcredentialsrouter = require("./router/registration/get_creds");
const updatephonerouter = require("./router/dashboard/update_phone");
const updateemailrouter = require("./router/dashboard/update_email");
const updatedetailsrouter = require("./router/dashboard/update_details");
const uploadresumerouter = require("./router/dashboard/update_resume");
const coursesfetchrouter=require('./router/courseworkroutes/coursefetchrouter');
const uploadCertificatesRouter = require("./router/dashboard/upload_certificates");
const heatmaprouter=require('./router/dashboard/heatmap');
const solvedproblemsrouter=require('./router/dashboard/solvedproblems');
const intervalscorerouter=require('./router/leaderboardroutes/intervalscore');
const is_valid_user=require("./middlewares/is_valid_user");
const updateImagerouter=require("./router/dashboard/update_image");
const upcommingcontestrouter=require("./router/upcomingcontests");
const jobsrouter=require("./router/fetchjobs");
const dashboardrouter=require('./router/dashboard/dashboard');
const judgerouter=require('./router/judge/judgerouter');
const  addProblemSubmissionProgressRouter = require('./router/courseworkroutes/addProblemSubmissionProgress');
const authenticateAdminrouter=  require("./router/registration/authenticateAdmin");

// models
const Users = require('./models/user');
const mainf = require('./modules/sites/scoresupdataion');
cron.schedule('0 11 * * *', async () => {
  // let mainf = require("./modules/sites/scoresupdataion");
  let allusers = await Users.find({});
  
  for (let user of allusers) {
    let body = {
      rollno: user.roll_no,
      codechef: user.codechef_handle,
      leetcode: user.leetcode_handle,
      codeforces: user.codeforces_handle,
      spoj: user.spoj_handle,
      hackerrank: user.hackerrank_handle
    };
    console.log(body);
    await mainf(body);
  }
});
// dbconnection
databaseconnect();




// cors
app.use(cors({
    origin: '*'
}))
// parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true ,limit: '50mb' }));

// routes
app.get('/',(req,res)=>{
    res.send("Welcome to the server");
})
app.use('/codechef',ccrouter);
app.use('/leetcode',lcrouter);
app.use('/hackerrank',hrrouter);
app.use('/spoj',spojrouter);
app.use('/codeforces',codeforcesrouter);
app.use('/leaderboard',is_valid_user,leaderboardsortedrouter);
//added route for coursework
app.use('/add',courserouter);
app.use('/fetch/course',coursesfetchrouter);
app.use('/lesson/preview',lessonpreviewrouter);
app.use('/course/delete',coursedeleterouter);
app.use('/module/delete',moduledeleterouter);
app.use('/lesson/delete',lessondeleterouter);
app.use('/lesson/update',lessonupdaterouter);
app.use('/user/courses',is_valid_user,usercourserouter);
app.use('/available/courses',is_valid_user,availablecoursesrouter);
app.use('/select/course',is_valid_user,courseselectrouter);
app.use('/add/progress',is_valid_user,courseaddprogressrouter);
app.use('/add/addProblemSubmissionProgress',addProblemSubmissionProgressRouter);
app.use('/add/submission',addsubmissionrouter);
app.use('/fetch/submission',is_valid_user,fetchsubmissionrouter);
app.use('/fetch/progress',is_valid_user,coursefetchprogressrouter);
app.use('/course/leaderboard',is_valid_user,courseleaderboardrouter);
app.use('/reorder',reorderrouter);
app.use("/register", regisrationrouter);
app.use("/authenticate", authenticaterouter);
app.use("/authenticateAdmin", authenticateAdminrouter);
app.use("/sendotp", sendotprouter);
app.use("/getcreds", getcredentialsrouter);
app.use("/update/email",is_valid_user, updateemailrouter);
app.use("/update/phone",is_valid_user, updatephonerouter);
app.use("/update/details",is_valid_user, updatedetailsrouter);
app.use("/heatmap",is_valid_user, heatmaprouter);
app.use("/dashboard",is_valid_user, dashboardrouter);
app.use("/problems",is_valid_user, solvedproblemsrouter);
app.use("/interval/score",is_valid_user, intervalscorerouter);
app.use("/update/image",is_valid_user,  updateImagerouter);
app.use("/update/resume", is_valid_user, uploadresumerouter);
app.use("/upload/certificate", is_valid_user, uploadCertificatesRouter);
app.use("/contests",is_valid_user, upcommingcontestrouter);
app.use("/jobs",is_valid_user, jobsrouter);
app.use("/judge",is_valid_user,judgerouter);


app.get("/updateall",async(req,res)=>{
  let mainf=require("./modules/sites/scoresupdataion");
    let allusers=await Users.find({});
    for(users of allusers){
      req.body.rollno=users.roll_no;
      req.body.codechef=users.codechef_handle;
      req.body.leetcode=users.leetcode_handle;
      req.body.codeforces=users.codeforces_handle;
      req.body.spoj=users.spoj_handle;
      req.body.hackerrank=users.hackerrank_handle;
      console.log(req.body);
      await mainf(req.body);  
    }
    res.send("all Updated");
});

app.get("/update/:roll_no",async(req,res)=>{
    let mainf=require("./modules/sites/scoresupdataion");
    // console.log(req.body);
    let user=await Users.findOne({roll_no:req.params.roll_no});
    if(!user)
    {
      return res.status(404).json({ message: 'Student data not found' });
    }
    req.body.rollno=user.roll_no;
      req.body.codechef=user.codechef_handle;
      req.body.leetcode=user.leetcode_handle;
      req.body.codeforces=user.codeforces_handle;
      req.body.spoj=user.spoj_handle;
      req.body.hackerrank=user.hackerrank_handle;
    await mainf(req.body); 
    res.send("Updated");
});




app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error'
      }
    });
  });

const PORT = process.env.PORT || 8800;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});