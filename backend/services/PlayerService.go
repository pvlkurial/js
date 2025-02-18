package services

import (
	"backend/models"
	"backend/repositories"
)

type PlayerService struct {
	PlayerRepo *repositories.PlayerRepository
}

func (s *PlayerService) GetAllPlayers() ([]models.Player, error) {
	return s.PlayerRepo.GetAllPlayers()
}

func (s *PlayerService) CreatePlayer(player *models.Player) error {
	return s.PlayerRepo.CreatePlayer(player)
}
