package server

import (
	"github.com/gin-gonic/gin"
	"umbreonserver/server/controllers"
	"umbreonserver/server/handlers"
)

const (
	root = "/"
	bot  = "/bot"
	auth = "/auth"
	api  = "/api"
)

func ConfigureRoutes() *gin.Engine {
	router := gin.Default()

	jwtmiddleware := handlers.JWTMiddleware()
	authMiddleware := handlers.AuthMiddleware(jwtmiddleware)

	endpoints := []controllers.Controller{
		controllers.NewWebController(controllers.NewControllerConfig(root)),
		controllers.NewBotController(controllers.NewControllerConfig(bot), handlers.BotCodeVersionHandler, handlers.BotCodeDownloadHandler),
		controllers.NewAuthController(controllers.NewControllerConfig(auth), handlers.LoginHandler, handlers.LogoutHandler),
		controllers.NewApiController(controllers.NewAuthControllerConfig(api, authMiddleware)),
		controllers.NewNoRouteController(handlers.NewNoRouteHandler([]string{bot, auth, api}, handlers.ServeIndex)),
	}

	for _, controller := range endpoints {
		controller.ConfigureRouter(router)
	}

	return router
}
