package models

type Track struct {
	TrackName     string  `gorm:"primaryKey" json:"track_name"`
	TrackImageURL string  `json:"track_imageurl"`
	Stats         []Stats `gorm:"foreignKey:track"`
	CompID        uint    `json:"comp_id"`
	Comp          Comp    `gorm:"foreignKey:CompID" json:"comp"` // Define the relationship back to Comp
}
