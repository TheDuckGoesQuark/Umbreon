package middleware

import "github.com/gin-gonic/gin"

// EnsureValidRobotSecret Does nothing currently, will eventually validate robot secret
func EnsureValidRobotSecret() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}
