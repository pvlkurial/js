import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlayerDetailsPage from './PlayersDetailPage';
import TrackPage from './TrackPage';
import UploadCSV from './ParseFunc';
import PlayersPage from './PlayersPage';
import Navbar from './components/navbar';
import Home from "./Home";
import Events from './Events';
import CreateEvent from './CreateEvent';
import CompMatches from './CompMatches'
import CreateMatch from './CreateMatch';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/upload" element={<UploadCSV/>} />
        <Route path="/events" element={<Events />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event/:comp_id" element={<CompMatches />} />
        <Route path="/event/:comp_id/create-match" element={<CreateMatch />} />
        <Route path="/players" element={<PlayersPage/>} />
        <Route path="/player/:playerId" element={<PlayerDetailsPage />} />
        <Route path="/player/:playerId/track/:trackName" element={<TrackPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
