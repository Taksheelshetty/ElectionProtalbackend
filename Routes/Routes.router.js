const router = require("express").Router();
const {
  login,
  logout,
  sendInfo,
  register,
  castVote,
  UpcomingElection,
} = require("../controllers/Usersession.controller");

const CreateTables = require("../controllers/CreateTable.controller");
const {
  CandidateList,
  Candidateregisteration,
} = require("../controllers/Candidate.controller");

const {getAllStudents,getAllCandiates} = require("../controllers/Admin.controller");

router.route("/CreateTables").get(CreateTables);
router.route("/Login").post(login);
router.route("/register").post(register);
router.route("/sendinfo").post(sendInfo);
router.route("/logout").delete(logout);
router.route("/Candidateregisteration").post(Candidateregisteration);
router.route("/CandidateList").post(CandidateList);
router.route("/castVote").post(castVote);
router.route("/UpcomingElection").post(UpcomingElection);
router.route("/AllStudent").post(getAllStudents);
router.route("/AllCandidates").post(getAllCandiates);

module.exports = router;
