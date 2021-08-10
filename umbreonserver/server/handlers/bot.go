package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
)

// BotCodeVersionHandler provides the current version of the bot executable to determine if a download is necessary
func BotCodeVersionHandler(c *gin.Context) {
	botCodeVersion := os.Getenv("BOT_CODE_VERSION")

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"version": botCodeVersion,
	})
}

// BotCodeDownloadHandler provides the executable botcode
func BotCodeDownloadHandler(c *gin.Context) {
	filename := "umbreonbot"
	targetPath := "./assets/" + filename
	//Seems this headers needed for some browsers (for example without this headers Chrome will download files as txt)
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Header("Content-Type", "application/octet-stream")
	c.File(targetPath)
}
