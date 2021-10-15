gcloud functions deploy bananaSplit \
--runtime nodejs14 \
--trigger-http \
--allow-unauthenticated


<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# Google Cloud Functions - Slack Slash Command sample

See:

* [Cloud Functions Slack tutorial][tutorial]
* [Cloud Functions Slack sample source code][code]

[tutorial]: https://cloud.google.com/functions/docs/tutorials/slack
[code]: index.js

## Deploy and run the sample

See the [Cloud Functions Slack tutorial][tutorial].

## Run the tests

1. Read and follow the [prerequisites](../../#how-to-run-the-tests).

1. Install dependencies:

        npm install

1. Run the tests:

        npm test
