var logger = require('winston');
logger.add(logger.transports.File, { filename: "production.log", json: false });
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {'timestamp':true});
logger.info('Winston default logger setting initialized.');
module.exports=logger;