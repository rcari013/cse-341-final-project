const swaggerAutogen = require('swagger-autogen')();

const isProd = process.env.NODE_ENV === 'production';

const doc = {
  info: {
    title: 'Vehicle Management API',
    description: 'Documentation for the Vehicle Management API'
  },
  host: isProd
    ? 'cse-341-final-project-1t9z.onrender.com'
    : 'localhost:3000',
  schemes: isProd ? ['https'] : ['http']
};

const outputFile = './swagger.json';
const endpointFiles = ['../routes/index.js'];

swaggerAutogen(outputFile, endpointFiles, doc);
