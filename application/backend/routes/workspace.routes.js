const express = require("express")
const {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
} = require("../controllers/workspace.controller")
const { protect } = require("../middleware/auth.middleware")

const router = express.Router()

router.use(protect)

router.route("/").post(createWorkspace).get(getWorkspaces)

router.route("/:id").get(getWorkspace).put(updateWorkspace).delete(deleteWorkspace)

module.exports = router
