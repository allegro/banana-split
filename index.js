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
    const membersHashed = await getChannelUsers(req.body.channel_id)
    const randomMember = membersHashed[Math.floor(Math.random() * membersHashed.length)];
    let messageText = req.body.text;
    let pullRequestLink = getPullRequestLink(messageText)
    let message = messageText.replace(pullRequestLink, '')
    let notificationMessage = randomMember && `Cześć <@${randomMember}>, wyznaczono cię do review!` || 'Error!';

    await sendResponse(req.body.response_url,notificationMessage, pullRequestLink, message)
    await sendDM(randomMember, message)

    res.status(200).send('')
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

async function sendResponse(url, notificationMessage, link, message) {
    await axios.post(url,getMessage(notificationMessage, link, message),
        {headers: {authorization: `Bearer ${slackToken}`},});
}

function getMessage(notificationMessage, link, message){
    return{
        "response_type": "in_channel",
        "replace_original": true,
        "delete_original": true,
        "attachments": [
        {
            "color": "#36a64f",
            "pretext": message,
            "author_name": "BananaSplit",
            "title": "Pull Request Link",
            "title_link": link,
            "text": notificationMessage,
            "fields": [
                {
                    "title": "Priority",
                    "value": "High",
                    "short": false
                }
            ],
            "footer": "Allegro BananaSplit"
        }
    ]
    }
}

function getPullRequestLink(message){
    const urlExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    let regex = new RegExp(urlExpression);
    return regex.exec(message)[0];
}
