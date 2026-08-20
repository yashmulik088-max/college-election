
import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    runTransaction
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAjBcI7tyYFRZs5nN8YV_HAivzRHpdRJw8",
    authDomain: "college-election-7c9c8.firebaseapp.com",
    projectId: "college-election-7c9c8",
    storageBucket: "college-election-7c9c8.firebasestorage.app",
    messagingSenderId: "487920063747",
    appId: "1:487920063747:web:72ee00eedca6355a544536"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Registered students
const registeredStudents = {
    "2029": "Third Year",
    "2038": "Third Year",
    "2026": "Third Year",
    "2032": "Third Year"
};


let currentStudent = {
    rollNo: "",
    year: ""
};


// Verify student
window.verifyStudent = async function () {

    const rollNo =
        document.getElementById("rollNo").value.trim();

    const year =
        document.getElementById("year").value;

    const message =
        document.getElementById("loginMessage");


    if (!rollNo || !year) {
        message.style.color = "red";
        message.innerText =
            "Please enter Roll Number and select Year.";
        return;
    }


    if (!registeredStudents[rollNo]) {
        message.style.color = "red";
        message.innerText =
            "❌ Invalid Roll Number.";
        return;
    }


    if (registeredStudents[rollNo] !== year) {
        message.style.color = "red";
        message.innerText =
            "❌ Roll Number and Year do not match.";
        return;
    }


    try {

        const studentRef =
            doc(db, "students", rollNo);

        const studentSnap =
            await getDoc(studentRef);


        if (!studentSnap.exists()) {
            message.style.color = "red";
            message.innerText =
                "❌ Student is not registered in database.";
            return;
        }


        const student =
            studentSnap.data();


        if (student.voted === true) {
            message.style.color = "red";
            message.innerText =
                "❌ This Roll Number has already voted.";
            return;
        }


        currentStudent.rollNo = rollNo;
        currentStudent.year = year;


        document
            .getElementById("loginSection")
            .classList.add("hidden");


        document
            .getElementById("electionSection")
            .classList.remove("hidden");


        document.getElementById("studentInfo").innerText =
            "Roll No: " + rollNo +
            " | Year: " + year;

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.innerText =
            "Database connection error.";
    }
};


// Submit vote
window.submitVote = async function () {

    const selected =
        document.querySelector(
            'input[name="candidate"]:checked'
        );

    const message =
        document.getElementById("voteMessage");


    if (!selected) {
        message.style.color = "red";
        message.innerText =
            "Please select a candidate.";
        return;
    }


    const candidate = selected.value;


    try {

        const studentRef =
            doc(
                db,
                "students",
                currentStudent.rollNo
            );


        const voteRef =
            doc(
                db,
                "votes",
                candidate
            );


        await runTransaction(db, async (transaction) => {

            const studentSnap =
                await transaction.get(studentRef);

            const voteSnap =
                await transaction.get(voteRef);


            if (!studentSnap.exists()) {
                throw new Error("Student not found.");
            }


            const student =
                studentSnap.data();


            if (student.voted === true) {
                throw new Error(
                    "This student has already voted."
                );
            }


            const oldCount =
                voteSnap.exists()
                    ? voteSnap.data().count || 0
                    : 0;


            transaction.set(
                voteRef,
                {
                    count: oldCount + 1
                },
                { merge: true }
            );


            transaction.update(
                studentRef,
                {
                    voted: true
                }
            );

        });


        document
            .getElementById("electionSection")
            .classList.add("hidden");


        document
            .getElementById("successSection")
            .classList.remove("hidden");


        document.getElementById("voteDetails").innerText =
            "Roll No: " +
            currentStudent.rollNo +
            " | Vote recorded successfully.";

    } catch (error) {

        console.error(error);

        message.style.color = "red";

        message.innerText =
            "❌ " + error.message;
    }
};