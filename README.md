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
      npm install --legacy-peer-deps # Install Packages
      ```

3. Install [go](https://go.dev/doc/install)

   1. Navigate to `./src` and run:

      ```sh
      go mod download
      go install github.com/air-verse/air@latest # Air (Restarts Fiber when there are backend changes)
      ```

4. Install [Visual Studio Code](https://code.visualstudio.com/Download)

   1. Install extension `Go`
   2. Install extension `Even Better TOML`
   3. Install extension `REST Client`

5. Install AWS Modules

   ```sh
   Install-Module -Name AWS.Tools.Common
   ```

   ```sh
   Install-Module -Name AWS.Tools.ECR
   ```

### Run

1. To start the backend, navigate to `./src` and run:

   ```sh
   air
   ```

2. To start the webapp, navigate to `./src/client` and run:

   ```sh
   npm start
   ```

### Deploy to AWS

#### Automatic

1. Push to the main branch.

#### Manual

1. Login

   ```sh
   (Get-ECRLoginCommand).Password | docker login --username AWS --password-stdin 762233751295.dkr.ecr.eu-west-1.amazonaws.com
   ```

2. Build Docker Image

   ```sh
   docker build . --progress plain -t safetyheatmap
   ```

3. Run Docker image and ensure it works

   ```sh
   docker run -d --publish 8080:8080 safetyheatmap 
   ```

4. Upload to ECR Repo, where the service will pick it up

   ```sh
   aws configure
   docker tag safetyheatmap:latest 762233751295.dkr.ecr.eu-west-1.amazonaws.com/safety-heatmap:latest
   docker push 762233751295.dkr.ecr.eu-west-1.amazonaws.com/safety-heatmap:latest
   aws ecs update-service --cluster safetyheatmap --service safetyheatmap --force-new-deployment
   ```

### Issues

#### Docker Performance Impact When Idle or Off

If Docker (or rather wsl and wslservice) is causing a performance impact even when not running, such as high cpu/memory usage, try these powershell commands: 
```
wsl --shutdown
```
and if there are still issues, try:
```
taskkill /F /im wslservice.exe
```