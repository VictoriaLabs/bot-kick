FROM node:18

RUN apt-get update
RUN apt-get install -y wget gnupg
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update
RUN apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY ../src /usr/src/app

RUN npm init -y
RUN npm i puppeteer
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
RUN mkdir -p /home/root/Downloads
CMD ["google-chrome-stable", "--no-sandbox"]
ENTRYPOINT [ " npx", "ts-node", "app.ts"]

