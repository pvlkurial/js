package handlers

import (
	"backend/models"
	"backend/repositories"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TrackHandler struct {
	TrackRepository *repositories.TrackRepository
}

func (h *TrackHandler) GetTracks(c *gin.Context) {
	comps, err := h.TrackRepository.GetTracks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tracks"})
		return
	}
	c.JSON(http.StatusOK, comps)
}

func (h *TrackHandler) CreateTrack(c *gin.Context) {
	var track models.Track
	if err := c.ShouldBindJSON(&track); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := h.TrackRepository.CreateTrack(&track); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create track"})
		return
	}

	c.JSON(http.StatusCreated, track)
}
