const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notepad API",
      version: "1.0.0",
      description: "Backend API documentation for the local notepad app.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    components: {
      schemas: {
        Note: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "67ea8d1f5f9d4a1234567890",
            },
            title: {
              type: "string",
              example: "Project ideas",
            },
            content: {
              type: "string",
              example: "Build a simple notes API with Swagger support.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        NoteInput: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: {
              type: "string",
              example: "Daily tasks",
            },
            content: {
              type: "string",
              example: "Finish backend API and verify endpoints.",
            },
          },
        },
        MessageResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Note deleted successfully.",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Invalid note id.",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
