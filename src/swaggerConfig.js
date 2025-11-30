// Import swagger-jsdoc to generate Swagger documentation from JSDoc comments.
import swaggerJSDoc from "swagger-jsdoc";

// Define the configuration options for swagger-jsdoc.
const options = {
  // Define the core Swagger specification.
  definition: {
    // Specify the OpenAPI version.
    openapi: "3.0.0",
    // Provide metadata about the API.
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "A simple REST API for managing blog posts, documented with Swagger.",
    },
    // Define the server(s) where the API is hosted.
    servers: [
      {
        url: "http://localhost:3000/api", // The base URL for the development server
        description: "Development server",
      },
    ],
  },
  // An array of paths to the files containing OpenAPI definitions.
  // swagger-jsdoc will scan these files for JSDoc comments.
  apis: ["./src/routes/*.js"],
};

// Generate the Swagger specification by passing the options to swagger-jsdoc.
const swaggerSpec = swaggerJSDoc(options);

// Export the generated specification so it can be used by swagger-ui-express.
export default swaggerSpec;
