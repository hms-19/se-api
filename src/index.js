// make bluebird default Promise
const logger = require('./config/logger');
const mongoose = require('./config/mongoose');
const http = require('http');
const app = require('./config/express');
const { env, port } = require('./config/vars');
const { pricingScheduleTask } = require('./schedular/pricingSchedular');


try {
    if (env === "production") {
        // const credentials = {
        //     key: fs.readFileSync('/etc/letsencrypt/live/api.sports-empire.co/key.pem'),
        //     cert: fs.readFileSync('/etc/letsencrypt/live/api.sports-empire.co/cert.pem'),
        // }
        // const secureHttpsServer = https.createServer(credentials, app);
        // secureHttpsServer.listen(port, () => logger.info(`server started on port ${port} (${env})`));
        const httpServer = http.createServer(app);
        httpServer.listen(port, () => logger.info(`server started on port ${port} (${env})`));
    } else{
        const httpServer = http.createServer(app);
        httpServer.listen(port, () => logger.info(`server started on port ${port} (${env})`));
    }
} catch (error) {
    logger.warn("Error == ", error.message)
}

pricingScheduleTask();

mongoose.connect();

module.exports = app;
