package models

type Comp struct {
	ID           uint    `gorm:"primaryKey" json:"id"`
	CompName     string  `json:"comp_name"`
	CompImageURL string  `json:"comp_imageurl"`
	Track        []Track `gorm:"foreignKey:CompID"`
}
