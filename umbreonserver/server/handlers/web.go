package handlers

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

var (
	fs = static.LocalFile("./assets", true)
	fileserver = http.FileServer(fs)
)

func ServeAssets(urlPrefix string) gin.HandlerFunc {
	if urlPrefix != "" {
		fileserver = http.StripPrefix(urlPrefix, fileserver)
	}

	return func(c *gin.Context) {
		if fs.Exists(urlPrefix, c.Request.URL.Path) {
			log.Println(c.Request.URL.Path)
			fileserver.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		}
	}
}

func ServeIndex(c *gin.Context) {
	path := c.Request.URL.Path
	c.Request.URL.Path = "/"
	w := c.Writer
	fileserver.ServeHTTP(c.Writer, c.Request)
	c.Request.URL.Path = path
	w.Header().Del("Location")
	w.WriteHeader(http.StatusOK)
	c.Abort()
}

