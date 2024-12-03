import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import Tesseract from 'tesseract.js';
import logo from './THIRUVALLUVAR.png';

const isSpeechRecognitionAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

const Home = () => {
  const [text, setText] = useState('');
  const [scannedText, setScannedText] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [image, setImage] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [sliderValue, setSliderValue] = useState(16); // Default font size
  const [voiceLang, setVoiceLang] = useState('en-IN'); // Default to English
  const [dailyKural, setDailyKural] = useState(null); // State to store daily Kural data
  const videoRef = useRef(null);

  // Fetch the daily Kural data when the component loads
  useEffect(() => {
    const fetchDailyKural = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/kural/daily-kural'); // Ensure this matches your backend
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDailyKural(data);
      } catch (error) {
        console.error('Error fetching daily Kural:', error);
      }
    };

    fetchDailyKural();
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      scanTextFromImage(file);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert('Error accessing camera: ' + err.message);
    }
  };

  const takePicture = () => {
    if (!cameraStream || !videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const img = canvas.toDataURL('image/png');
    setImage(img);

    Tesseract.recognize(img, 'eng+tam', { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setScannedText(text);
      })
      .catch((err) => {
        console.error('Error scanning image:', err);
      });
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const scanTextFromImage = (file) => {
    Tesseract.recognize(file, 'eng+tam', { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setScannedText(text);
      })
      .catch((err) => {
        console.error('Error scanning image:', err);
      });
  };

  const startVoiceRecognition = () => {
    if (!isSpeechRecognitionAvailable) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionInstance.lang = voiceLang;
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    setRecognition(recognitionInstance);

    recognitionInstance.start();

    recognitionInstance.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceText(transcript);
      setVoiceError('');
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setVoiceError(`Error occurred: ${event.error}`);
    };

    recognitionInstance.onend = () => {
      console.log('Speech recognition ended.');
    };
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
  };

  const handleSliderChange = (e) => {
    setSliderValue(Number(e.target.value));
  };

  const handleLanguageChange = (e) => {
    setVoiceLang(e.target.value);
  };

  return (
    <>
      {/* Navbar with logo */}
      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="navbar-title">THIRUKURAL</h1>
      </nav>

      {/* Main Content */}
      <div className="home-container">
        <div className="left-side">
          {/* Text input */}
          <div className="card">
            <label htmlFor="text-box">Enter your text:</label>
            <textarea
              id="text-box"
              value={text}
              onChange={handleTextChange}
              placeholder="Type Here..."
              rows="4"
              cols="50"
              className="input-area"
            />
          </div>

          {/* Camera section */}
          <div className="card camera-section">
            <button className="primary-button" onClick={openCamera}>Open Camera</button>
            {cameraStream && (
              <>
                <button className="secondary-button" onClick={takePicture}>Take Picture</button>
                <button className="danger-button" onClick={stopCamera}>Close Camera</button>
              </>
            )}
            <video ref={videoRef} className="video-preview" autoPlay muted></video>
          </div>

          {/* File upload and image preview */}
          <div className="card">
            <label htmlFor="image-upload">Upload an image with Tamil and English text:</label>
            <input
              type="file"
              id="image-upload"
              onChange={handleImageChange}
              accept="image/*"
              className="file-input"
            />
            {image && (
              <div className="image-preview-container">
                <img src={image} alt="Selected" className="image-preview" />
              </div>
            )}
          </div>

          {/* Voice recognition */}
          <div className="card">
            <label htmlFor="language-select">Select Language:</label>
            <select id="language-select" value={voiceLang} onChange={handleLanguageChange}>
              <option value="en-IN">English</option>
              <option value="ta-IN">Tamil</option>
            </select>
            <button className="primary-button" onClick={startVoiceRecognition}>Start Voice Recognition</button>
            <button className="danger-button" onClick={stopVoiceRecognition}>Stop Voice Recognition</button>
            <p>{voiceText ? `Recognized Voice Text: ${voiceText}` : 'No voice input yet'}</p>
            {voiceError && <p className="error-text">{voiceError}</p>}
          </div>
        </div>

        <div className="right-side">
          {/* Entered text */}
          <div className="card">
            <h3>Entered Text:</h3>
            <p>{text}</p>
          </div>

          {/* Extracted text with slider */}
          <div className="card">
            <h3>Extracted Tamil Text from Image:</h3>
            <input
              type="range"
              min="12"
              max="36"
              value={sliderValue}
              onChange={handleSliderChange}
              className="slider"
            />
            <p style={{ fontSize: `${sliderValue}px` }}>
              {scannedText ? scannedText : 'No text extracted yet'}
            </p>
          </div>

          {/* Recognized voice text */}
          <div className="card">
            <h3>Recognized Voice Text:</h3>
            <p>{voiceText ? voiceText : 'No voice recognition yet'}</p>
          </div>
        </div>
      </div>

      {/* New card outside the home-container to show daily Kural */}
      <div className="outside-card">
        <h2 className="daily_title">தினம் ஒரு குறள்</h2>
        <h4 className="daily">
          {dailyKural ? (
            <>
              <p>{dailyKural.Verse}</p>
              <p>{dailyKural.Explanation}</p>
              <p>{dailyKural.Translation}</p>
            </>
          ) : (
            <p>Loading the daily Kural...</p>
          )}
        </h4>
      </div>
    </>
  );
};

export default Home;
