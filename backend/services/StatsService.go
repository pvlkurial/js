package services

import (
	"backend/models"
	"backend/repositories"
)

type StatsService struct {
	StatsRepo *repositories.StatsRepository
}

func (s *StatsService) CreateStats(stats *models.Stats) error {
	return s.StatsRepo.CreateStats(stats)
}

func (s *StatsService) GetStatsByPlayer(playerID string) ([]models.Stats, error) {
	return s.StatsRepo.GetStatsByPlayer(playerID)
}

func (s *StatsService) GetStatsByPlayerByTrack(playerID string, trackID string) ([]models.Stats, error) {
	return s.StatsRepo.GetStatsByPlayerByTrack(playerID, trackID)
}
