const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE 341 Employees API',
    description: 'Employee Management API for BYU Course Project',
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger output file generated successfully!");
});