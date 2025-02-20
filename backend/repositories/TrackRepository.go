package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type TrackRepository struct {
	DB *gorm.DB
}

func (r *TrackRepository) GetTracks() ([]models.Track, error) {
	var tracks []models.Track
	result := r.DB.Find(&tracks)
	return tracks, result.Error
}

func (r *TrackRepository) CreateTrack(track *models.Track) error {
	return r.DB.Create(track).Error
}
