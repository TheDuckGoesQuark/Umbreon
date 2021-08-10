package persistance

import (
	"github.com/jackc/pgx/v4/pgxpool"
	"umbreonserver/server/models"
)

type AuthDao interface {
	getUserById(userId string) (*models.User, error)
	getUserByEmail(email string) (*models.User, error)
	addUser(user models.User) (*models.User, error)
}

type PostgresAuthDao struct{
	pool *pgxpool.Pool
}

func (dao *PostgresAuthDao) getUserById(userId string) (*models.User, error) {
	query := NewGetUserByIdQuery(userId)
	return query.executeQuery(dao.pool)
}

func (dao *PostgresAuthDao) getUserByEmail(email string) (*models.User, error) {
	query := NewGetUserByEmailQuery(email)
	return query.executeQuery(dao.pool)
}

func (dao *PostgresAuthDao) addUser(user models.User) (*models.User, error) {
	panic("implement me")
}

