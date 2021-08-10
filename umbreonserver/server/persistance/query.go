package persistance

import (
	"context"
	"github.com/jackc/pgx/v4/pgxpool"
	"umbreonserver/server/models"
)

const (
	getUserById    = "select userId, email, encryptedPassword from botusers where id=$1"
	getUserByEmail = "select userId, email, encryptedPassword from botusers where email=$1"
)

type GetUserByIdQuery struct {
	query  string
	userId string
}

type GetUserByEmailQuery struct {
	query string
	email string
}

type InsertUser struct {
	user *models.User
}

func (g GetUserByIdQuery) executeQuery(pool *pgxpool.Pool) (*models.User, error) {
	var result models.User
	err := pool.QueryRow(context.Background(), g.query, g.userId).Scan(
		&result.UserId, &result.Email, &result.EncryptedPassword)
	return &result, err
}

func NewGetUserByIdQuery(userId string) *GetUserByIdQuery {
	return &GetUserByIdQuery{
		query:  getUserById,
		userId: userId,
	}
}

func (g GetUserByEmailQuery) executeQuery(pool *pgxpool.Pool) (*models.User, error) {
	var result models.User
	err := pool.QueryRow(context.Background(), g.query, g.email).Scan(
		&result.UserId, &result.Email, &result.EncryptedPassword)
	return &result, err
}

func NewGetUserByEmailQuery(email string) *GetUserByEmailQuery {
	return &GetUserByEmailQuery{
		query: getUserByEmail,
		email: email,
	}
}
