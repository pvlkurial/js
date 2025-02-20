package models

type Match struct {
	MatchID uint    `gorm:"primaryKey" json:"match_id"`
	CompID  uint    `json:"comp_id"`
	Teams   []Team  `gorm:"many2many:match_team" json:"teams"`
	Tracks  []Track `gorm:"many2many:track_match"`
}
