# Pigeon Post

An Amazon SES E-Mail Scheduler & Delivery API.

[![Build
Status](https://travis-ci.org/tbranyen/pigeonpost.svg)](https://travis-ci.org/tbranyen/pigeonpost)


## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Redis](http://redis.io/)
* [Crontab](http://crontab.org/)

Note: Due to the dependency on Crontab, this application will [not run easily on
Windows](http://stackoverflow.com/questions/132971/what-is-the-windows-version-of-cron).

## Installation

``` sh
npm install pigeonpost
```

Set your Amazon SES credentials in a JSON file as [outlined in their official
docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Disk):


``` json
{
  "accessKeyId": "test_key",
  "secretAccessKey": "test_secret",
  "region": "us-east-1"
}
```

## Usage

By design this application is meant to be standalone on a server and act as a
server daemon.  If you would like to directly integrate with your pre-existing
server, this application also acts as express middleware.

#### Environment variable configuration

To inform this module where the secrets file lives, set an environment
variable `AWS_SES_SECRETS` to the absolute fully qualified path on disk.  It
must be absolute as it may be run from various locations.

For example your variable may look like:

``` sh
export AWS_SES_SECRETS=/mnt/secrets/ses.json
```

## API

The API should follow [JSON-API](http://jsonapi.org/) for errors and data.  You
must set the content type request header to JSON.

*Note: jQuery and other popular request libraries may add this automatically.*

``` http
Content-Type: application/json
```

### Documentation

#### Sending

This is the endpoint you'll hit when you want to immediately send an email.
Useful for one off emails, such as new account registration or forgot password.

Description                     | Method   | Endpoint
:------------------------------ | :------- | :--------
[Send an email](#send-an-email) | `POST`   | `/send`


##### Send an email:

``` sh
curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d \
  '{
     "to": ["tim@tabdeveloper.com"],
     "from": "tim@tabdeveloper.com",
     "subject": "A test subject!",
     "body": "Test message"
   }' \
  http://localhost:8000/send
```

Response:

``` json
{
  "data": {
    "ResponseMetadata": {
      "RequestId":"2263f1cc-fccf-21e4-a378-4350dc3a1cea"
    },

    "MessageId": "1120014e6373fd1e-2bdf239f-21bf-4c1f-b299-36eacb54dbc6-000000"
  }
}
```

#### Pollers

These are jobs that are executed on a specific schedule.  They are assigned using
Crontab, and allow any valid schedule expression within that format.  You would
use this endpoint to schedule emails to be sent every day/month/year, schedule
an email to be sent 5 minutes from now, etc.


Description                                                    | Method   | Endpoint
:------------------------------------------------------------- | :------- | :--------
[Create a new poller](#create-a-new-poller)                    | `POST`   | `/poll`
[Create or update new poller](#create-or-update-new-poller)    | `PUT`    | `/poll`
[Get all pollers](#get-all-pollers)                            | `GET`    | `/poll`
[Get specific poller](#get-specific-poller)                    | `GET`    | `/poll/:id`
[Delete specific poller](#delete-specific-poller)              | `DELETE` | `/poll/:id`

##### Create a new poller:

``` sh
curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d \
  '{
     "uuid": "test-uuid",
   }' \
  http://localhost:8000/poll
```

Response:

``` json
{
  "data": {}
}
```

##### Create or update new poller:

``` sh
curl \
  -H "Content-Type: application/json" \
  -X PUT \
  -d \
  '{
     "uuid": "test-uuid",
   }' \
  http://localhost:8000/poll
```

Response:

``` json
{
  "data": {}
}
```

##### Get all pollers:

``` sh
curl \
  -X GET \
  http://localhost:8000/poll
```

Response:

``` json
{
  "data": []
}
```

##### Get specific poller:

``` sh
curl \
  -X GET \
  http://localhost:8000/poll/<id>
```

Response:

``` json
{
  "data": {}
}
```

##### Delete specific poller:

``` sh
curl \
  -X DELETE \
  http://localhost:8000/poll/<id>
```

Response:

``` json
{
  "data": {}
}
```

## Running / Development

``` sh
npm start
```

Visit the server at [http://localhost:8000](http://localhost:8000).

### Running Tests

``` sh
npm test
```
