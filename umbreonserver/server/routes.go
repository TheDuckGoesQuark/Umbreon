package server

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
)

func ConfigureRoutes() *gin.Engine {
	// Set the router as the default one shipped with Gin
	router := gin.Default()

	configureStaticFrontend(router)
	configureBotCodeServer(router)
	configureApi(router)

	return router
}

func configureStaticFrontend(router *gin.Engine) {
	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./assets", true)))
}

func configureBotCodeServer(router *gin.Engine) {
	// Setup route group for the API
	api := router.Group("/bot")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})
	}

	api.GET("/version", BotCodeVersionHandler)
	api.GET("/download", BotCodeDownloadHandler)
}

func configureApi(router *gin.Engine) {
	// Setup route group for the API
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})
	}

	// Our API will consit of just two routes
	// /jokes - which will retrieve a list of jokes a user can see
	// /jokes/like/:jokeID - which will capture likes sent to a particular joke
	api.GET("/jokes", JokeHandler)
	api.POST("/jokes/like/:jokeID", LikeJoke)
}

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

// JokeHandler retrieves a list of available jokes
func JokeHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"message": "Jokes handler not implemented yet but this good to see",
	})
}

// LikeJoke increments the likes of a particular joke Item
func LikeJoke(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{
		"message": "LikeJoke handler not implemented yet",
	})
}
