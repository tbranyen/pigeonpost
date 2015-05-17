# Pigeon Post

An Amazon SES E-Mail Scheduler & Delivery API

[![Build
Status](https://travis-ci.org/tbranyen/pigeonpost.svg)](https://travis-ci.org/tbranyen/pigeonpost)


## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Redis](http://redis.io/)
* [Crontab](http://crontab.org/)

Note: Due to the dependency on Crontab, this application will not run easily on
Windows.

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

##### Send an email:

Method   | Endpoint
:------- | :--------
`POST`   | `/send`

##### Example:

``` sh
curl \
  # Ensure you're sending a valid Content-Type header.
  -H "Content-Type: application/json" \

  # Use POST.
  -X POST \

  # Send the JSON as a string in the request body.
  -d '{"to":"xyz","password":"xyz"}' \

  # Point to your api endpoint.
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

<table width="100%">

<thead>
  <tr>
    <th>Description</th>
    <th>URL</th>
    <th>Method</th>
    <th>Request</th>
    <th>Response</th>
  </tr>
</thead>

<tbody>
  <!-- Create poller -->
  <tr>
    <td>Send an e-mail</td>
    <td>`/send`</td>
    <td>`POST`</td>
    <td>
<pre class="highlight"><code>{
  "to": ["tim@tabdeveloper.com"],
  "from": "tim@bocoup.com",
  "subject": "Testing this out!!!",
  "body": "The <b>HTML capable</b> email message body!"
}</code></pre>
    </td>
    <td valign="top">
      Body:
      <pre class="highlight"><code>{}</code></pre></td>
  </tr>
</tbody>
</table>

#### Pollers

These are jobs that are executed on a specific schedule.  They are assigned using
Crontab, and allow any valid schedule expression within that format.  You would
use this endpoint to schedule emails to be sent every day/month/year, schedule
an email to be sent 5 minutes from now, etc.

<table width="100%">

<thead>
  <tr>
    <th>Description</th>
    <th>URL</th>
    <th>Method</th>
    <th>Request</th>
    <th>Response</th>
  </tr>
</thead>

<tbody>
  <!-- Create poller -->
  <tr>
    <td>Create a new poller</td>
    <td>`/poll`</td>
    <td>`POST`</td>
    <td valign="top">
<pre class="highlight"><code>{
  "id": "test-uuid"
}</code></pre>
    </td>
    <td valign="top">
      <pre class="highlight"><code>{
  "id": "test-uuid"
}</code></pre></td>
  </tr>

  <!-- Create or update poller -->
  <tr>
    <td>Create or update new poller</td>
    <td>`/poll`</td>
    <td>`PUT`</td>
    <td valign="top">
<pre class="highlight"><code>{
  "id": "test-uuid"
}</code></pre>
    </td>
    <td valign="top">
      <pre class="highlight"><code>{
  "id": "test-uuid"
}</code></pre></td>
  </tr>

  <!-- Get all pollers -->
  <tr>
    <td>Get all pollers</td>
    <td>`/poll`</td>
    <td>`GET`</td>
    <td valign="top">
<pre class="highlight"><code>null</code></pre>
    </td>
    <td valign="top">
      <pre class="highlight"><code>{
  "data": [{
    "id": "test-uuid"
  }]
}</code></pre></td>
  </tr>

  <!-- Get a specific poller -->
  <tr>
    <td>Get a specific poller</td>
    <td>`/poll/:id`</td>
    <td>`GET`</td>
    <td valign="top">
<pre class="highlight"><code>null</code></pre>
    </td>
    <td valign="top">
      <pre class="highlight"><code>{
  "data": {
    "id": "test-uuid"
  }
}</code></pre></td>
  </tr>

  <!-- Delete a specific poller -->
  <tr>
    <td>Delete a specific poller</td>
    <td>`/poll/:id`</td>
    <td>`DELETE`</td>
    <td valign="top">
<pre class="highlight"><code>null</code></pre>
    </td>
    <td valign="top">
      <pre class="highlight"><code>{
  "data": {
    "id": "test-uuid"
  }
}</code></pre></td>
  </tr>
</tbody>
</table>


## Running / Development

* `npm start`
* Visit your app at [http://localhost:8000](http://localhost:8000).

### Running Tests

* `npm test`
