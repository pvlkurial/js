package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type MatchRepository struct {
	DB *gorm.DB
}

func (r *MatchRepository) GetMatches() ([]models.Match, error) {
	var matches []models.Match
	result := r.DB.Find(&matches)
	return matches, result.Error
}

func (r *MatchRepository) CreateMatch(match *models.Match) error {
	return r.DB.Create(match).Error
}
