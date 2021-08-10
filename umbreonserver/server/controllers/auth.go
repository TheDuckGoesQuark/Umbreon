package controllers

import (
	"github.com/gin-gonic/gin"
	"umbreonserver/server/handlers"
)

type AuthController struct {
	config       *ControllerConfig
	loginHandler func(router *gin.Context)
	logoutHandler func(router *gin.Context)
}

func NewAuthController(config *ControllerConfig, loginHandler func(router *gin.Context), logoutHandler func(router *gin.Context)) *AuthController {
	return &AuthController{config: config, loginHandler: loginHandler, logoutHandler: logoutHandler}
}

func (a AuthController) ConfigureRouter(router *gin.Engine) {
	api := router.Group(a.config.GroupPrefix)

	api.GET("/", handlers.PingHandler)
	api.POST("/login", a.loginHandler)
	api.POST("/logout", a.logoutHandler)
}


