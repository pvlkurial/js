package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type TeamRepository struct {
	DB *gorm.DB
}

func (r *TeamRepository) GetTeams() ([]models.Team, error) {
	var teams []models.Team
	result := r.DB.Find(&teams)
	return teams, result.Error
}

func (r *TeamRepository) CreateTeam(team *models.Team) error {
	return r.DB.Create(team).Error
}
