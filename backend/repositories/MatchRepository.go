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

func (r *MatchRepository) GetMatchesByComp(compID uint) ([]models.Match, error) {
	var matches []models.Match
	result := r.DB.Where("comp_id = ?", compID).Preload("Teams").Preload("Tracks").Find(&matches)
	return matches, result.Error
}
