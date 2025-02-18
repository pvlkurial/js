package handlers

import (
	"net/http"

	"backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UploadCSVHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file"})
			return
		}

		openedFile, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not open file"})
			return
		}
		defer openedFile.Close()

		// Parse CSV
		stats, err := utils.ParseCSV(db, openedFile)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "CSV uploaded successfully", "records_inserted": len(stats)})
	}
}
