const { createGroup, getGroupMessages, addGroupMessage, getAllGroups, addAMemberintoGroup, leaveTheGroup, deleteTheMessage, deleteTheGroup } = require("../controllers/groupController");
const router = require("express").Router();

router.post("/create", createGroup);
router.post("/messages", getGroupMessages);
router.post("/addmessage", addGroupMessage);
router.get("/allgroups/:id", getAllGroups);
router.patch("/addamember", addAMemberintoGroup);
router.delete("/deletethegroup",deleteTheGroup);
router.delete("/deletethemessage",deleteTheMessage);
router.delete("/leavegroup",leaveTheGroup);
module.exports = router;
