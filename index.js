// Copyright 2016 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const axios = require('axios');

const slackToken = 'xoxb-2608914200098-2611274860692-yhpDS3f7vBrlbGOFCOSTocP3';

exports.bananaSplit = (req, res) => {
  //const membersHashed = ["U02HG70MSA3", "U02HTTJSQLV", "U02HWT487NW"];
  const membersHashed = getChannelUsers(req.query.channel_id)
  const randomMember = membersHashed[Math.floor(Math.random()*membersHashed.length)];
  let message = `Cześć <@${randomMember}>, ${randomMember}, zostałeś wyznaczony do review!`;
  res.set('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({
    "response_type": "in_channel",
    "text": message
  }));
};

async function getChannelUsers(channel_id) {
  const url = `https://slack.com/api/conversations.members?channel=${channel_id}`;
  const res = await axios.get(url, { headers: { authorization: `Bearer ${slackToken}` } });
  return res.data.members;
}

