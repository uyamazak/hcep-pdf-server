FROM node:10-slim
LABEL maintainer="yu_yamazaki@bizocean.co.jp"


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

# Use installed Chrome instead of default Chromium
# There is no big difference, but in order to bring the environment closer to Chrome normally used

ENV CHROME_BINARY /usr/bin/google-chrome

# if HCEP_USE_CHROMIUM set false
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

ENV NODE_ENV production

RUN mkdir /hcep/
COPY app /hcep/app
COPY package.json /hcep/
WORKDIR /hcep/

RUN npm install -u npm && \
    npm install -g mocha && \
    npm install

RUN chmod -R 777 /hcep/app

EXPOSE 8000

RUN useradd chromeuser -s /bin/bash -m -u 10000
USER chromeuser

CMD ["node", "app/pdfServer.js"]
