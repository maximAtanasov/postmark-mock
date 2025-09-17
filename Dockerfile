FROM node:22
WORKDIR /app
COPY postmark-mock.js .
RUN npm init -y && npm install express body-parser
EXPOSE 8085
CMD ["node", "postmark-mock.js"]
