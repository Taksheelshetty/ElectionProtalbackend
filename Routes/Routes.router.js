const router = require("express").Router();
const {
  login,
  logout,
  sendInfo,
  register,
  castVote,
} = require("../controllers/Usersession.controller");

const  CreateTables  = require("../controllers/CreateTable.controller");
const {
  CandidateList,
  Candidateregisteration,
} = require("../controllers/Candidate.controller");

router.route("/CreateTables").get(CreateTables);
router.route("/Login").post(login);
router.route("/register").post(register);
router.route("/sendinfo").post(sendInfo);
router.route("/logout").delete(logout);
router.route("/Candidateregisteration").post(Candidateregisteration);
router.route("/CandidateList").post(CandidateList);
router.route("/castVote").post(castVote);

module.exports = router;
