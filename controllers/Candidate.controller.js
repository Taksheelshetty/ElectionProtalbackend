const config= require('../utlils/db');

const CandidateList = async (req, res) => {
  const userInfo = req.cookies.user;
  console.log(userInfo);
  if (userInfo != undefined) {
    try {
      const queryString = `select * from Candidate where BranchID=${userInfo[0].BranchID};`;
      config.query(queryString, userInfo, (error, results, fields) => {
        if (error) {
          console.error("Error", error);
          res.status(500).send("Candidate list error");
        } else {
          console.log(results);
          res.status(200).send(results);
        }
      });
    } catch (err) {
      console.error("Error", err);
      res.status(500).send("Candidate list error");
    }
  } else {
    res.status(501).send("User Cookie expired");
  }
};

const Candidateregisteration = (req, res) => {
  const VoteCount = 0;
  const { BranchID, UserName, UserID, Position } = req.body;
  console.log(BranchID);
  const query = `
      INSERT INTO Candidate (BranchID, CandidateName, Position, VoteCount, UserID)
      VALUES (?, ?, ?, ?,?);
    `;
  const values = [BranchID, UserName, Position, VoteCount, UserID];
  try {
    config.query(query, values, (error, results, fields) => {
      if (error) {
        res.status(200).send({ message: "Candidate Already Registered" });
      } else {
        res.status(200).send({ message: "Succussful Candidate Registeration" });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  CandidateList,
  Candidateregisteration,
};
