# Pigeon Post

[![Build Status](https://travis-ci.org/tbranyen/pigeonpost.svg)](https://travis-ci.org/tbranyen/pigeonpost)

An Amazon SES E-Mail Scheduler & Delivery API

The following outlines the details for collaborating on this Node application.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Redis](http://redis.io/)
* [Crontab](http://crontab.org/)

Note: Due to the dependency on Crontab, this application will not run
easily on Windows.

## Installation

* `npm install pigeonpost`

Set your Amazon SES credentials in a JSON file as outlined in their official
docs:

http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Disk


```json
{
  "accessKeyId": "test_key",
  "secretAccessKey": "test_secret",
  "region": "us-east-1"
}
```

To inform this module where the aforementioned file lives, set the environment
variable `AWS_SES_SECRETS` to an absolute fully qualified path on disk to the
JSON file.  It must be absolute and fully qualified as it may run from various
locations.

## Usage

By design this application is meant to be standalone on a server and act as a
server daemon.  If you would like to directly integrate with your pre-existing
server, this application also acts as express middleware.

## API

The API should follow [JSON-API](http://jsonapi.org/) for errors and data.  You
must set the content type request header to JSON.

*Note: jQuery and other popular request libraries may add this automatically.*

``` http
Content-Type: application/json
```

The API is versioned and the current stable is **v1**.  Therefore you should
format your requests like so: `http://<mydomain>.com/api/v1`

### Documentation

#### Sending

This is the endpoint you'll hit when you want to immediately send an email.
Useful for one off emails, such as new account registration or forgot password.

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
