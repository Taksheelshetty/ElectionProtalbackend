const config = require("../utlils/db");

const register = async (req, res) => {
  try {
    const { UserName, UserPassword, UserEmail, Access, BranchID } = req.body;

    const queryString = `
        INSERT INTO Student (UserName, UserPassword, UserEmail, Access, BranchID)
        VALUES (?, ?, ?, ?, ?);
      `;

    const values = [UserName, UserPassword, UserEmail, Access, BranchID];

    config.query(queryString, values, (error, results, fields) => {
      if (error) {
        console.error("User Already Exists:", error);
        res.status(500).send("Error.");
      } else {
        // res.cookie("user", UserName, { maxAge: 1800000, httpOnly: true });
        res.status(200).send("User registered successfully.");
      }
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Error registering user.");
  }
};

const login = async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    console.log(req.headers.cookie);
    if (!req.headers.cookie) {
      const { username, password } = req.body;
      console.log(username);
      console.log(password);
      const query = `
        SELECT UserID,BranchID,UserName,UserEmail,Hasbacklog,Access,VoteCasted FROM Student WHERE UserName = ? AND UserPassword = ?;
      `;
      config.query(query, [username, password], (error, results, fields) => {
        if (error) {
          console.error("Error connecting to sever:", error);
          res.status(500).send("Error connecting to sever.");
        } else {
          console.log(results);
          if (results.length > 0) {
            res.cookie("user", results, { maxAge: 1800000, httpOnly: true });
            res.send("Login successful");
          } else {
            res.status(401).send("Invalid credentials");
          }
        }
      });
    } else {
      console.log("already logined");
      res.status(200).send("Already login");
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const sendInfo = (req, res) => {
  const userInfo = req.cookies.user;

  console.log(userInfo);
  if (userInfo != undefined) {
    try {
      console.log(userInfo[0].BranchID);
      const query = `
        SELECT BranchName FROM branch WHERE BranchID = ${userInfo[0].BranchID};
      `;
      config.query(query, (error, results, fields) => {
        if (error) {
          console.error("Error connecting to sever:", error);
          res.status(500).send("Error connecting to sever.");
        } else {
          console.log(results[0].BranchName);
          userInfo[0].BranchName = results[0].BranchName;
          console.log(userInfo);
          res.status(200).send(userInfo);
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

const logout = (req, res) => {
  try {
    const userInfo = req.cookies.user;
    if (userInfo) {
      res.clearCookie("user");
      res.send("logged out");
    }
  } catch {
    res.status(500).send("Error");
  }
};

const UpcomingElection = (req, res) => {
  const query = `SELECT * FROM electiontimetable`;
  config.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error getting upcoming election:", error);
      res.status(500).send("Error getting upcoming election.");
    } else {
      res.status(200).send(results);
      console.log(results);
    }
  });
};

const castVote = (req, res) => {
  const { UserID, CandidateID } = req.body;
  const date = new Date().toISOString();
  const insertQuery = `
      INSERT INTO VoteBank (UserID, CandidateID, time)
      VALUES (?, ?, ?);
    `;

  const updateStudentQuery = `
      UPDATE Student SET VoteCasted = '1' WHERE UserID = ?;
    `;

  const updateCandidateQuery = `
      UPDATE Candidate 
      SET VoteCount = (SELECT COUNT(CandidateID) FROM VoteBank WHERE CandidateID = ?)
      WHERE CandidateID = ?;
    `;

  const values = [UserID, CandidateID, date];

  try {
    config.query(insertQuery, values, (error, results, fields) => {
      if (error) {
        console.error("Already Casted");
        res.status(200).send("Vote has been Already Casted ");
      } else {
        config.query(updateStudentQuery, [UserID], (error, results, fields) => {
          if (error) {
            console.error("Error updating student:", error);
            res.status(500).send("Error casting vote.");
          } else {
            config.query(
              updateCandidateQuery,
              [CandidateID, CandidateID],
              (error, results, fields) => {
                if (error) {
                  console.error("Error updating candidate:", error);
                  res.status(500).send("Error casting vote.");
                } else {
                  res.status(200).send("Vote casted successfully.");
                }
              }
            );
          }
        });
      }
    });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(200).send("Error casting vote.");
  }
};

module.exports = {
  login,
  logout,
  sendInfo,
  register,
  castVote,
  UpcomingElection,
};
