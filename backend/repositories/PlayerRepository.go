package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type PlayerRepository struct {
	DB *gorm.DB
}

func (r *PlayerRepository) GetAllPlayers() ([]models.Player, error) {
	var players []models.Player
	result := r.DB.Find(&players)
	return players, result.Error
}

func (r *PlayerRepository) CreatePlayer(player *models.Player) error {
	return r.DB.Create(player).Error
}
