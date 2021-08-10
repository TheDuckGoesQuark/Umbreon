package controllers

import (
	"github.com/gin-gonic/gin"
	"umbreonserver/server/handlers"
)

type ApiController struct {
	config         *ControllerConfig
}

func NewApiController(config *ControllerConfig) *ApiController {
	return &ApiController{config: config}
}

func (a ApiController) ConfigureRouter(router *gin.Engine) {
	api := router.Group("/api")

	api.GET("/", handlers.PingHandler)
}

