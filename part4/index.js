const app = require('./app') // the actual Express application

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })