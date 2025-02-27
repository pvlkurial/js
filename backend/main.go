package main

import (
	"fmt"
	"log"
	"os"

	"backend/handlers"
	"backend/models"
	"backend/repositories"
	"backend/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	godotenv.Load()
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	dsn := "host=localhost user=me password=123 dbname=godb port=5432 sslmode=disable"
	db, _ := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	//db.Migrator().DropTable(&models.Comp{}, &models.Player{}, &models.Track{}, &models.Stats{}, &models.Match{}, &models.Team{})

	// Initialize Repositories
	playerRepo := &repositories.PlayerRepository{DB: db}
	compRepo := &repositories.CompRepository{DB: db}
	statsRepo := &repositories.StatsRepository{DB: db}
	matchRepo := &repositories.MatchRepository{DB: db}
	trackRepo := &repositories.TrackRepository{DB: db}
	teamRepo := &repositories.TeamRepository{DB: db}

	// Initialize Services
	playerService := &services.PlayerService{PlayerRepo: playerRepo}
	compService := &services.CompService{CompRepo: compRepo}
	statsService := &services.StatsService{StatsRepo: statsRepo}

	// Initialize Handlers
	PlayerHandler := &handlers.PlayerHandler{PlayerService: playerService}
	StatsHandler := &handlers.StatsHandler{StatsService: statsService}
	CompHandler := &handlers.CompHandler{CompService: compService}
	MatchHandler := &handlers.MatchHandler{MatchRepository: matchRepo}
	TrackHandler := &handlers.TrackHandler{TrackRepository: trackRepo}
	TeamHandler := &handlers.TeamHandler{TeamRepository: teamRepo}
	//db.AutoMigrate(&models.Comp{}, &models.Match{}, &models.Team{}, &models.Track{})
	db.AutoMigrate(&models.Match{}, &models.Track{}, &models.Comp{}, &models.Player{}, &models.Stats{}, &models.Team{})
	r := gin.Default()
	fmt.Println(db.Dialector.Explain("SELECT * FROM comps"))

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/", func(c *gin.Context) {
		//c.JSON(200, gin.H{"message": "Hello from Go backend!"})
		c.JSON(200, gin.H{"message": "Hello World"})
	})

	r.GET("/players", PlayerHandler.GetPlayers)
	r.POST("/players", PlayerHandler.CreatePlayer)

	r.GET("/comps", CompHandler.GetComps)
	r.POST("/comps", CompHandler.CreateComp)

	r.GET("/comps/:comp_id/matches", MatchHandler.GetMatchesByComp)

	r.GET("/tracks", TrackHandler.GetTracks)
	r.POST("/tracks", TrackHandler.CreateTrack)

	r.GET("/teams", TeamHandler.GetTeams)
	r.POST("/teams", TeamHandler.CreateTeam)

	r.POST("/matches", MatchHandler.CreateMatch)

	r.POST("/stats", StatsHandler.CreateStats)
	r.GET("/stats/:player_id", StatsHandler.GetStatsByPlayer)
	r.GET("/stats/:player_id/tracks/:track_id", StatsHandler.GetStatsByPlayerByTrack)

	r.POST("/upload-csv", handlers.UploadCSVHandler(db))

	fmt.Println("Server running on port " + port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
