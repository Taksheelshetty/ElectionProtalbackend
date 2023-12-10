const config = require("../utlils/db");

const CreateTables = async (req, res) => {
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
      CREATE TABLE IF NOT EXISTS ElectionTimeTable(
        ElectionID int AUTO_INCREMENT unique not null, 
        ElectionName varchar(50),
        ElectionDescription varchar(100),
        constraint pk7 primary key(ElectionID)
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
          UserID int not null unique,
          CandidateID int not null,
          time varchar(50) not null,
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
};

module.exports = CreateTables;
