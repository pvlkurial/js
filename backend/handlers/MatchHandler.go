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

func (h *MatchHandler) GetTracksByMatchID(c *gin.Context) {
	matchID, err := strconv.ParseUint(c.Param("match_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid match ID"})
		return
	}

	matches, err := h.MatchRepository.GetTracksByMatchID(uint(matchID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tracks of match"})
		return
	}

	c.JSON(http.StatusOK, matches)
}

func (h *MatchHandler) GetStatsByMatchAndTrack(c *gin.Context) {
	// Parse matchID as uint
	matchID, err := strconv.ParseUint(c.Param("match_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid match ID format"})
		return
	}

	// Get trackName directly as string (no need to parse as uint)
	trackName := c.Param("track_name") // Changed from "TrackName" to "track_name" to match URL convention

	// Get stats from repository
	stats, err := h.MatchRepository.GetStatsByMatchAndTrack(uint(matchID), trackName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *MatchHandler) GetMatches(c *gin.Context) {
	matches, err := h.MatchRepository.GetMatches()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch matches"})
		return
	}

	c.JSON(http.StatusOK, matches)
}
