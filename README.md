# hcep-pdf

hcep-pdf is simple and fast pdf rendering server using Headless Chrome & Express & Puppeteer.

## Getting Started

### Clone
First git clone this repository.

### (optionary) Install fonts
As much as possible, we do not use WEB fonts,
and if we put font files in the server,
we can expect faster response.


```
cp AnyFonts.ttf ./fonts/
```

### Build

```
sudo docker build -t hcep-pdf:latest .
```

### Run

Below example, run with 8000 port.
```
sudo docker run -it --rm \
    -p 8000:8000 \
    --name hcep-pdf \
    hcep-pdf:latest
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

