package models

type Track struct {
	TrackName     string  `gorm:"primaryKey" json:"track_name"`
	TrackImageURL string  `json:"track_imageurl"`
	Stats         []Stats `gorm:"foreignKey:Track"`
	Comp          Comp    `gorm:"foreignKey:CompID" json:"comp"`
}
