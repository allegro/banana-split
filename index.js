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

const slackToken = process.env.SLACK_SECRET;

exports.bananaSplit = async (req, res) => {
    console.log(slackToken);
    getChannelUsers(req.body.channel_id).then((membersHashed) => {
        console.log('members Hashed ', membersHashed);
        console.log('channel_id ', req.body.channel_id);
        const randomMember = membersHashed[Math.floor(Math.random() * membersHashed.length)];
        console.log('randomMember ', randomMember);
        let message = `Cześć <@${randomMember}>, wyznaczono cię do review!`;
        sendMessage(req.body.channel_id, req.body.response_url, message)
        res.status(200);
    })
};

async function getChannelUsers(channel_id) {
    const url = `https://slack.com/api/conversations.members?channel=${channel_id}`;
    const res = await axios.get(url, {headers: {authorization: `Bearer ${slackToken}`}});
    console.log('url ', url);
    console.log('response data ', res.data);
    return res.data.members;
}

async function sendMessage(channel_id, response_url, message) {
    const res = await axios.post(response_url, {
        text: message,
    }, {headers: {authorization: `Bearer ${slackToken}`}});
    console.log('Send Message result', res.data)
}
