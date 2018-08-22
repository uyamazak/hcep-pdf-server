# hcep-pdf-server

Simple and fast PDF rendering server using Headless Chrome & Express & Puppeteer.

Headless Chrome
<https://developers.google.com/web/updates/2017/04/headless-chrome>

Express
<http://expressjs.com/>

Puppeteer
<https://github.com/GoogleChrome/puppeteer>

## Getting Started

### Caution
Since this product is supposed to be used within local network (like Kubernetes, Google Kubernetes Engine), error control and security measures are minimum, please accept only reliable requests. It does not assume direct disclosure to the outside.


### Clone
git clone this repository.


### (optionary) Install fonts
If you convert pages in Japanese, Chinese or languages other than English, you will need to install each font files. Also, you can use WEB fonts, but since it takes a long time for requesting and downloading them, we recommend that install the font files in the server.


```
cp AnyFonts.ttf ./fonts/
```


### Build image

```
sudo docker build -t hcep-pdf-server:latest .
```

### Run

Below example, run with 8000 port.

```
sudo docker run -it --rm \
    -p 8000:8000 \
    --name hcep-pdf-server \
    hcep-pdf-server:latest
```

## Example

### Get request with url parameter

```
curl "http://localhost:8000?url=http://example.com" -o hcep-pdf-get.pdf
```

### POST request with html parameter

```
curl -sS http://localhost:8000 -v -d html=hcep-pdf-ok -o hcep-pdf-post.pdf
```

Please note that because the page does not have a URL, when sending html in POST method, you can not use a relative path.

So, you need to include external files with domain.

Bad, not working

```
<link href="/static/style.css" rel="stylesheet">
```

OK

```
<link href="http://example.com/static/style.css" rel="stylesheet">
```

## Env variables
### HCEP_USE_CHROMIUM
Whether to use chromium attached to puppeteer.
If you want to run this on Google App Engine, you must set it to "true".

default: false (use Chrome)

### HCEP_CHROME_BINARY
The path of installed google-chrome binary.
If HCEP_USE_CHROMIUM is true, this value is ignored
default: /usr/bin/google-chrome

### HCEP_APP_TIMEOUT_MSEC
Timeout milliseconds of the express app
default: 30000

### HCEP_PAGE_TIMEOUT_MSEC
Timeout milliseconds of the browser's Page
default: 10000

### HCEP_PORT
Listen Port by the express app
default: 8000

### HCEP_DEFAULT_MARGIN
default: 18mm

### HCEP_PDF_OPTION_KEY
default A4


## Customize PDF options
You can customize PDF with options. Read the puppeteer API's docs.

<https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions>

## Runing on Google App Engine (beta)
You can run Google App Engine
`gcloud app deploy --project your-project`
Please use app.yaml and edit it for your purpose.

More detail:
https://cloud.google.com/appengine/docs/standard/nodejs/using-headless-chrome-with-puppeteer

## Author
uyamazak: https://github.com/uyamazak/
blog: http://uyamazak.hatenablog.com/

This project has been maintained under the support of yagish履歴書 and is actually used for PDF generation.

### yagish履歴書( bizocean co.,Ltd )
https://rirekisho.yagish.jp/
