package handlers

import (
	"backend/models"
	"backend/repositories"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MatchHandler struct {
	MatchRepository *repositories.MatchRepository
}

func (h *MatchHandler) GetMatchesByComp(c *gin.Context) {
	compID, err := strconv.ParseUint(c.Param("comp_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid competition ID"})
		return
	}

	matches, err := h.MatchRepository.GetMatchesByComp(uint(compID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch matches"})
		return
	}

	c.JSON(http.StatusOK, matches)
}

func (h *MatchHandler) CreateMatch(c *gin.Context) {
	var input struct {
		CompID uint   `json:"comp_id"`
		Teams  []uint `json:"teams"` // Expecting an array of team IDs
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var teams []models.Team
	if err := h.MatchRepository.DB.Find(&teams, input.Teams).Error; err != nil { // Fetch teams
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not find teams"})
		return
	}

	match := models.Match{
		CompID: input.CompID,
		Teams:  teams, // Save teams in the many2many relationship
	}

	if err := h.MatchRepository.DB.Create(&match).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create match"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"match_id": match.MatchID})
}
