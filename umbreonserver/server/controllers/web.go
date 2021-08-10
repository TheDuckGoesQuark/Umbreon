package controllers

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

type webController struct {
	config *ControllerConfig
}

func NewWebController(config *ControllerConfig) *webController {
	return &webController{config: config}
}

func (w webController) ConfigureRouter(router *gin.Engine) {
	// Serve frontend static files
	router.Use(static.Serve(w.config.GroupPrefix, static.LocalFile("./assets", true)))
}
