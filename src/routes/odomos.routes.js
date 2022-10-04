const { response } = require("express");
const express = require("express");
const router = express.Router();
const path = require('path');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { getAllUsersFromDatabase, getResponseFromResponseRef, getAllQuestionsForAppId } = require("../utils/firebase.utils");

const CSV_NAME = "odomos-quiz-stats.csv";
const PATH_TO_CSV = path.resolve(`./csv/${CSV_NAME}`);

router.get('/', async (req, res) => {

    const csvWriter = createCsvWriter({
        path: PATH_TO_CSV,
        header: [
            {id: 'name', title: 'Name'},
            {id: 'age', title: 'Age'},
            {id: 'phoneNumber', title:"Phone Number"},
            {id: 'correct_answers', title:"Correct Answers"},
            {id: 'wrong_answers', title:"Wrong Answers"},
            {id: 'submitedAt', title:"Submited At"},
            {id: 'location', title:"Location"}
        ],
    });
     try{

        const userList = await getAllUsersFromDatabase();
        const questionList = await getAllQuestionsForAppId('Odomos');
        const records = [];
        for(let i=0; i< userList.length; i++){
            if(userList[i].odomosResponseRef)
            for(let j=0; j< userList[i].odomosResponseRef.length; j++){
                const response = await getResponseFromResponseRef(userList[i].odomosResponseRef[j],questionList);
                records.push({
                    ...userList[i],
                    ...response
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