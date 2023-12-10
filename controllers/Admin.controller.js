const config = require("../utlils/db");

const getAllStudents = (req, res) => {
  const userInfo = req.cookies.user;
  console.log(userInfo);
  if (userInfo != undefined) {
    try {
      console.log(userInfo[0].BranchID);
      const query = `
        SELECT * FROM student WHERE BranchID = ${userInfo[0].BranchID};
      `;
      config.query(query, (error, results, fields) => {
        if (error) {
          console.error("Error connecting to sever:", error);
          res.status(500).send("Error connecting to sever.");
        } else {
          res.status(200).send(results);
        }
      });
    } catch {
      console.log(err);
      res.status(500).send("Internal error");
    }
  } else {
    res.status(501).send("User Cookie expired");
  }
};

const getAllCandiates = async (req, res) => {
  const userInfo = req.cookies.user;
  const studentsQuery = `SELECT * FROM candidate WHERE BranchID = ${userInfo[0].BranchID}`;
  config.query(studentsQuery, (CandidateError, CandidateResults) => {
    if (CandidateError) {
      console.error("Error retrieving students:", studentsError);
      res.status(500).send("Error retrieving students.");
      return;
    }
    res.status(200).send(CandidateResults);
  });
};

module.exports = { getAllStudents, getAllCandiates };
