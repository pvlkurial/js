package repositories

import (
	"backend/models"
	"fmt"

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

func (r *MatchRepository) GetTracksByMatchID(matchID uint) ([]models.Track, error) {
	var tracks []models.Track

	// Query tracks directly using the track_match join table
	err := r.DB.Table("tracks").
		Joins("JOIN track_match ON tracks.track_name = track_match.track_name").
		Where("track_match.match_id = ?", matchID).
		Find(&tracks).Error

	if err != nil {
		return nil, fmt.Errorf("failed to get tracks for match ID %d: %w", matchID, err)
	}

	// Return empty slice instead of nil if no tracks found
	if len(tracks) == 0 {
		return []models.Track{}, nil
	}

	return tracks, nil
}

func (r *MatchRepository) GetStatsByMatchAndTrack(matchID uint, trackName string) ([]models.Stats, error) {
	var stats []models.Stats

	// Query stats using match_id and track_name instead of track_id
	err := r.DB.Where("match_id = ? AND track = ?", matchID, trackName).Find(&stats).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get stats for match ID %d and track %s: %w", matchID, trackName, err)
	}

	// Return early if no stats found
	if len(stats) == 0 {
		return []models.Stats{}, nil
	}

	return stats, nil
}
