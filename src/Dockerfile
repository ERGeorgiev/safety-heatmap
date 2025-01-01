# --------------------------
# Stage 1: Build the frontend
# --------------------------
FROM node:22.12 AS client-builder

# ENV vars
ENV REACT_APP_PORT=8080
ENV REACT_APP_ENV=prod

# Create app directory and install dependencies
WORKDIR /app
COPY ./client/package.json .
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend source and build it
COPY ./client .
RUN npm run build

# --------------------------
# Stage 2: Build the backend
# --------------------------
FROM golang:1.22.10 AS server-builder

# Create and switch to a working directory
WORKDIR /server

# Copy go.mod and go.sum, then download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the Go files and build
COPY *.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /app

# --------------------------
# Stage 3: Minimal Last Stage
# --------------------------
FROM alpine:3.21

# Copy the Go binary from server-builder
COPY --from=server-builder /app /app

# Copy the built frontend from client-builder
COPY --from=client-builder /app/build /client/build

# ENV Vars
ENV ENV=prod
ENV PORT=8080

# Expose 8080 so we can run on that port
EXPOSE 8080

# Start the Go binary
CMD ["/app"]