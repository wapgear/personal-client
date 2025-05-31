FROM node:22.3.0-alpine as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --force

COPY . ./
ENV NODE_ENV=production
RUN npm run build

# Stage - Production
FROM nginx:1.28-alpine
COPY --from=build /app/dist /usr/share/nginx/frontend/html
COPY --from=build /app/nginx.prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
