package controllers

import (
	"github.com/gin-gonic/gin"
)

type Controller interface {
	ConfigureRouter(router *gin.Engine)
}

type ControllerConfig struct {
	GroupPrefix string
}

func NewControllerConfig(groupPrefix string) *ControllerConfig {
	return &ControllerConfig{GroupPrefix: groupPrefix}
}


