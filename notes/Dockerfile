FROM node:24-alpine AS builder

WORKDIR /opt/web
COPY package.json package-lock.json ./
RUN npm ci

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
RUN ng build

FROM nginx:1-alpine
# The nginx image replaces ${PORT} in templates when it starts; Render and other hosts set PORT
ENV PORT=80
COPY nginx.config /etc/nginx/templates/default.conf.template
COPY --from=builder /opt/web/dist/notes/browser /usr/share/nginx/html
