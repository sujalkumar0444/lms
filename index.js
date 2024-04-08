const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
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
const courserouter=require('./router/courseworkroutes/coureworkrouter');
const reorderrouter=require('./router/courseworkroutes/reorder');
const authenticaterouter = require("./router/registration/authenticate");
const sendotprouter = require("./router/registration/send_otp");
const getcredentialsrouter = require("./router/registration/get_creds");
const updatephonerouter = require("./router/dashboard/update_phone");
const updateemailrouter = require("./router/dashboard/update_email");
const updatedetailsrouter = require("./router/dashboard/update_details");
const coursesfetchrouter=require('./router/courseworkroutes/coursefetchrouter');
const heatmaprouter=require('./router/dashboard/heatmap');
const solvedproblemsrouter=require('./router/dashboard/solvedproblems');
const intervalscorerouter=require('./router/leaderboardroutes/intervalscore');
const is_valid_user=require("./middlewares/is_valid_user");
const updateImagerouter=require("./router/dashboard/update_image");
const upcommingcontestrouter=require("./router/upcomingcontests");
const jobsrouter=require("./router/fetchjobs");


// models
const Users = require('./models/user');
const mainf = require('./modules/sites/scoresupdataion');

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
app.use('/leaderboard',leaderboardsortedrouter);
//added route for coursework
app.use('/add',courserouter);
app.use('/fetch/courses',coursesfetchrouter);
app.use('/reorder',reorderrouter);
app.use("/register", regisrationrouter);
app.use("/authenticate", authenticaterouter);
app.use("/sendotp", sendotprouter);
app.use("/getcreds", getcredentialsrouter);
app.use("/uemail",is_valid_user, updateemailrouter);
app.use("/uphone",is_valid_user, updatephonerouter);
app.use("/udetails",is_valid_user, updatedetailsrouter);
app.use("/heatmap",is_valid_user, heatmaprouter);
app.use("/problems",is_valid_user, solvedproblemsrouter);
app.use("/interval",is_valid_user, intervalscorerouter);
app.use("/uimage", updateImagerouter);
app.use("/upcomming-contests", upcommingcontestrouter);
app.use("/jobs", jobsrouter);



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

app.get("/update",async(req,res)=>{
    let mainf=require("./modules/sites/scoresupdataion");
    console.log(req.body);
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