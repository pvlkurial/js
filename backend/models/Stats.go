package models

type Stats struct {
	ID          uint   `gorm:"primaryKey"`
	Timestamp   int64  `json:"timestamp"`
	Track       string `json:"track"`
	PlayerID    string `json:"player_id" gorm:"type:uuid"`
	PlayerName  string `json:"player_name"`
	Record      int    `json:"record"`
	RoundNumber string `json:"round_number"`
	Points      int    `json:"points"`
	CP          int    `json:"cp"`
}
