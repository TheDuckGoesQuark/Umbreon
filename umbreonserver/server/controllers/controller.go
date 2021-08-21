package controllers

import (
	"github.com/gin-gonic/gin"
)

type Controller interface {
	ConfigureRouter(router *gin.Engine)
}

type ControllerConfig struct {
	GroupPrefix string
	AuthMiddleware gin.HandlerFunc
}

func NewControllerConfig(groupPrefix string) *ControllerConfig {
	return &ControllerConfig{GroupPrefix: groupPrefix}
}

func NewAuthControllerConfig(groupPrefix string, authMiddleware gin.HandlerFunc) *ControllerConfig {
	return &ControllerConfig{GroupPrefix: groupPrefix, AuthMiddleware: authMiddleware}
}


