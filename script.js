// ================================
// REGISTERED STUDENTS
// ================================

const registeredStudents = {
    "2029": "Third Year",
    "2038": "Third Year",
    "2026": "Third Year",
    "2032": "Third Year",
};


// ================================
// VOTE STORAGE
// ================================

let votes = JSON.parse(
    localStorage.getItem("collegeVotes")
) || {
    "Candidate 1": 0,
    "Candidate 2": 0,
    "Candidate 3": 0
};


// ================================
// CURRENT STUDENT
// ================================

let currentStudent = {
    rollNo: "",
    year: ""
};


// ================================
// VERIFY ROLL NUMBER
// ================================

function verifyStudent() {

    const rollNo =
        document.getElementById("rollNo")
            .value.trim();

    const selectedYear =
        document.getElementById("year")
            .value;

    const message =
        document.getElementById("loginMessage");


    // Empty check
    if (rollNo === "" || selectedYear === "") {

        message.style.color = "red";

        message.innerText =
            "Please enter Roll Number and select Year.";

        return;
    }


    // Roll number check
    if (!registeredStudents[rollNo]) {

        message.style.color = "red";

        message.innerText =
            "❌ Invalid Roll Number. You are not registered.";

        return;
    }


    // Year check
    if (registeredStudents[rollNo] !== selectedYear) {

        message.style.color = "red";

        message.innerText =
            "❌ Roll Number does not belong to selected year.";

        return;
    }


    // Check already voted
    const votedStudents =
        JSON.parse(
            localStorage.getItem("votedStudents")
        ) || [];


    if (votedStudents.includes(rollNo)) {

        message.style.color = "red";

        message.innerText =
            "❌ This Roll Number has already voted.";

        return;
    }


    // Save current student
    currentStudent.rollNo = rollNo;
    currentStudent.year = selectedYear;


    // Hide verification
    document.getElementById(
        "loginSection"
    ).classList.add("hidden");


    // Show election
    document.getElementById(
        "electionSection"
    ).classList.remove("hidden");


    document.getElementById(
        "studentInfo"
    ).innerText =
        "Roll No: " +
        rollNo +
        " | Year: " +
        selectedYear;
}


// ================================
// SUBMIT VOTE
// ================================

function submitVote() {

    const selectedCandidate =
        document.querySelector(
            'input[name="candidate"]:checked'
        );


    const message =
        document.getElementById("voteMessage");


    if (!selectedCandidate) {

        message.style.color = "red";

        message.innerText =
            "Please select a candidate.";

        return;
    }


    const candidate =
        selectedCandidate.value;


    // Add vote
    votes[candidate]++;


    // Save vote count
    localStorage.setItem(
        "collegeVotes",
        JSON.stringify(votes)
    );


    // Get voted students
    const votedStudents =
        JSON.parse(
            localStorage.getItem("votedStudents")
        ) || [];


    // Add roll number
    votedStudents.push(
        currentStudent.rollNo
    );


    // Save voted student
    localStorage.setItem(
        "votedStudents",
        JSON.stringify(votedStudents)
    );


    // Hide election
    document.getElementById(
        "electionSection"
    ).classList.add("hidden");


    // Show success
    document.getElementById(
        "successSection"
    ).classList.remove("hidden");


    document.getElementById(
        "voteDetails"
    ).innerText =
        "Roll No: " +
        currentStudent.rollNo +
        " | Vote recorded successfully.";
}