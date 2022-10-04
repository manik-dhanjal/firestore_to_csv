// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, getDoc } = require( 'firebase/firestore' );

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const getAllUsersFromDatabase = async () => {
    const userCol = collection(db, 'Users');
    const userSnapshot = await getDocs(userCol);
    const userList = userSnapshot.docs.map(doc =>{
        const temp = {
            ...doc.data()
        };
        return temp;
    });
    return userList;
}
const getAllUsersFromAppId = async (appId) => {
    const userCol = collection(db,'apps/'+appId+'/Users');
    const userSnapshot = await getDocs(userCol);
    const userList = userSnapshot.docs.map(doc =>{
        const temp = {
            ...doc.data()
        };
        return temp;
    });
    return userList;
}
const getResponseFromResponseRef = async (responseRef, questionList) => {
    if( !responseRef ) throw new Error("responseRef is absent");
    const responseSnapshot = await getDoc(responseRef);
    if (responseSnapshot.exists) {
        const {questions,createdAt} = responseSnapshot.data()
        let correct = 0;
        let wrong = 0;
        for(let i = 0; i < questions.length; i++){
            if(questionList[questions[i].questionRef.id]){
                const { correct_answers } = questionList[questions[i].questionRef.id]
                if(correct_answers.find( correct_ans => questions[i].selectedAnswer == correct_ans )){
                    correct++;
                }else{
                    wrong++;
                }
            }
        }
        var date = new Date(createdAt.seconds*1000);

        const submitedAt = date.getDate()+
        "/"+(date.getMonth()+1)+
        "/"+date.getFullYear()+
        " "+date.getHours()+
        ":"+date.getMinutes();
        return {
            correct_answers: correct,
            wrong_answers: wrong,
            submitedAt: submitedAt
        }
    } else {
        return null;
    }
}
const getQuizResponseFromResponseRef = async (responseRef,questionList) => {
    if( !responseRef ) throw new Error("responseRef is absent");
    const responseSnapshot = await getDoc(responseRef);
    if (responseSnapshot.exists) {
        const {questions,createdAt} = responseSnapshot.data()
        let correct = 0;
        let wrong = 0;
        for(let i = 0; i < questions.length; i++){
            if(questionList[questions[i].questionRef.id]){
                const { correct_answers } = questionList[questions[i].questionRef.id]
                if(correct_answers.find( correct_ans => questions[i].selected_answers.includes(correct_ans))){
                    correct++;
                }else{
                    wrong++;
                }
            }
        }
        var date = new Date(createdAt.seconds*1000);

        const submitedAt = date.getDate()+
        "/"+(date.getMonth()+1)+
        "/"+date.getFullYear()+
        " "+date.getHours()+
        ":"+date.getMinutes();
        return {
            correct_answers: correct,
            wrong_answers: wrong,
            submitedAt: submitedAt
        }
    } else {
        return null;
    }
}
const getAllFeedbackQuestionsFromAppId = async (appId) => {
    const feedbackCol = collection(db,'apps/'+appId+'/feedbackQuestions');
    const feedbackQuestions = await getDocs(feedbackCol);
    const res = {}
    feedbackQuestions.docs.forEach((doc) => {
        const dat = doc.data();
        res[doc.id] = {
            ...dat
        }
    })
    return res;
}
const getAllQuestionsForAppId = async (appId) => {
    const feedbackCol = collection(db,'apps/'+appId+'/Questions');
    const feedbackQuestions = await getDocs(feedbackCol);
    const res = {}
    feedbackQuestions.docs.forEach((doc) => {
        const dat = doc.data();
        res[doc.id] = {
            ...dat
        }
    })
    return res;
}
const getAllQuizQuestionsForAppId = async (appId) => {
    const feedbackCol = collection(db,'apps/'+appId+'/QuizQuestions');
    const feedbackQuestions = await getDocs(feedbackCol);
    const res = {}
    feedbackQuestions.docs.forEach((doc) => {
        const dat = doc.data();
        res[doc.id] = {
            ...dat
        }
    })
    return res;
}
const getFeedbackResponseFromRef = async (feedbackRef,feedbackQuestions) => {
    if( !feedbackRef ) throw new Error("feedbackRef is absent");
    const feedbackSnapshot = await getDoc(feedbackRef);
    if (feedbackSnapshot.exists) {
        const {questions,createdAt} = feedbackSnapshot.data()
        const response={};
        for(let i = 0; i < questions.length; i++){
            if(feedbackQuestions[questions[i].questionRef.id]){
                let parsedResponse = "";
                if(typeof questions[i].response === 'string'){
                    parsedResponse = questions[i].response;
                }else{
                    parsedResponse = questions[i].response.join(', ');
                }
                response[questions[i].questionRef.id] = parsedResponse;
            }           
        }
        return response;
    } else {
        return null;
    }
}
module.exports = {
    getAllUsersFromDatabase,
    getQuizResponseFromResponseRef,
    getFeedbackResponseFromRef,
    getAllUsersFromAppId,
    getAllFeedbackQuestionsFromAppId,
    getAllQuizQuestionsForAppId,
    getAllQuestionsForAppId,
    getResponseFromResponseRef
}