FROM node:9-slim
LABEL maintainer="yu_yamazaki@bizocean.co.jp"

RUN mkdir /varuna/
WORKDIR /varuna/

# Install fonts
COPY fonts /usr/share/fonts

# Install utilities
RUN apt-get update --fix-missing && apt-get -y upgrade

# Install chrome package.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /src/*.deb

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN npm install --save \
    puppeteer \
    express \
    connect-timeout \
    body-parser

# COPY my app dir
COPY app app
RUN chmod -R 777 app/pdf-server.js

EXPOSE 8000

RUN useradd chromeuser -s /bin/bash -m -u 10000
USER chromeuser

CMD ["node", "app/pdf-server.js"]
