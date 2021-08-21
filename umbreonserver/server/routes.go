package server

import (
	"github.com/gin-gonic/gin"
	"umbreonserver/server/controllers"
	"umbreonserver/server/handlers"
)

func ConfigureRoutes() *gin.Engine {
	router := gin.Default()

	jwtmiddleware := handlers.JWTMiddleware()
	authMiddleware := handlers.AuthMiddleware(jwtmiddleware)

	endpoints := []controllers.Controller{
		controllers.NewWebController(controllers.NewControllerConfig("/")),
		controllers.NewBotController(controllers.NewControllerConfig("/bot"), handlers.BotCodeVersionHandler, handlers.BotCodeDownloadHandler),
		controllers.NewAuthController(controllers.NewControllerConfig("/auth"), handlers.LoginHandler, handlers.LogoutHandler),
		controllers.NewApiController(controllers.NewAuthControllerConfig("/api", authMiddleware)),
	}

	for _, controller := range endpoints {
		controller.ConfigureRouter(router)
	}

	return router
}

