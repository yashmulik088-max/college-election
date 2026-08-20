// Candidate vote storage
let votes = JSON.parse(
    localStorage.getItem("collegeVotes")
) || {
    "Candidate 1": 0,
    "Candidate 2": 0,
    "Candidate 3": 0
};


// Student information
let currentStudent = {
    rollNo: "",
    year: ""
};


// Verify student
function verifyStudent() {

    const rollNo =
        document.getElementById("rollNo").value.trim();

    const year =
        document.getElementById("year").value;

    const message =
        document.getElementById("loginMessage");


    if (rollNo === "" || year === "") {

        message.style.color = "red";

        message.innerText =
            "Please enter Roll Number and select Year.";

        return;
    }


    // Check whether this student already voted
    const votedStudents =
        JSON.parse(
            localStorage.getItem("votedStudents")
        ) || [];


    if (votedStudents.includes(rollNo)) {

        message.style.color = "red";

        message.innerText =
            "This Roll Number has already voted.";

        return;
    }


    currentStudent.rollNo = rollNo;
    currentStudent.year = year;


    document.getElementById(
        "loginSection"
    ).classList.add("hidden");


    document.getElementById(
        "electionSection"
    ).classList.remove("hidden");


    document.getElementById(
        "studentInfo"
    ).innerText =
        "Roll No: " + rollNo +
        " | Year: " + year;
}


// Submit vote
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


    // Increase vote
    votes[candidate]++;


    // Save votes
    localStorage.setItem(
        "collegeVotes",
        JSON.stringify(votes)
    );


    // Save student as voted
    const votedStudents =
        JSON.parse(
            localStorage.getItem("votedStudents")
        ) || [];


    votedStudents.push(
        currentStudent.rollNo
    );


    localStorage.setItem(
        "votedStudents",
        JSON.stringify(votedStudents)
    );


    // Hide election page
    document.getElementById(
        "electionSection"
    ).classList.add("hidden");


    // Show success page
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