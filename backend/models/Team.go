package models

type Team struct {
	TeamID      uint    `gorm:"primaryKey" json:"team_id"`
	TeamName    string  `json:"team_name"`
	LogoURL     string  `json:"logo_url"`
	Description string  `json:"description"`
	Matches     []Match `gorm:"many2many:match_team" json:"matches"`
}
