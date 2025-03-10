package repositories

import (
	"backend/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type StatsRepository struct {
	DB *gorm.DB
}

func (r *StatsRepository) CreateStats(stats *models.Stats) error {
	return r.DB.Create(stats).Error
}

func (r *StatsRepository) GetStatsByPlayer(playerID string) ([]models.Stats, error) {
	var stats []models.Stats
	result := r.DB.Where("player_id = ?", playerID).Find(&stats)
	return stats, result.Error
}

func (r *StatsRepository) GetStatsByPlayerByTrack(playerID string, trackID string) ([]models.Stats, error) {
	var stats []models.Stats
	result := r.DB.Where("player_id = ?", playerID).Where("track = ?", trackID).
		Order(clause.OrderBy{Columns: []clause.OrderByColumn{{Column: clause.Column{Name: "timestamp"}, Desc: false},
			{Column: clause.Column{Name: "round_number"}, Desc: false}}}).Find(&stats)
	return stats, result.Error
}

func (r *StatsRepository) GetStats() ([]models.Stats, error) {
	var stats []models.Stats
	result := r.DB.Find(&stats)
	return stats, result.Error
}
