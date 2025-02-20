package models

type Track struct {
	TrackName     string  `gorm:"primaryKey" json:"track_name"`
	TrackImageURL string  `json:"track_imageurl"`
	Stats         []Stats `gorm:"foreignKey:Track"`
	Matches       []Match `gorm:"many2many:track_match"`
}
