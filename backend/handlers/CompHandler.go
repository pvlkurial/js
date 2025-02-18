package handlers

import (
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CompHandler struct {
	CompService *services.CompService
}

func (h *CompHandler) GetComps(c *gin.Context) {
	comps, err := h.CompService.GetComps()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comps"})
		return
	}
	c.JSON(http.StatusOK, comps)
}

func (h *CompHandler) CreateComp(c *gin.Context) {
	var comp models.Comp
	if err := c.ShouldBindJSON(&comp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := h.CompService.CreateComp(&comp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comp"})
		return
	}

	c.JSON(http.StatusCreated, comp)
}
