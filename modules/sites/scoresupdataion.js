const axios =require('axios');  
const moment = require('moment-timezone');
const timeZone = 'Asia/Kolkata'; // Replace with the desired Asia timezone

// models
const solved_model=require("../../models/solved_problems");
const tracked_scores_model=require("../../models/tracked_scores");
const leaderboard_model=require("../../models/leaderboard");
const Problems_model=require("../../models/all_problems");
const dashboard=require("../../models/dashboard");

class Process_scores{
    constructor({rollno,codechef,codeforces,hackerrank,spoj,leetcode}) {
        this.rollno=rollno;
        this.codechef_handle=codechef;
        this.codeforces_handle=codeforces;
        this.hackerrank_handle=hackerrank;
        this.spoj_handle=spoj;
        this.leetcode_handle=leetcode;
    }
    async updatecodeforces(codeforces_last_refreshed,codeforces_handle){
        let last_retrieved=codeforces_last_refreshed;
        console.log(last_retrieved);
        // console.log("code forces update method called_________________________");
        let Codeforcesclass=require("./codeforces");
        let codeforces_obj=new Codeforcesclass(codeforces_handle);
        last_retrieved=(moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'));
        console.log("last_retrieved",last_retrieved);
        let data=await codeforces_obj.fetchSubmissions(last_retrieved);
        return data;

    }

    async updatecodechef(codechef_last_refreshed,codechef_handle){
        let last_retrieved=codechef_last_refreshed;
        console.log("codechef update method called_________________________");
        let Codechefclass=require("./codechef");
        let codechef_obj=new Codechefclass(codechef_handle);
        last_retrieved=(moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'));
        console.log("last_retrieved",last_retrieved);
        let data=await codechef_obj.fetch_from_time(last_retrieved);
        return data;
    }

    async updatespoj(spoj_last_refreshed,spoj_handle){
        let last_retrieved=spoj_last_refreshed;
        console.log("spoj update method called_________________________");
        let Spojclass=require("./spoj");
        let spoj_obj=new Spojclass(spoj_handle);
        last_retrieved=(moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'));
        console.log("last_retrieved",last_retrieved);
        let data=await spoj_obj.get_submissions(last_retrieved);
        return data;
    };

    async updatehackerrank(hackerrank_last_refreshed,hackerrank_handle){
        let last_retrieved=hackerrank_last_refreshed;
        console.log("hackerrank update method called_________________________");
        let Hackerrankclass=require("./hackerrank");
        let hackerrank_obj=new Hackerrankclass(hackerrank_handle);  
        last_retrieved=(moment(last_retrieved).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'));
        console.log("last_retrieved",last_retrieved);
        let data=await hackerrank_obj.get_submissions(last_retrieved);
        return data;
    }


    async Process_scores_method(){
        try{
            console.log("Inside Process_scores_method");
            let rollno=this.rollno;
            let codechef_handle=this.codechef_handle;
            let codeforces_handle=this.codeforces_handle;
            let hackerrank_handle=this.hackerrank_handle;
            let spoj_handle=this.spoj_handle;
            let leetcode_handle=this.leetcode_handle;
            
            let solved_doc=await solved_model.find({roll_no:rollno});
            if(solved_doc.length==0)return "failed";
            let { _id,codechef_last_refreshed,codeforces_last_refreshed,hackerrank_last_refreshed,spoj_last_refreshed,
                codechef_solved,codeforces_solved,hackerrank_solved,spoj_solved}=solved_doc[0]; 
            
            
            // codeforces newly solved problems
            // todo
            let cfnewlysolved=await this.updatecodeforces(codeforces_last_refreshed,codeforces_handle);
            console.log("cfnewlysolved",cfnewlysolved.length);
            codeforces_last_refreshed=cfnewlysolved[0]?.time;
            if(cfnewlysolved.length > 0 ){
                let solved_doc_for_update= await solved_model.findById(_id);
                solved_doc_for_update.codeforces_last_refreshed=codeforces_last_refreshed;
                await solved_doc_for_update.save();
            }
            // console.log("codeforces_last_refreshed",codeforces_last_refreshed);

            // //checking problems are alresy availble or not and performing operations
                
                
            for (const element of cfnewlysolved) {
                console.log("element-name",element.name);
                let problem_doc = await Problems_model.findOne({ problem_name: element.name });
                
            
                if (problem_doc) {
                    console.log("inside available in cf db");
                    let solved_doc_for_update = await solved_model.findById(_id);
                    let problemId = problem_doc._id;
                    console.log("problemId",problemId);
                    // Check if the problemId is not already in the array
                    console.log(solved_doc_for_update.codeforces_solved);
                    if (! solved_doc_for_update.codeforces_solved.some(entry => entry.problem.equals(problemId))) {
                        console.log("problemIdnot available in codeforces_solved array");

                        solved_doc_for_update.codeforces_solved.push({problem:problemId,date: element.time}); // Add to array

                        await solved_doc_for_update.save();
                        console.log("Problem added to codeforces_solved array.");
                    } else {
                        console.log("Problem already exists in codeforces_solved array.");
                    }
                } else {
                    // Create a new problem and update solved_doc_for_update
                    console.log("inside not available in cf db");
                    let solved_doc_for_update = await solved_model.findById(_id);
                    let problem_data = {
                        problem_name: element.name,
                        problem_href: element.link,
                        site_name: "CodeForces"
                    };
                    let newProblem = await Problems_model.create(problem_data);
                    let problemId = newProblem._id;
            
                    // Check if the problemId is not already in the array
                    if (!solved_doc_for_update.codeforces_solved.some(entry => entry.problem.equals(problemId))) {
                        solved_doc_for_update.codeforces_solved.push({problem:problemId,date: element.time}); // Add to array
                        await solved_doc_for_update.save();
                        console.log("New problem created and added to codeforces_solved array.");
                    } else {
                        console.log("New problem already exists in codeforces_solved array.");
                    }
                    
                }
            }

            // ______________________________________________________________________________________________________________

            // codechef newly solved problems
            let ccnewlysolved=await this.updatecodechef(codechef_last_refreshed,codechef_handle);
             console.log("ccnewlysolved",ccnewlysolved.length);
             codechef_last_refreshed=ccnewlysolved[0]?.time;
             
            if(ccnewlysolved.length > 0 ){
                let solved_doc_for_update= await solved_model.findById(_id);
                solved_doc_for_update.codechef_last_refreshed=codechef_last_refreshed;
                await solved_doc_for_update.save();
            }
             console.log("codechef_last_refreshed",codechef_last_refreshed);

             for (const element of ccnewlysolved) {
                let problem_doc = await Problems_model.findOne({ problem_name: element.problem });
            
                if (problem_doc) {
                    let solved_doc_for_update = await solved_model.findById(_id);
                    let problemId = problem_doc._id;
            
                    // Check if the problemId is not already in the array
                    if (!solved_doc_for_update.codechef_solved.some(entry => entry.problem.equals(problemId))) {
                        solved_doc_for_update.codechef_solved.push({problem:problemId,date: element.time}); // Add to array
                        await solved_doc_for_update.save();
                        console.log("Problem added to codechef_solved array.");
                    } else {
                        console.log("Problem already exists in codechef_solved array.");
                    }
                } else {
                    // Create a new problem and update solved_doc_for_update
                    let solved_doc_for_update = await solved_model.findById(_id);
                    let problem_data = {
                        problem_name: element.problem,
                        problem_href: element.problemLink,
                        site_name: "CodeChef"
                    };
                    let newProblem = await Problems_model.create(problem_data);
                    let problemId = newProblem._id;
            
                    // Check if the problemId is not already in the array
                    if (!solved_doc_for_update.codechef_solved.some(entry => entry.problem.equals(problemId))) {
                        solved_doc_for_update.codechef_solved.push({problem:problemId,date: element.time}); // Add to array
                        await solved_doc_for_update.save();
                        console.log("New problem created and added to codechef_solved array.");
                    } else {
                        console.log("New problem already exists in codechef_solved array.");
                    }
                }
            }







            //  ________________________________________________________________________________________________
             //spoj newly solved problems
             let spnewlysolved=await this.updatespoj(spoj_last_refreshed,spoj_handle);
             console.log("spnewlysolved",spnewlysolved[0]);
             console.log("splen:",spnewlysolved.length);
             spoj_last_refreshed=spnewlysolved[0]?.time;

             console.log("spoj_last_refreshed",spoj_last_refreshed);     
             if(spnewlysolved.length > 0 ){
                let solved_doc_for_update= await solved_model.findById(_id);
                solved_doc_for_update.spoj_last_refreshed=spoj_last_refreshed;
                await solved_doc_for_update.save();
            } 


            for (const element of spnewlysolved) {
                let problem_doc = await Problems_model.findOne({ problem_name: element.name });
            
                if (problem_doc) {
                    let solved_doc_for_update = await solved_model.findById(_id);
                    let problemId = problem_doc._id;
            
                    // Check if the problemId is not already in the array
                    if (!solved_doc_for_update.spoj_solved.some(entry => entry.problem.equals(problemId))) {
                        solved_doc_for_update.spoj_solved.push({problem:problemId,date: element.time}); // Add to array
                        await solved_doc_for_update.save();
                        console.log("Problem added to spoj_solved array.");
                    } else {
                        console.log("Problem already exists in spoj_solved array.");
                    }
                } else {
                    // Create a new problem and update solved_doc_for_update
                    let solved_doc_for_update = await solved_model.findById(_id);
                    let problem_data = {
                        problem_name: element.name,
                        problem_href: element.link,
                        site_name: "Spoj"
                    };
                    let newProblem = await Problems_model.create(problem_data);
                    let problemId = newProblem._id;
            
                    // Check if the problemId is not already in the array
                    if (!solved_doc_for_update.spoj_solved.some(entry => entry.problem.equals(problemId))) {
                        solved_doc_for_update.spoj_solved.push({problem:problemId,date: element.time}); // Add to array
                        await solved_doc_for_update.save();
                        console.log("New problem created and added to spoj_solved array.");
                    } else {
                        console.log("New problem already exists in spoj_solved array.");
                    }
                }
            }













            // // _______________________________________________________________________________________________________________
            //  hackerrank newly solved problems
            let hrnewlysolved=await this.updatehackerrank(hackerrank_last_refreshed,hackerrank_handle);
            console.log("hrnewlysolved",hrnewlysolved[0]);
            console.log("hrnewlysolved length",hrnewlysolved.length);
             hackerrank_last_refreshed=moment(hrnewlysolved[0]?.crecreated_at).utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
             if(hrnewlysolved.length > 0 ){
                let solved_doc_for_update= await solved_model.findById(_id);
                solved_doc_for_update.hackerrank_last_refreshed=hackerrank_last_refreshed;
                await solved_doc_for_update.save();
            }
            
            for (const element of hrnewlysolved) {
                let problem_doc = await Problems_model.findOne({ problem_name: element.name });
            
                if (problem_doc) {
                    let solved_doc_for_update = await solved_model.findById(_id);
                    let problemId = problem_doc._id;
            
                    // Check if the problemId is not already in the array
                    if (!solved_doc_for_update.hackerrank_solved.some(entry => entry.problem.equals(problemId))) {
                        solved_doc_for_update.hackerrank_solved.push({problem:problemId,date: element.created_at}); // Add to array
                        let data = await solved_doc_for_update.save();
                        console.log("Problem added to hackerrank_solved array.");
                    } else {
                        console.log("Problem already exists in hackerrank_solved array.");
                    }
                } else {
                    // Create a new problem and update solved_doc_for_update
                    let solved_doc_for_update = await solved_model.findById(_id);
                    let problem_data = {
                        problem_name: element.name,
                        problem_href: element.url,
                        site_name: "HackerRank"
                    };
                    let newProblem = await Problems_model.create(problem_data);
                    let problemId = newProblem._id;
            
                    // Check if the problemId is not already in the array
                    if (!solved_doc_for_update.hackerrank_solved.some(entry => entry.problem.equals(problemId))) {
                        solved_doc_for_update.hackerrank_solved.push({problem:problemId,date: element.created_at}); // Add to array
                        let data = await solved_doc_for_update.save();
                        console.log("New problem created and added to hackerrank_solved array.");
                    } else {
                        console.log("New problem already exists in hackerrank_solved array.");
                    }
                }
            }


        console.log("hackerrank_last_refreshed",hackerrank_last_refreshed); 
        this.updates_scores();
        return "updated";
        }catch(err){
            console.log(err)
            console.log("error in Process_scores_method");
            return "error";
        }
    }

    async leaderboard_update(data){
        let rollno=this.rollno;
        let codechef_handle=this.codechef_handle;
        let codeforces_handle=this.codeforces_handle;
        let hackerrank_handle=this.hackerrank_handle;
        let spoj_handle=this.spoj_handle;
        let leetcode_handle=this.leetcode_handle;
        console.log(data);
        let leaderboard_model_doc=await leaderboard_model.findOne({roll_no:rollno});
        leaderboard_model_doc.lc_leaderboard_score=data.lc_leaderboard_score
        leaderboard_model_doc.cf_leaderboard_score=data.cf_leaderboard_score
        leaderboard_model_doc.cc_leaderboard_score=data.cc_leaderboard_score
        leaderboard_model_doc.hr_leaderboard_score=data.hr_leaderboard_score
        leaderboard_model_doc.spoj_leaderboard_score=data.spoj_leaderboard_score;
        leaderboard_model_doc.total_leaderboard_score=
        leaderboard_model_doc.lc_leaderboard_score+
        leaderboard_model_doc.cf_leaderboard_score+
        leaderboard_model_doc.cc_leaderboard_score+
        leaderboard_model_doc.hr_leaderboard_score+
        leaderboard_model_doc.spoj_leaderboard_score

        let leaderscore=await leaderboard_model_doc.save();
        console.log("leaderscore",leaderscore);
        
    }
    async updates_scores(){
        try{
        let rollno=this.rollno;
        let codechef_handle=this.codechef_handle;
        let codeforces_handle=this.codeforces_handle;
        let hackerrank_handle=this.hackerrank_handle;
        let spoj_handle=this.spoj_handle;
        let leetcode_handle=this.leetcode_handle;

        let solved_data=await solved_model.find({roll_no:rollno});
       

        let Codechefclass=require("./codechef");
        let codechef_obj=new Codechefclass(codechef_handle);
        let codechef_data=await codechef_obj.get_credentials();
        // console.log(codechef_data);

        let codeforces=require("./codeforces");
        let codeforces_obj=new codeforces(codeforces_handle);
        let codeforces_data=await codeforces_obj.fetchProfile();
        // console.log(codeforces_data);

        let spoj=require("./spoj");
        let spoj_obj=new spoj(spoj_handle);
        let spoj_data=await spoj_obj.get_stats();
        // console.log(spoj_data);

        let leeetcode=await axios.get(`http://localhost:8800/leetcode/${leetcode_handle}`);

        let leetcode_data=(leeetcode.data);
        // console.log(leetcode_handle,leetcoderating);

        let tracked_scores_data=await tracked_scores_model.find({roll_no:rollno});
        tracked_scores_data=await tracked_scores_model.findById(tracked_scores_data[0]._id);
        let dashboard_data=await dashboard.findOne({roll_no:rollno});

       
        try {
            const response = await axios.post('https://leetcode.com/graphql', {
                query: `
                    query GetUserContestRanking($username: String!) {
                        userContestRanking(username: $username) {
                            rating
                        }
                    }
                `,
                variables: {
                    username: leetcode_handle
                }
            });
        
            let leetcoderating = response.data.data.userContestRanking.rating;
            tracked_scores_data.lc_rating=leetcoderating;
            
        } catch (error) {
           console.log(error);
        }
        
        if(dashboard_data.daily_solved_problem_count.length===0)
        {
            dashboard_data.daily_solved_problem_count.push({
                date :  moment().endOf('day').tz(timeZone).toDate(),
                codechef_solved_today : 0,
                codechef_total_solved : solved_data[0].codechef_solved.length,
                hackerrank_solved_today : 0,
                hackerrank_total_solved : solved_data[0].hackerrank_solved.length,
                codeforces_solved_today :0,
                codeforces_total_solved : codeforces_data.problems_solved,
                spoj_solved_today : 0,
                spoj_total_solved : parseInt(spoj_data.Problems_solved),
                leetcode_solved_today : 0,
                leetcode_total_solved : leetcode_data.totalSolved,
            });
            await dashboard_data.save();
        }
        else
        {
            const last_index= dashboard_data.daily_solved_problem_count.length-1;
            // let yesterday = moment().subtract(1, 'days').endOf('day').tz(timeZone).toDate();
            let today = moment().endOf('day').tz(timeZone).toDate();
            // console.log(today);
            // console.log(yesterday);
            // console.log(dashboard_data.daily_solved_problem_count[last_index].date);
            // Taking yesterday as we will be updating after 12
            if (moment(dashboard_data.daily_solved_problem_count[last_index].date).isAfter(today, 'day')) {

                dashboard_data.daily_solved_problem_count[last_index].codechef_solved_today=dashboard_data.daily_solved_problem_count[last_index].codechef_solved_today+solved_data[0].codechef_solved.length-dashboard_data.daily_solved_problem_count[last_index].codechef_total_solved; 
                dashboard_data.daily_solved_problem_count[last_index].codechef_total_solved=solved_data[0].codechef_solved.length;
                dashboard_data.daily_solved_problem_count[last_index].hackerrank_solved_today= dashboard_data.daily_solved_problem_count[last_index].hackerrank_solved_today+solved_data[0].hackerrank_solved.length-dashboard_data.daily_solved_problem_count[last_index].hackerrank_total_solved; 
                dashboard_data.daily_solved_problem_count[last_index].hackerrank_total_solved=solved_data[0].hackerrank_solved.length; 
                dashboard_data.daily_solved_problem_count[last_index].codeforces_solved_today= dashboard_data.daily_solved_problem_count[last_index].codeforces_solved_today+codeforces_data.problems_solved-dashboard_data.daily_solved_problem_count[last_index].codeforces_total_solved;
                dashboard_data.daily_solved_problem_count[last_index].codeforces_total_solved=codeforces_data.problems_solved;
                dashboard_data.daily_solved_problem_count[last_index].spoj_solved_today= dashboard_data.daily_solved_problem_count[last_index].spoj_solved_today+parseInt(spoj_data.Problems_solved)-dashboard_data.daily_solved_problem_count[last_index].spoj_total_solved;
                dashboard_data.daily_solved_problem_count[last_index].spoj_total_solved=parseInt(spoj_data.Problems_solved);
                dashboard_data.daily_solved_problem_count[last_index].leetcode_solved_today= dashboard_data.daily_solved_problem_count[last_index].leetcode_solved_today+leetcode_data.totalSolved-dashboard_data.daily_solved_problem_count[last_index].leetcode_total_solved; 
                dashboard_data.daily_solved_problem_count[last_index].leetcode_total_solved=leetcode_data.totalSolved; 
                console.log("here");
            }
            else if(moment(dashboard_data.daily_solved_problem_count[last_index].date).isSame(today, 'day'))
            {
                // if(moment(dashboard_data.daily_solved_problem_count[last_index].date).isSame(today, 'day'))
                // {
                    dashboard_data.daily_solved_problem_count[last_index].codechef_solved_today=dashboard_data.daily_solved_problem_count[last_index].codechef_solved_today+solved_data[0].codechef_solved.length-dashboard_data.daily_solved_problem_count[last_index].codechef_total_solved; 
                    dashboard_data.daily_solved_problem_count[last_index].codechef_total_solved=solved_data[0].codechef_solved.length;
                    dashboard_data.daily_solved_problem_count[last_index].hackerrank_solved_today= dashboard_data.daily_solved_problem_count[last_index].hackerrank_solved_today+solved_data[0].hackerrank_solved.length-dashboard_data.daily_solved_problem_count[last_index].hackerrank_total_solved; 
                    dashboard_data.daily_solved_problem_count[last_index].hackerrank_total_solved=solved_data[0].hackerrank_solved.length; 
                    dashboard_data.daily_solved_problem_count[last_index].codeforces_solved_today= dashboard_data.daily_solved_problem_count[last_index].codeforces_solved_today+codeforces_data.problems_solved-dashboard_data.daily_solved_problem_count[last_index].codeforces_total_solved;
                    dashboard_data.daily_solved_problem_count[last_index].codeforces_total_solved=codeforces_data.problems_solved;
                    dashboard_data.daily_solved_problem_count[last_index].spoj_solved_today= dashboard_data.daily_solved_problem_count[last_index].spoj_solved_today+parseInt(spoj_data.Problems_solved)-dashboard_data.daily_solved_problem_count[last_index].spoj_total_solved;
                    dashboard_data.daily_solved_problem_count[last_index].spoj_total_solved=parseInt(spoj_data.Problems_solved);
                    dashboard_data.daily_solved_problem_count[last_index].leetcode_solved_today= dashboard_data.daily_solved_problem_count[last_index].leetcode_solved_today+leetcode_data.totalSolved-dashboard_data.daily_solved_problem_count[last_index].leetcode_total_solved; 
                    dashboard_data.daily_solved_problem_count[last_index].leetcode_total_solved=leetcode_data.totalSolved; 
                // }
                // else
                // {
                //     dashboard_data.daily_solved_problem_count.push({
                //         date : today,
                //         codechef_solved_today : solved_data[0].codechef_solved.length-dashboard_data.daily_solved_problem_count[last_index].codechef_total_solved,
                //         codechef_total_solved : solved_data[0].codechef_solved.length,
                //         hackerrank_solved_today : solved_data[0].hackerrank_solved.length-dashboard_data.daily_solved_problem_count[last_index].hackerrank_total_solved,
                //         hackerrank_total_solved : solved_data[0].hackerrank_solved.length,
                //         codeforces_solved_today :codeforces_data.problems_solved-dashboard_data.daily_solved_problem_count[last_index].codeforces_total_solved,
                //         codeforces_total_solved : codeforces_data.problems_solved,
                //         spoj_solved_today : parseInt(spoj_data.Problems_solved)-dashboard_data.daily_solved_problem_count[last_index].spoj_total_solved,
                //         spoj_total_solved : parseInt(spoj_data.Problems_solved),
                //         leetcode_solved_today : leetcode_data.totalSolved-dashboard_data.daily_solved_problem_count[last_index].leetcode_total_solved,
                //         leetcode_total_solved : leetcode_data.totalSolved,
                //     })
                // }
               
            }
            else{
                dashboard_data.daily_solved_problem_count.push({
                    date : today,
                    codechef_solved_today : solved_data[0].codechef_solved.length-dashboard_data.daily_solved_problem_count[last_index].codechef_total_solved,
                    codechef_total_solved : solved_data[0].codechef_solved.length,
                    hackerrank_solved_today : solved_data[0].hackerrank_solved.length-dashboard_data.daily_solved_problem_count[last_index].hackerrank_total_solved,
                    hackerrank_total_solved : solved_data[0].hackerrank_solved.length,
                    codeforces_solved_today :codeforces_data.problems_solved-dashboard_data.daily_solved_problem_count[last_index].codeforces_total_solved,
                    codeforces_total_solved : codeforces_data.problems_solved,
                    spoj_solved_today : parseInt(spoj_data.Problems_solved)-dashboard_data.daily_solved_problem_count[last_index].spoj_total_solved,
                    spoj_total_solved : parseInt(spoj_data.Problems_solved),
                    leetcode_solved_today : leetcode_data.totalSolved-dashboard_data.daily_solved_problem_count[last_index].leetcode_total_solved,
                    leetcode_total_solved : leetcode_data.totalSolved,
                })
            }
            await dashboard_data.save();  
        }
        tracked_scores_data.lc_solved=leetcode_data.totalSolved;
        tracked_scores_data.cc_solved=solved_data[0].codechef_solved.length;
        tracked_scores_data.cf_solved=codeforces_data.problems_solved;
        tracked_scores_data.spoj_solved=parseInt(spoj_data.Problems_solved);
        tracked_scores_data.hr_solved=solved_data[0].hackerrank_solved.length;
        // console.log(solved_data[0].hackerrank_solved.length);

        tracked_scores_data.cc_rating=parseInt(codechef_data.currentRating);
        tracked_scores_data.cf_rating=codeforces_data.rating;
       
        // console.log(tracked_scores_data);   

        let update_response_total=await tracked_scores_data.save();
        update_response_total=await tracked_scores_model.findById(update_response_total._id);

        update_response_total.total_leaderboard_score=update_response_total.lc_leaderboard_score+update_response_total.cc_leaderboard_score+update_response_total.cf_leaderboard_score+update_response_total.spoj_leaderboard_score+update_response_total.hr_leaderboard_score;
        // console.log(update_response_total);
        await update_response_total.save();
        // console.log(update_response_total);
        this.leaderboard_update(update_response_total);
        return "score tracker updated";
        }catch(err){
            console.log(err);
        } 



    }
}



async function mainf(datas){
    console.log("Inside mainf");
    console.log(datas);
    let Process_obj=new Process_scores(datas);
    let data=await Process_obj.Process_scores_method();
     console.log(data);  
}


module.exports=mainf;
