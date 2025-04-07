import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

import MainGame from "./components/MainGame";
import History from "./components/History";
import Timer from "./components/Timer";
import GameEnd from "./components/GameEnd";
import ErrorBoundary from "./components/ErrorBoundary";
import Spinner from "./components/Spinner";

import Background from "./assets/images/background.png";
import Logo from "./assets/images/logo.png";
import GameBox from "./assets/images/game-box.png";
import IconBack from "./assets/images/other-icon-back.png";
import MetaMask from "./assets/images/metamask-icon.png";
import Sound from "./assets/images/sound-icon.png";
import Play from "./assets/images/play-icon.png";
import HistoryIcon from "./assets/images/history-icon.png";

axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const [gameBoxStatus, setGameBoxStatus] = useState(3);
  const [historyList, setHistoryList] = useState([]);
  const [walletAddress] = useState(
    "0xc38A8C277F831a881dDC836fE4294B41cc295a9D"
  );
  const [lastTime, setLastTime] = useState("");
  const [playNumber, setPlayNumber] = useState(4);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`time/${walletAddress}`);
        setLastTime(response.data.result);
        setGameBoxStatus(0);
        setPlayNumber(Math.floor(Math.random() * 1000000));
      } catch (error) {
        console.error("Fetch initial data error:", error);
      }
      setLoading(false);
    };
    fetchInitialData();
  }, [walletAddress]);

  const _onPressHistoryButton = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`history/${walletAddress}`);
      setHistoryList(response.data.history);
      setGameBoxStatus(2);
    } catch (error) {
      console.error("History fetch error:", error);
    }
    setLoading(false);
  };

  const _onPressPlayButton = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`time/${walletAddress}`);
      setLastTime(response.data.result);
      setGameBoxStatus(0);
    } catch (error) {
      console.error("Play fetch error:", error);
    }
    setLoading(false);
  };

  const gamefinish = async () => {
    setGameBoxStatus(3);
    try {
      await axios.post("/add", {
        address: walletAddress,
        earn: "Earned Item", // Adjust based on your logic
        playtime: new Date().toString(),
      });
    } catch (error) {
      console.error("Error posting game result:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center">
        <img
          src={Background}
          className="absolute w-full h-full"
          alt="Background"
        />
        <img
          src={Logo}
          className="absolute left-[3%] top-[2%] w-[12%] h-[13%]"
          alt="Logo"
        />
        <img
          src={GameBox}
          className="absolute w-[54%] h-[90%] left-[23%] top-[5%]"
          alt="Game Box"
        />

        {loading && <Spinner />}

        {!loading && gameBoxStatus === 0 && (
          <Timer finish={setGameBoxStatus} lasttime={lastTime} />
        )}
        {!loading && gameBoxStatus === 1 && (
          <MainGame gamefinish={gamefinish} playnumber={playNumber} />
        )}
        {!loading && gameBoxStatus === 2 && <History list={historyList} />}
        {!loading && gameBoxStatus === 3 && <GameEnd getearn={playNumber} />}

        <button className="absolute w-[15%] h-[15%] top-[50%] left-0">
          <img src={IconBack} className="w-full h-full" alt="Settings" />
          <img
            src={MetaMask}
            className="absolute left-[35%] top-[40%] w-[30%] h-[35%]"
            alt="MetaMask"
          />
        </button>

        <button className="absolute w-[15%] h-[15%] top-[75%] left-0">
          <img src={IconBack} className="w-full h-full" alt="Sound" />
          <img
            src={Sound}
            className="absolute left-[35%] top-[40%] w-[30%] h-[35%]"
            alt="Sound Icon"
          />
        </button>

        <button
          className="absolute w-[20%] h-[18%] top-[45%] right-[2%]"
          onClick={_onPressPlayButton}
        >
          <img src={Play} className="w-full h-full" alt="Play" />
        </button>

        <button
          className="absolute w-[15%] h-[15%] top-[75%] right-0"
          onClick={_onPressHistoryButton}
        >
          <img
            src={IconBack}
            className="w-full h-full transform rotate-y-180"
            alt="History"
          />
          <img
            src={HistoryIcon}
            className="absolute left-[35%] top-[40%] w-[30%] h-[35%]"
            alt="History Icon"
          />
        </button>
      </div>
    </ErrorBoundary>
  );
}

export default App;
