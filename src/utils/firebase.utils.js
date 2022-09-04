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

const getQuizResponseFromResponseRef = async (responseRef) => {
    if( !responseRef ) throw new Error("responseRef is absent");
    const responseSnapshot = await getDoc(responseRef);
    if (responseSnapshot.exists) {
        const {questions,createdAt} = responseSnapshot.data()
        let correct = 0;
        let wrong = 0;
        for(let i = 0; i < questions.length; i++){
            const questionSnapShot = await getDoc(questions[i].questionRef);
            if(questionSnapShot.exists){
                const { correct_answers } = questionSnapShot.data()
                if(correct_answers.find( correct_ans => correct_ans === questions[i].selectedAnswer)){
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

module.exports = {
    getAllUsersFromDatabase,
    getQuizResponseFromResponseRef
}