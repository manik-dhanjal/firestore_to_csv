const express = require("express");
const router = express.Router();
const path = require('path');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { 
    getAllUsersFromAppId, 
    getQuizResponseFromResponseRef, 
    getFeedbackResponseFromRef, 
    getAllFeedbackQuestionsFromAppId,
    getAllQuizQuestionsForAppId
} = require("../utils/firebase.utils");

const CSV_NAME = "ratanprash-quiz-stats.csv";
const PATH_TO_CSV = path.resolve(`./csv/${CSV_NAME}`);

router.get('/', async (req, res) => {

     try{

        const userList = await getAllUsersFromAppId('Ratnaprash');
        const feedbackQuestionsList = await getAllFeedbackQuestionsFromAppId('Ratnaprash');
        const quizQuestionsList = await getAllQuizQuestionsForAppId('Ratnaprash');
        additionalCols = [];
        for(let key in feedbackQuestionsList){
            additionalCols.push({
                id:key,
                title:feedbackQuestionsList[key].question
            })
        }
        const csvWriter = createCsvWriter({
            path: PATH_TO_CSV,
            header: [
                {id: 'name', title: 'Name'},
                {id: 'age', title: 'Age'},
                {id: 'phoneNumber', title:"Phone Number"},
                {id: 'correct_answers', title:"Correct Answers"},
                {id: 'wrong_answers', title:"Wrong Answers"},
                {id: 'submitedAt', title:"Submited At"},
                {id: 'location', title:"Location"},
                ...additionalCols
            ],
        });
        const records = [];
        for(let i=0; i< userList.length; i++){
            if(userList[i].QuizResponseRef)
                for(let j=0; j< userList[i].QuizResponseRef.length; j++){
                    const response = await getQuizResponseFromResponseRef(userList[i].QuizResponseRef[j],quizQuestionsList);
                    let feedbackResponse = {};
                    if(j < userList[i].feedbackResponseRef.length)
                        feedbackResponse = await getFeedbackResponseFromRef(userList[i].feedbackResponseRef[j],feedbackQuestionsList)
                    records.push({
                        ...userList[i],
                        ...response,
                        ...feedbackResponse
                    })
                }
        }
        await csvWriter.writeRecords(records);
        res.download(PATH_TO_CSV);

     }catch(e){
        console.log(e.message);
        res.send(e.message);
     }
})

module.exports = router;