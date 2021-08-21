package persistance

import (
	"context"
	"github.com/jackc/pgx/v4/pgxpool"
	"umbreonserver/server/models"
)

const (
	getUserById    = "SELECT userId, email, encryptedPassword FROM botusers WHERE id=$1"
	getUserByEmail = "SELECT userId, email, encryptedPassword FROM botusers WHERE email=$1"
	insertUser     = "INSERT INTO botusers (email, encryptedPassword) VALUES ($1, $2) RETURNING userId"
)

type GetUserByIdQuery struct {
	query  string
	userId string
}

type GetUserByEmailQuery struct {
	query string
	email string
}

type InsertUserQuery struct {
	query string
	user  *models.User
}

func (query GetUserByIdQuery) executeQuery(pool *pgxpool.Pool) (*models.User, error) {
	var result models.User
	err := pool.QueryRow(context.Background(), query.query, query.userId).Scan(
		&result.UserId, &result.Email, &result.EncryptedPassword)
	return &result, err
}

func NewGetUserByIdQuery(userId string) *GetUserByIdQuery {
	return &GetUserByIdQuery{
		query:  getUserById,
		userId: userId,
	}
}

func (query GetUserByEmailQuery) executeQuery(pool *pgxpool.Pool) (*models.User, error) {
	var result models.User
	err := pool.QueryRow(context.Background(), query.query, query.email).Scan(
		&result.UserId, &result.Email, &result.EncryptedPassword)
	return &result, err
}

func NewGetUserByEmailQuery(email string) *GetUserByEmailQuery {
	return &GetUserByEmailQuery{
		query: getUserByEmail,
		email: email,
	}
}

func (query InsertUserQuery) executeQuery(pool *pgxpool.Pool) (*models.User, error) {
	result := query.user
	err := pool.QueryRow(context.Background(), query.query, query.user.Email, query.user.EncryptedPassword).Scan(
		&result.UserId)
	return result, err
}

func NewInsertUserQuery(user *models.User) *InsertUserQuery {
	return &InsertUserQuery{
		query: insertUser,
		user:  user,
	}
}
