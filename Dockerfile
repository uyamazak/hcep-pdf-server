FROM node:10-slim
LABEL maintainer="yu_yamazaki@bizocean.co.jp"

RUN apt-get update

# Locale settings (Japanese)
RUN apt-get install -y --no-install-recommends locales task-japanese \
  && locale-gen ja_JP.UTF-8 \
  && localedef -f UTF-8 -i ja_JP ja_JP
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:jp
ENV LC_ALL ja_JP.UTF-8

# Install chrome's dependencies.
# See https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
# See https://crbug.com/795759
RUN apt-get install -yq libgconf-2-4

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y --no-install-recommends google-chrome-stable

RUN  rm -rf /var/lib/apt/lists/* \
  && apt-get auto-remove \
  && apt-get auto-clean \
  && apt-get purge --auto-remove -y curl \
  && rm -rf /src/*.deb

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# if use default chromium installed with puppeteer
ENV HCEP_USE_CHROMIUM true

# else use chrome enable below settings
#ENV HCEP_USE_CHROMIUM false
#ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
#ENV CHROME_BINARY /usr/bin/google-chrome

# If you want to extend pdf options, rename app/my-pdf-option-presets.js.sample to app/my-pdf-option-presets.js and activate this
ENV HCEP_MY_PDF_OPTION_PRESETS_FILE_PATH="./my-pdf-option-presets"
ENV NODE_ENV production

RUN mkdir /hcep/
COPY package.json /hcep/
WORKDIR /hcep/

RUN npm install -u npm && \
    npm install -g mocha eslint && \
    npm install

# Install fonts
COPY fonts /usr/share/fonts

COPY app /hcep/app

RUN chmod -R 777 /hcep/app

# Test
COPY test /hcep/test
RUN mocha
RUN rm -rf /hcep/test && npm uninstall -g mocha eslint

EXPOSE 8000
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
