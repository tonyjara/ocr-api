# Simple Ocr nodejs api

This api takes in an image, analyzes it's content with OCR, then saves an original and a copy with the embedded text information.

It uses `tesseract.js`.

## Pre-requisites

Rename .env.template to .env and change the relevant data.

## Install

    npm install

## Run the app in dev

    npm run dev

## Run the tests

    *no testing yet*

# REST API

The REST API to the example app is described below.

## Get a 200 for testing

### Request

`GET /api/ocr/upload`

    curl -H 'Accept: application/json' -H 'x-api-key: my_api_key' http://localhost:8000/api/ocr/upload

### Response

    Ocr upload api feeling fine and dandy

## Get a 200 for testing

### Request

`POST /api/ocr/upload`

    curl --location --request POST 'http://localhost:8000/api/ocr/upload' \
    --header 'x-api-key: my_api_key' \
    --form 'image=@"/Users/nytoair/Downloads/Egresos/test pic.jpeg"'

### Response

```json
{
  "uuid": "uuid",
  "text": "text"
}
```

## Docker-compose

For local development:

    docker compose up

For production you can find files under the docker-prod dir. Don't forget to create your own .env file inside the same dir.

## Features

- Docker compose
- Ocr to pdf
- Easy ssl setup with caddy

## Known issues

- Ocr orientation auto-detect not working.
- traineddata lost whenever image is mounted again.
- Healthcheck not done.
