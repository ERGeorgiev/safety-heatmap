package main

import (
	"errors"
	"log"
	"net/http"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Point struct {
	Lat float32 `json:"lat" validate:"required,numeric"`
	Lon float32 `json:"lon" validate:"required,numeric"`
}

type HeatPoint struct {
	Point
	Intensity float32 `json:"intensity" validate:"required"`
}

type GetHeatmapRequest struct {
	Size  string                 `json:"size" validate:"required,min=1,max=1"`
	Range GetHeatmapRequestRange `json:"range" validate:"required"`
}

type GetHeatmapRequestRange struct {
	TopLeft     Point `json:"topleft" validate:"required"`
	BottomRight Point `json:"bottomright" validate:"required"`
}

type Heatmap struct {
	Points []HeatPoint `json:"points"`
}

var reports []Point = []Point{}

func main() {
	app := fiber.New()

	if os.Getenv("ENV") != "prod" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	PORT := os.Getenv("PORT")

	app.Post("/api/safetyheatmap/heatmap/get", safetyHeatmapGetHeatmap)
	app.Post("/api/safetyheatmap/report/add", safetyHeatmapAddReport)

	if os.Getenv("ENV") == "prod" {
		app.Static("/", ".client/dist")
	}

	log.Fatal(app.Listen(":" + PORT))
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

	reports = append(reports, *request)

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

	return c.Status(200).JSON(reports)
}

// For Loop Example
// "todo" is a type with an integer ID and todos is an array
// for i, todo := range todos {
// 	if fmt.Sprint(todo.ID) == id {
// 		todos = append(todos[:i], todos[i+1:]...)
// 		return c.Status(200).JSON(fiber.Map{"success": true})
// 	}
// }