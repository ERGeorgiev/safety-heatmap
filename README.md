# Safety Heatmap

## About the project

This project aims to create a live heatmap of all the highly dangerous areas of cities. The project will use crime records as a base for the heatmap and subsequently use user reports to add to the data.

## Built with

- Go
- React
- Leaflet
- JavaScript
- CSS

## Installation and usage

### Setup

1. Clone the repo

2. Install [npm](https://nodejs.org/en/download/package-manager)

   1. Navigate to `./src/client` and run:

      ```sh
      npm install # Install Packages
      npm audit fix --legacy-peer-deps # Resolve Dependencies
      ```

3. Install [go](https://go.dev/doc/install)

   1. Navigate to `./src` and run:

      ```sh
      go get github.com/gofiber/fiber/v2 # Fiber (Runs GO backend)
      go install github.com/air-verse/air@latest # Air (Restarts Fiber when there are backend changes)
      go get github.com/joho/godotenv # GoDotEnv (.env configuration file support)
      ```

4. Install [Visual Studio Code](https://code.visualstudio.com/Download)

   1. Install extension `Go`
   2. Install extension `Even Better TOML`
   3. Install extension `REST Client`

### Run

1. To start the backend, navigate to `./src` and run:

   ```sh
   air
   ```

2. To start the webapp, navigate to `./src/client` and run:

   ```sh
   npm start
   ```

