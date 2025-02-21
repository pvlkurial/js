package handlers

import (
	"net/http"
	"strconv"

	"backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UploadCSVHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get match_id from request
		matchIDStr := c.PostForm("match_id")
		matchID, err := strconv.Atoi(matchIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid match_id"})
			return
		}

		// Get the uploaded file
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file"})
			return
		}

		// Open the file
		openedFile, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not open file"})
			return
		}
		defer openedFile.Close()

		// Parse CSV with matchID
		stats, err := utils.ParseCSV(db, openedFile, uint(matchID))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "CSV uploaded successfully", "records_inserted": len(stats)})
	}
}
