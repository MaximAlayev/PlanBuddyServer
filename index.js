var PORT = process.env.PORT || 5000
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

var restarauntDict = {};
var upvoteDict = {};

// Restaraunt Dict contains keys that are pollIds
//    the values to those keys are dictionaries who's keys are restaraunt names
//        the values to those keys are upvote counts

// Upvote Dict contains keys that are pollIds
//    the values to those keys are dictionaries who's keys are userIds
//        the values to those keys are a dictionary who's keys are restaraunt names
//          the values to those keys are booleans

app.use(cors());
app.options('*', cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested_With, Content-Type, Accept');
  next();
});


function orderedRestarauntList(pollId) {
  var rl = []
  for (var name in restarauntDict[pollId]) {
    upvote_count = restarauntDict[pollId][name]
    rl.push([name, upvote_count])
  }
  ordered_rl = rl.sort((a,b) => b[1] - a[1])
  return ordered_rl
}

app.get("/api/get-restaraunt-list/:pollId/:userId", (req, res) => {
  if (restarauntDict[req.params.pollId] == undefined) {
    restarauntDict[req.params.pollId] = {}
  }
  if (upvoteDict[req.params.pollId][req.params.userId] == undefined) {
    upvoteDict[req.params.pollId][req.params.userId]  = {}
  }
  for (var name in restarauntDict[pollId]) {
    if (upvoteDict[req.params.pollId][req.params.userId][name] == undefined) {
      upvoteDict[req.params.pollId][req.params.userId][name] == False
    }
  }
  res.send(orderedRestarauntList(req.params.pollId))
})

app.get("/api/get-upvote-dict/:pollId/:userId", (req, res) => {
  res.send(restarauntDict[req.params.pollId][req.params.userId])
})

app.post("/api/add-restaraunt", (req, res) => {
  pollId = req.body.pollId
  userId = req.body.userId
  restarauntName = req.body.restarauntName
  upvoteDict[pollId][userId][restarauntName] = True
  restarauntDict[pollId][restarauntName] = 1
  res.send("Success")
})

app.post("/api/upvote-restaraunt", (req, res) => {
  pollId = req.body.pollId
  userId = req.body.userId
  restarauntName = req.body.restarauntName
  upvoteDict[pollId][userId][restarauntName] = True
  restarauntDict[pollId][restarauntName] = restarauntDict[pollId][restarauntName] + 1
  res.send("Success")
})

app.post("/api/downvote-restaraunt", (req, res) => {
  pollId = req.body.pollId
  restarauntName = req.body.restarauntName
  userId = req.body.userId
  upvoteDict[pollId][userId][restarauntName] = False
  restarauntDict[pollId][restarauntName] = restarauntDict[pollId][restarauntName] - 1
  res.send("Success")
})

app.listen(PORT, () => {
  console.log("running on port 5000")
});
