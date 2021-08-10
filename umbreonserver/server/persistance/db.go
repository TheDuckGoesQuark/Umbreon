package persistance

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v4/pgxpool"
)

type DBConfig struct {
	host           string
	port           int
	user           string
	password       string
	dbname         string
}

func (dbConfig *DBConfig) toConnectionString() string {
	return fmt.Sprintf("postgresql://%s:%s@%s:%d/%s",
		dbConfig.user, dbConfig.password, dbConfig.host, dbConfig.port, dbConfig.dbname)
}

func (dbConfig *DBConfig) establishConnection() (*pgxpool.Pool, error) {
	return pgxpool.Connect(context.Background(), dbConfig.toConnectionString())
}

func (dbConfig *DBConfig) closeConnection(pool *pgxpool.Pool) {
	pool.Close()
}
