// errorMiddleware.js

const handleErrors = (err, req, res, next) => {
    console.error(err.stack);
  
    // Check for specific error types and handle them accordingly
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.errors });
    }
  
    // Handle other types of errors
    return res.status(500).json({ error: 'Internal Server Error' });
  };
  
  export default handleErrors;
  