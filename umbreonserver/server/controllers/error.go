package controllers

import (
	"github.com/gin-gonic/gin"
)

type NoRouteController struct {
	noRouteHandler func(router *gin.Context)
}

func NewNoRouteController(noRouteHandler func(router *gin.Context)) *NoRouteController {
	return &NoRouteController{noRouteHandler: noRouteHandler}
}

func (n NoRouteController) ConfigureRouter(router *gin.Engine) {
	// Setup route group for the API
	router.NoRoute(n.noRouteHandler)
}
