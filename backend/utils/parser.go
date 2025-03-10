package utils

import (
	"encoding/csv"
	"errors"
	"io"
	"strconv"
	"strings"

	"backend/models"

	"gorm.io/gorm"
)

func ParseCSV(db *gorm.DB, file io.Reader, matchID uint) ([]models.Stats, error) {
	var statsList []models.Stats
	reader := csv.NewReader(file)

	header, err := reader.Read()
	if err != nil {
		return nil, err
	}

	header = normalizeHeaders(header)

	// Read each row
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		timestampStr := parseColumn(record, header, "Time")
		trackName := parseColumn(record, header, "Track")
		playerID := parseColumn(record, header, "PlayerID")
		playerName := parseColumn(record, header, "PlayerName")
		recordTime := parseColumn(record, header, "Record")
		roundNumber := parseColumn(record, header, "RoundNumber")
		points := parseColumn(record, header, "Points")
		cp := parseColumn(record, header, "CP")

		timestamp, err := strconv.ParseInt(timestampStr, 10, 64)
		if err != nil {
			return nil, errors.New("invalid timestamp format")
		}

		recordTimeInt, _ := strconv.Atoi(recordTime)
		pointsInt, _ := strconv.Atoi(points)
		cpInt, _ := strconv.Atoi(cp)

		// Ensure Track exists, create if not found
		var track models.Track
		if err := db.Where("track_name = ?", trackName).First(&track).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				track = models.Track{
					TrackName:     trackName,
					TrackImageURL: "", // Default or fetch from another source if needed
				}
				if err := db.Create(&track).Error; err != nil {
					return nil, err
				}
			} else {
				return nil, err
			}
		}

		// Ensure Match-Track relationship exists
		var count int64
		db.Table("track_match").Where("match_id = ? AND track_name = ?", matchID, trackName).Count(&count)
		if count == 0 {
			err := db.Exec("INSERT INTO track_match (match_id, track_name) VALUES (?, ?)", matchID, trackName).Error
			if err != nil {
				return nil, err
			}
		}

		// Ensure Player exists, create if not found
		var player models.Player
		if err := db.Where("player_id = ?", playerID).First(&player).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				player = models.Player{
					PlayerID:   playerID,
					PlayerName: playerName,
				}
				if err := db.Create(&player).Error; err != nil {
					return nil, err
				}
			} else {
				return nil, err
			}
		}

		stat := models.Stats{
			Timestamp:   timestamp,
			Track:       trackName,
			PlayerID:    playerID,
			PlayerName:  playerName,
			Record:      recordTimeInt,
			RoundNumber: roundNumber,
			Points:      pointsInt,
			CP:          cpInt,
			MatchID:     matchID,
		}

		statsList = append(statsList, stat)
	}

	// Store stats in DB
	result := db.Create(&statsList)
	if result.Error != nil {
		return nil, result.Error
	}

	return statsList, nil
}

func normalizeHeaders(headers []string) []string {
	for i, header := range headers {
		headers[i] = strings.ToLower(header)
	}
	return headers
}

func parseColumn(record, header []string, expectedHeader string) string {
	// Find the index of the expected header in the header row
	for i, h := range header {
		if h == strings.ToLower(expectedHeader) {
			if i < len(record) {
				return record[i]
			}
		}
	}
	return ""
}
