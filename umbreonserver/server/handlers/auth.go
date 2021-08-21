package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	"github.com/form3tech-oss/jwt-go"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"umbreonserver/server/models"
)

// LoginHandler logs a user in
func LoginHandler(c *gin.Context) {

}

// LogoutHandler logs a user out
func LogoutHandler(c *gin.Context) {
}

// AuthMiddleware intercepts the requests, and check for a valid jwt token
func AuthMiddleware(middleware *jwtmiddleware.JWTMiddleware) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the client secret key
		err := middleware.CheckJWT(c.Writer, c.Request)
		if err != nil {
			// Token not found
			fmt.Println(err)
			c.Abort()
			c.Writer.WriteHeader(http.StatusUnauthorized)
			c.Writer.Write([]byte("Unauthorized"))
			return
		}
	}
}

func JWTMiddleware() *jwtmiddleware.JWTMiddleware {
	return jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: validationKeyGetter(),
		SigningMethod: jwt.SigningMethodRS256,
	})
}

func validationKeyGetter() jwt.Keyfunc {
	return func(token *jwt.Token) (interface{}, error) {
		aud := os.Getenv("AUTH0_API_AUDIENCE")
		checkAudience := token.Claims.(jwt.MapClaims).VerifyAudience(aud, false)
		if !checkAudience {
			return token, errors.New("invalid audience")
		}
		// verify iss claim
		iss := os.Getenv("AUTH0_DOMAIN")
		checkIss := token.Claims.(jwt.MapClaims).VerifyIssuer(iss, false)
		if !checkIss {
			return token, errors.New("invalid issuer")
		}

		cert, err := getPemCert(token)
		if err != nil {
			log.Fatalf("could not get cert: %+v", err)
		}

		result, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(cert))
		return result, nil
	}
}

func getPemCert(token *jwt.Token) (string, error) {
	cert := ""
	resp, err := http.Get(os.Getenv("AUTH0_DOMAIN") + ".well-known/jwks.json")
	if err != nil {
		return cert, err
	}
	defer resp.Body.Close()

	var jwks = models.Jwks{}
	err = json.NewDecoder(resp.Body).Decode(&jwks)

	if err != nil {
		return cert, err
	}

	x5c := jwks.Keys[0].X5c
	for k, v := range x5c {
		if token.Header["kid"] == jwks.Keys[k].Kid {
			cert = "-----BEGIN CERTIFICATE-----\n" + v + "\n-----END CERTIFICATE-----"
		}
	}

	if cert == "" {
		return cert, errors.New("unable to find appropriate key")
	}

	return cert, nil
}

