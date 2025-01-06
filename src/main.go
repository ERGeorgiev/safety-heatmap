package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"time"
	"sync"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

type Point struct {
	Lat float32 `json:"lat" validate:"required,numeric"`
	Lng float32 `json:"lng" validate:"required,numeric"`
}

type GetHeatmapRequest struct {
	Size  string                 `json:"size" validate:"required,min=1,max=1"`
	Range GetHeatmapRequestRange `json:"range" validate:"required"`
}

type GetHeatmapRequestRange struct {
	TopLeft     Point `json:"topleft" validate:"required"`
	BottomRight Point `json:"bottomright" validate:"required"`
}

type GetHeatmapResponse struct {
	Size   string                    `json:"size" validate:"required,min=1,max=1"`
	Points []GetHeatmapResponsePoint `json:"points" validate:"required"`
}

type GetHeatmapResponsePoint struct {
	Lat       float32 `json:"lat" validate:"required,numeric"`
	Lng       float32 `json:"lng" validate:"required,numeric"`
	Intensity float32 `json:"intensity" validate:"required"`
	Age       int     `json:"age" validate:"required"`
}

type Report struct {
	Lat      float32 `json:"lat" validate:"required,numeric"`
	Lng      float32 `json:"lng" validate:"required,numeric"`
	DateTime int
}

var reports []Report = []Report{}
var logCount int

func main() {
	app := fiber.New()

	initDevelopmentSetup(app)
	log.Print("ENV=" + os.Getenv("ENV"))

	PORT := os.Getenv("PORT")

	app.Static("/", "./client/build")

	app.Post("/api/safetyheatmap/heatmap/get", safetyHeatmapGetHeatmap)
	app.Post("/api/safetyheatmap/report/add", safetyHeatmapAddReport)

	app.Use(loggingMiddleware)

	log.Fatal(app.Listen(":" + PORT))
}

func loggingMiddleware(c *fiber.Ctx) error {
	// Log Request Path
	path := c.Path()
	limitedLog("Request Path: " + path)

	// Log Request Body
	body := c.Body()
	limitedLog("Request Body: " + string(body))

	// Proceed with request
	err := c.Next()

	// Log Response Body
	response := c.Response().Body()
	limitedLog("Response Body: " + string(response))

	return err
}

func limitedLog(message string) {
	if logCount < 100 {
		log.Println(message)
		logCount++
	}
}

func initDevelopmentSetup(app *fiber.App) {
	if os.Getenv("ENV") != "prod" {
		// Load ENV file in development
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file")
		}

		// Allow localhost in development
		app.Use(cors.New(cors.Config{
			AllowOrigins: "http://localhost:3000",
			AllowHeaders: "Origin,Content-type,Accept,Authorization,User-Agent",
		}))
	}
}

func safetyHeatmapAddReport(c *fiber.Ctx) error {
	request := &Point{}

	if err := c.BodyParser(request); err != nil {
		return err
	}

	validate := validator.New()
	err := validate.Struct(request)
	if err != nil {
		var errs validator.ValidationErrors
		errors.As(err, &errs)
		for _, validationError := range errs {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": map[string]string{
					"field":   validationError.Field(),
					"message": validationError.Error(),
				},
			})
		}
	}

	heatpoint := &Report{}
	heatpoint.Lat = request.Lat
	heatpoint.Lng = request.Lng
	heatpoint.DateTime = int(time.Now().Unix())
	reports = append(reports, *heatpoint)

	return c.SendStatus(http.StatusCreated)
}

func safetyHeatmapGetHeatmap(c *fiber.Ctx) error {
	request := &GetHeatmapRequest{}

	if err := c.BodyParser(request); err != nil {
		return err
	}

	validate := validator.New()
	err := validate.Struct(request)
	if err != nil {
		var errs validator.ValidationErrors
		errors.As(err, &errs)
		for _, validationError := range errs {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": map[string]string{
					"field":   validationError.Field(),
					"message": validationError.Error(),
				},
			})
		}
	}

	response := &GetHeatmapResponse{}
	response.Size = "S"
	heatpoints := make([]GetHeatmapResponsePoint, 0, len(reports))
	for _, report := range reports {
		var point = &GetHeatmapResponsePoint{}
		point.Lat = report.Lat
		point.Lng = report.Lng
		point.Intensity = 1
		point.Age = int(time.Now().Unix()) - report.DateTime
		if os.Getenv("ENV") != "prod" {
			point.Age *= 120
		}
		heatpoints = append(heatpoints, *point)
	}
	response.Points = heatpoints

	return c.Status(200).JSON(response)
}

// For Loop Example
// "todo" is a type with an integer ID and todos is an array
// for i, todo := range todos {
// 	if fmt.Sprint(todo.ID) == id {
// 		todos = append(todos[:i], todos[i+1:]...)
// 		return c.Status(200).JSON(fiber.Map{"success": true})
// 	}
// }
