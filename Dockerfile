# Používame oficiálny Node.js image s podporou LTS
FROM node:18-alpine

# Nastavenie pracovného adresára v kontajneri
WORKDIR /usr/src/app

# Skopírujeme package.json a package-lock.json pre inštaláciu závislostí
COPY package*.json ./

# Nainštalujeme všetky závislosti
RUN npm install

# Skopírujeme celý projekt do kontajnera
COPY . .

# Skopírujeme TypeScript konfiguráciu a preložíme ju do JavaScriptu
RUN npm run build

# Nastavíme environment variables (vhodné pri produkcii)
ENV NODE_ENV=production

# Exponujeme port, na ktorom server beží
EXPOSE 3000

# Príkaz na spustenie aplikácie
CMD ["node", "dist/server.js"]