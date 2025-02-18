package models

type Player struct {
	PlayerID   string `gorm:"primaryKey;type:uuid" json:"player_id"`
	PlayerName string `json:"player_name"`
}
