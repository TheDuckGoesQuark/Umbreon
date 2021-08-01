package main

import (
	"log"
	"os"
	"umbreonserver/server"
)

func main() {
	router := server.ConfigureRoutes()

	// Start and run the server
	port := os.Getenv("PORT")
	err := router.Run(":" + port)
	if err != nil {
		log.Println("Error when starting server: " + err.Error())
	}
}

