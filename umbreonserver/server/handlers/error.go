package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"regexp"
	"strings"
)

var (
	default404Body = []byte("404 page not found")
)

func noRouteHandler(c *gin.Context, matches404 *regexp.Regexp, webHandler gin.HandlerFunc) {
	if matches404.Match([]byte(c.FullPath())) {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": default404Body})
	} else {
		webHandler(c)
	}
}

func NewNoRouteHandler(groupPrefixesTo404 []string, webHandler gin.HandlerFunc) func(c *gin.Context) {
	pattern := fmt.Sprintf("^(%s)", strings.Join(groupPrefixesTo404, "|"))
	re := regexp.MustCompile(pattern)

	return func(c *gin.Context) { noRouteHandler(c, re, webHandler) }
}
