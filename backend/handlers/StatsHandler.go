package handlers

import (
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type StatsHandler struct {
	StatsService *services.StatsService
}

func (h *StatsHandler) GetStatsByPlayer(c *gin.Context) {
	playerID := c.Param("player_id")
	stats, err := h.StatsService.StatsRepo.GetStatsByPlayer(playerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats of player"})
		return
	}
	c.JSON(http.StatusOK, stats)

}

func (h *StatsHandler) CreateStats(c *gin.Context) {
	var stats models.Stats
	if err := c.ShouldBindJSON(&stats); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := h.StatsService.CreateStats(&stats); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create stats"})
		return
	}

	c.JSON(http.StatusCreated, stats)
}

func (h *StatsHandler) GetStatsByPlayerByTrack(c *gin.Context) {
	playerID := c.Param("player_id")
	trackID := c.Param("track_id")
	stats, err := h.StatsService.StatsRepo.GetStatsByPlayerByTrack(playerID, trackID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats of player"})
		return
	}
	c.JSON(http.StatusOK, stats)

}

func (h *StatsHandler) GetStats(c *gin.Context) {
	stats, err := h.StatsService.StatsRepo.GetStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats of player"})
		return
	}
	c.JSON(http.StatusOK, stats)

}
