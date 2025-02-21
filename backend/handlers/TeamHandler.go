package handlers

import (
	"backend/models"
	"backend/repositories"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TeamHandler struct {
	TeamRepository *repositories.TeamRepository
}

func (h *TeamHandler) GetTeams(c *gin.Context) {
	comps, err := h.TeamRepository.GetTeams()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch teams"})
		return
	}
	c.JSON(http.StatusOK, comps)
}

func (h *TeamHandler) CreateTeam(c *gin.Context) {
	var team models.Team
	if err := c.ShouldBindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := h.TeamRepository.CreateTeam(&team); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team"})
		return
	}

	c.JSON(http.StatusCreated, team)
}
