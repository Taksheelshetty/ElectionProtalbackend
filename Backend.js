const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
};

// Create Express app
const app = express();
const port = 3001; // Change the port to 3001 to match the frontend configuration

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// MySQL Connection
const config = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

config.connect((err) => {
  if (err) {
    console.error("Error connecting ", err);
    return;
  }
  console.log("Connected");
});
app.get("/CreateTables", async (req, res) => {
  try {
    await config.query(`
      CREATE TABLE IF NOT EXISTS Branch(
        BranchID int AUTO_INCREMENT unique not null, 
        BranchName varchar(50),
        BranchDescription varchar(100),
        BranchPassword varchar(20) unique not null,
        constraint pk1 primary key(BranchID)
      );
    `);

    await config.query(`
      CREATE TABLE IF NOT EXISTS Student(
        UserID int AUTO_INCREMENT not null unique,
        BranchID int not null,
        UserName varchar(30) not null unique,
        UserPassword varchar(10) not null,
        UserEmail varchar(30) not null,
        Hasbacklog bit default(0),
        Access ENUM('Student', 'Admin', 'Branch') NOT NULL,
        VoteCasted bit default(0),
        constraint pk2 primary key(UserID, UserName),
        constraint fk3 foreign key(BranchID) references Branch(BranchID)
      );
    `);

    await config.query(`
      CREATE TABLE IF NOT EXISTS Candidate(
        CandidateID int AUTO_INCREMENT unique not null,
        BranchID int not null,
        CandidateName varchar(30) not null,
        Position ENUM('President', 'VicePresident','Branch') NOT NULL,
        VoteCount int,
        UserID int not null unique,
        constraint fk4 foreign key(BranchID) references Branch(BranchID),
        constraint fk5 foreign key(UserID) references Student(UserID),
        constraint pk3 primary key(CandidateID)
      );
    `);

    await config.query(`
      CREATE TABLE IF NOT EXISTS VoteBank(
        VoteID int AUTO_INCREMENT unique not null,
        UserID int not null,
        CandidateID int not null,
        time Time not null,
        constraint pk4 primary key (VoteID),
        constraint fk6 foreign key(UserID) references Student(UserID),
        constraint fk7 foreign key(CandidateID) references Candidate(CandidateID)
      );
    `);

    res.send("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
    res.status(500).send("Error creating tables.");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { UserName, UserPassword, UserEmail, Access, BranchID } = req.body;

    const queryString = `
      INSERT INTO Student (UserName, UserPassword, UserEmail, Access, BranchID)
      VALUES (?, ?, ?, ?, ?);
    `;

    const values = [UserName, UserPassword, UserEmail, Access, BranchID];

    config.query(queryString, values, (error, results, fields) => {
      if (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user.");
      } else {
        res.cookie("user", UserName, { maxAge: 1800000, httpOnly: true });
        res.send("User registered successfully.");
      }
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Error registering user.");
  }
});

app.post("/login", async (req, res) => {
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
});

app.post("/sendInfo", (req, res) => {
  const userInfo = req.cookies.user;
  console.log(userInfo);
  if (userInfo != undefined) {
    try {
      console.log(userInfo);
      res.status(200).send(userInfo);
    } catch {
      console.log(err);
      res.status(500).send("Internal error");
    }
  } else {
    res.status(501).send("User Cookie expired");
  }
});

app.delete("/logout", (req, res) => {
  try {
    const userInfo = req.cookies.user;
    if (userInfo) {
      res.clearCookie("user");
      res.send("logged out");
    }
  } catch {
    res.status(500).send("Error");
  }
});

app.post("/CandidateList", async (req, res) => {
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
});

app.post("/Candidateregisteration", (req, res) => {
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
});

app.post("/castVote",(req,res)=>{
  
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
