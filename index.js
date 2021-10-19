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
    const membersHashed = await getChannelUsers(req.body.channel_id)
    console.log('members Hashed ', membersHashed);
    console.log('channel_id ', req.body.channel_id);
    const randomMember = membersHashed[Math.floor(Math.random() * membersHashed.length)];
    console.log('randomMember ', randomMember);
    let prLink = req.body.text;
    let message = randomMember && `Cześć <@${randomMember}>, wyznaczono cię do review! ${prLink}` || 'Error!';
    sendDM(randomMember, message);
    let commandMessage = getLatestMessage(req.body.channel_id);
    replyInThread(req.body.response_url, message, commandMessage.ts);
    res.status(200).json({
        "response_type": "in_channel",
        "replace_original": true,
        "delete_original": true,
        "text": message
    });
};

async function getChannelUsers(channel_id) {
    const url = `https://slack.com/api/conversations.members?channel=${channel_id}`;
    const res = await axios.get(url, {headers: {authorization: `Bearer ${slackToken}`}});
    console.log('url ', url);
    console.log('response data ', res.data);
    return res.data.members || [];
}

async function sendDM(user_id, message) {
    const url = 'https://slack.com/api/chat.postMessage';
    await axios.post(url, {
        channel: user_id,
        text: message,
    }, {headers: {authorization: `Bearer ${slackToken}`}});
    console.log("Send DM")
}

async function getLatestMessage(channel_id) {
    console.log("getting latest message")
    const url = `https://slack.com/api/conversations.history`;
    const res = await axios.post(url, {
        channel: channel_id,
        limit: 1,
    }, {headers: {
        authorization: `Bearer ${slackToken}`},
        'Content-type': 'application/json'});
    console.log('response data ', res.data);
    console.log('response data message', res.data.message);
    console.log('response data messages', res.data.messages);
    return res.data.messages[0];
}

async function replyInThread(response_url, message, ts){
    await axios.post(response_url, {
        text: message,
        response_type: 'in_channel',
        thread_ts: ts,
    }, { headers: {
            authorization: `Bearer ${slackToken}`,
            'Content-type': 'application/json'
        } }).then(() => console.log("Replied in thread"));
}