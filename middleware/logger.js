const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip;
  
    res.on("finish", () => {
        const statusCode = res.statusCode;
        let logMessage = `[${timestamp}] IP: ${ip} - ${req.method} ${req.url} - Status: ${statusCode}`;
        // Blue -> Client error, Red -> Server error, Green -> Success response (in console)
        if (statusCode >= 400 && statusCode < 500) {
            logMessage = `\x1b[34m${logMessage}\x1b[0m`; 
        } else if (statusCode >= 500) {
            logMessage = `\x1b[31m${logMessage}\x1b[0m`;
        } else {
            logMessage = `\x1b[32m${logMessage}\x1b[0m`;
        }
  
      console.log(logMessage);
    });
  
    next();
};

module.exports = logger;