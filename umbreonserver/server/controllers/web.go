package controllers

import (
	"github.com/gin-gonic/gin"
	"umbreonserver/server/handlers"
)

type webController struct {
	config *ControllerConfig
}

func NewWebController(config *ControllerConfig) *webController {
	return &webController{config: config}
}

func (w webController) ConfigureRouter(router *gin.Engine) {
	router.Use(handlers.ServeAssets(w.config.GroupPrefix))
}
