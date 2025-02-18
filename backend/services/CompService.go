package services

import (
	"backend/models"
	"backend/repositories"
)

type CompService struct {
	CompRepo *repositories.CompRepository
}

func (s *CompService) GetComps() ([]models.Comp, error) {
	return s.CompRepo.GetComps()
}

func (s *CompService) CreateComp(comp *models.Comp) error {
	return s.CompRepo.CreateComp(comp)
}
