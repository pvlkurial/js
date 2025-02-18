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

func ParseCSV(db *gorm.DB, file io.Reader) ([]models.Stats, error) {
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

		// Parsing each column if available default values for missing columns
		timestampStr := parseColumn(record, header, "Time")
		track := parseColumn(record, header, "Track")
		playerID := parseColumn(record, header, "PlayerID")
		playerName := parseColumn(record, header, "PlayerName")
		recordTime := parseColumn(record, header, "Record")
		roundNumber := parseColumn(record, header, "RoundNumber")
		points := parseColumn(record, header, "Points")

		timestamp, err := strconv.ParseInt(timestampStr, 10, 64)
		if err != nil {
			return nil, errors.New("invalid timestamp format")
		}

		recordTimeInt, _ := strconv.Atoi(recordTime)
		pointsInt := 0
		if points != "" {
			pointsInt, _ = strconv.Atoi(points)
		}

		var player models.Player
		if err := db.Where("player_id = ?", playerID).First(&player).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
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
			Track:       track,
			PlayerID:    playerID,
			PlayerName:  playerName,
			Record:      recordTimeInt,
			RoundNumber: roundNumber,
		}

		if points != "" {
			stat.Points = pointsInt
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
