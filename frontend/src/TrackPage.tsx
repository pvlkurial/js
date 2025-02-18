import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Stats {
  record: number;
  round_number: string;
  timestamp: number; // Added timestamp field
}

const TrackPage: React.FC = () => {
  const { playerId, trackName } = useParams<{ playerId: string, trackName: string }>();
  const [statsData, setStatsData] = useState<Stats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [firstTimestamp, setFirstTimestamp] = useState<string | null>(null); // State for the first timestamp

  useEffect(() => {
    if (playerId && trackName) {
      const fetchTrackData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/stats/${playerId}/tracks/${trackName}`);
          const data = await response.json();
          setStatsData(data);

          // Get and format the first timestamp
          if (data.length > 0) {
            const firstTimestamp = data[0].timestamp;
            const date = new Date(firstTimestamp * 1000); // Convert from seconds to milliseconds
            const formattedDate = date.toUTCString(); // Convert to human-readable date
            setFirstTimestamp(formattedDate);
          }
        } catch (error) {
          console.error('Error fetching track data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTrackData();
    } else {
      console.error("Player ID or Track Name is missing!");
      setLoading(false);
    }
  }, [playerId, trackName]);

  // Helper function to format time as minutes:seconds:milliseconds
  const formatTime = (record: number): string => {
    const minutes = Math.floor(record / 60000);
    const seconds = Math.floor((record % 60000) / 1000);
    const milliseconds = record % 1000;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds < 10 ? '00' + milliseconds : milliseconds < 100 ? '0' + milliseconds : milliseconds}`;
  };

  // Calculate Average, Fastest, and Slowest records
  const calculateStats = () => {
    if (statsData.length === 0) return { average: 0, fastest: 0, slowest: 0 };

    const records = statsData.map(stat => stat.record);
    const total = records.reduce((sum, record) => sum + record, 0);
    const average = Math.round(total / records.length);
    const fastest = Math.min(...records);
    const slowest = Math.max(...records);

    return { average, fastest, slowest };
  };

  const { average, fastest, slowest } = calculateStats();

    // Determine the min and max records to set the chart y-axis scale dynamically
    const getMinMax = (data: Stats[]) => {
        const records = data.map(stat => stat.record);
        const min = Math.min(...records);
        const max = Math.max(...records);
        return { min, max };
      };

      const { min, max } = getMinMax(statsData);
    

      const chartData = {
        labels: statsData.map(stat => stat.round_number),
        datasets: [
          {
            label: `Records for Track: ${trackName}`,
            data: statsData.map(stat => stat.record),
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => {
                const record = tooltipItem.raw;
                return `Time: ${formatTime(record)}`;
              },
            },
          },
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Round Number',
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Record (ms)',
            },
            min: min - 500,
            max: max + 500,
          },
        },
      };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h2>Track: {trackName}</h2>
        {loading ? (
          <div>
            <Skeleton height={30} width={200} /> {/* Skeleton for Track Name */}
            <Skeleton height={20} width={150} style={{ marginTop: '20px' }} /> {/* Skeleton for "Records" title */}
          </div>
        ) : (
          <div>
            <h3>Player: {playerId}</h3>
            {firstTimestamp && (
              <p>Date: {firstTimestamp}</p>
            )}
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div>
          <h4>Average: {formatTime(average)}</h4>
        </div>
        <div>
          <h4>Fastest: {formatTime(fastest)}</h4>
        </div>
        <div>
          <h4>Slowest: {formatTime(slowest)}</h4>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
