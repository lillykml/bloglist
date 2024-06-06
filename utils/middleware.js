const logger = require('./logger')

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        return res.status(404).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error collection')) {
        return res.status(400).json({ error: error.message})
    } else if (error.message.includes('Password must be at least 3 characters long')) {
        return res.status(400).json({error: error.message})
    } else if (error.name ===  'JsonWebTokenError') {
        return res.status(401).json({ error: 'token invalid' })
      } else if (error.name === 'TypeError' && error.message.includes('Cannot read properties of null')) {
        return res.status(400).json({error: "Blog has already been deleted"})
      }
    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '')
    }
    next()
  }
  

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}