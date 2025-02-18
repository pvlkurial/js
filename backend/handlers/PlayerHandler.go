package handlers

import (
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PlayerHandler struct {
	PlayerService *services.PlayerService
}

func (h *PlayerHandler) GetPlayers(c *gin.Context) {
	players, err := h.PlayerService.GetAllPlayers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch players"})
		return
	}
	c.JSON(http.StatusOK, players)
}

func (h *PlayerHandler) CreatePlayer(c *gin.Context) {
	var player models.Player
	if err := c.ShouldBindJSON(&player); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := h.PlayerService.CreatePlayer(&player); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create player"})
		return
	}

	c.JSON(http.StatusCreated, player)
}
