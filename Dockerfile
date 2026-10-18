FROM node:20-bookworm-slim
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server ./server
COPY public ./public
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080
USER node
WORKDIR /app/server
CMD ["node", "server.js"]
