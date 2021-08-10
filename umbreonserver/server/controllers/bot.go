package controllers

import (
	"github.com/gin-gonic/gin"
	"umbreonserver/server/handlers"
)

type BotController struct {
	config         *ControllerConfig
	versionHandler func(router *gin.Context)
	downloadHandler func(router *gin.Context)
}

func NewBotController(config *ControllerConfig, versionHandler func(router *gin.Context), downloadHandler func(router *gin.Context)) *BotController {
	return &BotController{config: config, versionHandler: versionHandler, downloadHandler: downloadHandler}
}

func (b BotController) ConfigureRouter(router *gin.Engine) {
	// Setup route group for the API
	api := router.Group(b.config.GroupPrefix)
	api.GET("/", handlers.PingHandler)
	api.GET("/version", b.versionHandler)
	api.GET("/download", b.downloadHandler)
}
