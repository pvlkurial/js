package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type CompRepository struct {
	DB *gorm.DB
}

func (r *CompRepository) GetComps() ([]models.Comp, error) {
	var comps []models.Comp
	result := r.DB.Find(&comps)
	return comps, result.Error
}

func (r *CompRepository) CreateComp(comp *models.Comp) error {
	return r.DB.Create(comp).Error
}
