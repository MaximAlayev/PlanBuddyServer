var PORT = process.env.PORT || 5000
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

var restarauntDict = {};
// Restaraunt lists contains lists of size 2 where the first index is the restaraunt
// and the second index is the upvote count

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

app.get("/api/get-restaraunt-list/:pollId", (req, res) => {
  if (restarauntDict[req.params.pollId] == undefined) {
    restarauntDict[req.params.pollId] = {}
  }
  res.send(orderedRestarauntList(req.params.pollId))
})

app.post("/api/add-restaraunt", (req, res) => {
  pollId = req.body.pollId
  restarauntName = req.body.restarauntName
  restarauntDict[pollId][restarauntName] = 1
  res.send("Success")
})

app.post("/api/upvote-restaraunt", (req, res) => {
  pollId = req.body.pollId
  restarauntName = req.body.restarauntName
  restarauntDict[pollId][restarauntName] = restarauntDict[pollId][restarauntName] + 1
  res.send("Success")
})

app.post("/api/downvote-restaraunt", (req, res) => {
  pollId = req.body.pollId
  restarauntName = req.body.restarauntName
  restarauntDict[pollId][restarauntName] = restarauntDict[pollId][restarauntName] - 1
  res.send("Success")
})

app.listen(PORT, () => {
  console.log("running on port 5000")
});
