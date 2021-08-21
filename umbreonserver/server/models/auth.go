package models

type User struct {
	UserId            string
	Email             string
	EncryptedPassword string
}

// schema for user table
const schema = `
		create table if not exists botusers(
			userId varchar(36) not null,
			email varchar(225) not null unique,
			encryptedPassword varchar(225),
		);
`

type Response struct {
  Message string `json:"message"`
}

type Jwks struct {
  Keys []JSONWebKeys `json:"keys"`
}

type JSONWebKeys struct {
  Kty string   `json:"kty"`
  Kid string   `json:"kid"`
  Use string   `json:"use"`
  N   string   `json:"n"`
  E   string   `json:"e"`
  X5c []string `json:"x5c"`
}