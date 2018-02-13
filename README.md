# hcep-pdf-server

hcep-pdf-server is simple and fast rendering PDF server using Headless Chrome & Express & Puppeteer.


## Getting Started

### Caution
Since error control and security measures are minimum, please accept only reliable requests. It does not assume direct disclosure to the outside.


### Clone
git clone this repository.


### (optionary) Install fonts
By default, fonts other than English are not installed, so if you convert pages in Japanese, Chinese or other languages, you will need to install a separate font file. Also, since it takes a long time for requesting and downloading and the response is delayed, we recommend that you install the font file in the server.


```
cp AnyFonts.ttf ./fonts/
```

### Build

```
sudo docker build -t hcep-pdf-server:latest .
```

### Run

Below example, run with 8000 port.
```
sudo docker run -it --rm \
    -p 8000:8000 \
    --name hcep-pdf \
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

## Author
uyamazak: https://github.com/uyamazak/

blog: http://uyamazak.hatenablog.com/
