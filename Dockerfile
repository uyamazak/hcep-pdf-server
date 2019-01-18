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

# Install chrome's dependencies.
# https://cloud.google.com/appengine/docs/standard/nodejs/reference/system-packages
RUN apt-get install -y ffmpeg \
flvmeta \
fontconfig \
fonts-ipafont-gothic \
fonts-kacst \
fonts-liberation \
fonts-thai-tlwg \
fonts-wqy-zenhei \
gconf-service \
geoip-database \
git \
imagemagick \
jq \
libappindicator1 \
libasound2 \
libatk1.0-0 \
libatlas3-base \
libblas3 \
libbz2-1.0 \
libc6 \
libcairo2 \
libcups2 \
libcurl4-openssl-dev \
libdb5.3 \
libdbus-1-3 \
libenchant1c2a \
libexpat1 \
libffi6 \
libfftw3-double3 \
libflac8 \
libfontconfig1 \
libfontenc1 \
libfreetype6 \
libgcc1 \
libgconf-2-4 \
libgcrypt20 \
libgd3 \
# libgdbm5 \
libgdk-pixbuf2.0-0 \
libgdk-pixbuf2.0-common \
libglib2.0-0 \
libgmp10 \
libgmpxx4ldbl \
libgoogle-perftools4 \
libgraphite2-3 \
libgs9 \
libgs9-common \
libgtk-3-0 \
libhashkit2 \
# libicu60 \
libjbig0 \
libjbig2dec0 \
# libjpeg-turbo8 \
# libjpeg8 \
liblapack3 \
libldap-2.4-2 \
liblzma5 \
libmagickcore-6.q16-3 \
libmagickcore-6.q16-3-extra \
libmagickwand-6.q16-3 \
libmemcached11 \
libmemcachedutil2 \
libmpc3 \
libmpdec2 \
libncursesw5 \
libnetpbm10 \
libnspr4 \
libnss3 \
libpango-1.0-0 \
libpangocairo-1.0-0 \
libpng16-16 \
libpq5 \
libprotoc10 \
librabbitmq4 \
librdkafka1 \
libreadline7 \
librsvg2-2 \
librsvg2-common \
libsasl2-2 \
libsasl2-modules \
libsasl2-modules-db \
libsqlite3-0 \
# libssl1.0.0 \
libtidy5 \
libtiff5 \
libtiffxx5 \
libuuid1 \
# libvpx5 \
libwebp6 \
libx11-6 \
libx11-xcb1 \
libxcb1 \
libxcomposite1 \
libxcursor1 \
libxdamage1 \
libxext6 \
libxfixes3 \
libxi6 \
libxml2 \
libxrandr2 \
libxrender1 \
libxslt1.1 \
libxss1 \
libxtst6 \
libyaml-0-2 \
libzip4 \
locales \
lsb-release \
mime-support \
netpbm \
python3-chardet \
ttf-freefont \
tzdata \
wget \
xdg-utils

# if use default chromium
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

COPY app /hcep/app

RUN chmod -R 777 /hcep/app

COPY test /hcep/test
RUN mocha
# RUN useradd chromeuser -s /bin/bash -m -u 10000
# USER chromeuser

EXPOSE 8000
CMD ["npm", "start"]
