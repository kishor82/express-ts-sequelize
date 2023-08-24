# TypeScript-Express-Boilerplate

This project is a boilerplate built using Express.js, TypeScript, Sequelize (with database interactions), Swagger (for API documentation), and a logger for basic functionality. It serves as a foundation for developing web applications, offering essential components to get started quickly. With pre-configured features like API documentation, database connectivity, and logging, this boilerplate minimizes initial setup time and allows developers to focus on building application-specific functionality.

## Table of Contents

- [TypeScript-Express-Boilerplate](#typescript-express-boilerplate)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
    - [Linting](#linting)
    - [Building](#building)
    - [Database Operations](#database-operations)
    - [Starting the Application](#starting-the-application)
    - [Development](#development)
  - [Debugging](#debugging)

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/kishor82/express-ts-sequelize.git
   cd express-ts-sequelize
   ```

2. Install dependencies:

   ```sh
   yarn
   ```

## Usage

### Linting

To lint your code using ESLint:

```sh
yarn lint
```

### Building

To clean the 'dist' directory and then build the project using TypeScript:

```sh
yarn build
```

### Database Operations

For local database operations:

- To seed the database:

```sh
yarn build
```

- To set up the local database (drop, create, migrate, and seed):

```sh
yarn db:setup:local
```

### Starting the Application

To start the application:

```sh
yarn start
```

### Development

For development, you can use the following commands:

- To run the application with automatic restart on file changes:

```sh
yarn dev
```

- To run the application with debugging enabled:

```sh
yarn dev:debug
```

## Debugging

To debug the application, you can use:

```sh
yarn debug
```

sqp_7e3c104e7a07264ef3e7700fe136f2d6b16929f6
