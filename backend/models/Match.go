package models

type Match struct {
	MatchID uint    `gorm:"primaryKey" json:"match_id"`
	Comp    Comp    `gorm:"foreignKey:comp_id"`
	Teams   []*Team `gorm:"many2many:match_team" json:"teams"`
}
