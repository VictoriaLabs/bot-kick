FROM node:18

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Ajouter la clé et le dépôt pour Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'

# Installer Google Chrome et les polices nécessaires
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Créer et définir le répertoire de travail
WORKDIR /usr/src/app

# Copier le code source
COPY ../src ./

# Installer les dépendances npm
RUN npm install

# Installer puppeteer
RUN npm i puppeteer

# Ajouter un utilisateur non privilégié et créer le dossier de téléchargements
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser

# Définir l'utilisateur non privilégié par défaut
USER pptruser

# Commande d'exécution par défaut
CMD ["npx", "ts-node", "app.ts"]
