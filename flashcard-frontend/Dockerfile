FROM node:22 AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL

COPY .env.prod .env.production

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "#################API: $NEXT_PUBLIC_API_BASE_URL" && npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]