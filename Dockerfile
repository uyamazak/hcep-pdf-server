FROM node:10-slim
LABEL maintainer="yu_yamazaki@bizocean.co.jp"

# Install fonts
COPY fonts /usr/share/fonts

# Update
RUN apt-get update --fix-missing && apt-get -y upgrade

# Locale settings (japanese)
RUN apt-get install -y locales task-japanese \
  && locale-gen ja_JP.UTF-8 \
  && localedef -f UTF-8 -i ja_JP ja_JP
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:jp
ENV LC_ALL ja_JP.UTF-8

# Install stable chrome and dependencies.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /src/*.deb

# if use default chromium
ENV HCEP_USE_CHROMIUM true

# else use chrome enable below settings
#ENV HCEP_USE_CHROMIUM false
#ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
#ENV CHROME_BINARY /usr/bin/google-chrome

# If you want to extend pdf options, rename app/my-pdf-option-presets.js.sample to app/my-pdf-option-presets.js and activate this
#HCEP_MY_PDF_OPTION_PRESETS_FILE_PATH="./my-pdf-option-presets"

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

# RUN useradd chromeuser -s /bin/bash -m -u 10000
# USER chromeuser

CMD ["npm", "start"]
