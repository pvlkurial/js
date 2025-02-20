package models

type Comp struct {
	ID           uint     `gorm:"primaryKey" json:"comp_id"`
	CompName     string   `json:"comp_name"`
	CompImageURL string   `json:"comp_imageurl"`
	Matches      *[]Match `gorm:"foreignKey:Comp"`
}
