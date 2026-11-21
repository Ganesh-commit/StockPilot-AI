import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';

export default function WatchDemoModal({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [activeScene, setActiveScene] = useState(1);

  const scenes = [
    { num: 1, title: 'Overview', time: 0 },
    { num: 2, title: 'Dashboard', time: 4.6 },
    { num: 3, title: 'Inventory', time: 9.2 },
    { num: 4, title: 'Forecasting', time: 13.8 },
    { num: 5, title: 'Procurement', time: 18.4 },
    { num: 6, title: 'Budget Optimizer', time: 23.0 },
    { num: 7, title: 'Risk Analysis', time: 27.6 },
    { num: 8, title: 'Conclusion', time: 32.2 }
  ];

  // Prevent background scrolling when modal is open & handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  // Track active scene from time
  useEffect(() => {
    const matched = scenes.slice().reverse().find(s => currentTime >= s.time);
    if (matched) setActiveScene(matched.num);
  }, [currentTime]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setHasError(false);
    // Auto-play on open
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const handleSeek = e => {
    const seekTime = +e.target.value;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = e => {
    const val = +e.target.value;
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };

  const jumpToScene = time => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const formatTime = sec => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 37, 28, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E2D7',
          borderRadius: '24px',
          maxWidth: '1080px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(16, 69, 44, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Topbar */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#FAF7F0',
            borderBottom: '1px solid #E8E2D7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#EAF7EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={16} color="#145C38" />
            </div>
            <div>
              <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 800, color: '#18251C' }}>
                StockPilot AI — Guided Product Walkthrough
              </h3>
              <div style={{ fontSize: '11px', color: '#687369' }}>
                Step-by-step demonstration of autonomous demand forecasting & procurement optimization
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E2D7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#18251C',
              transition: 'all 0.15s ease'
            }}
            title="Close Demo"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player Box */}
        <div style={{ position: 'relative', width: '100%', backgroundColor: '#000000', aspectRatio: '16/9' }}>
          {hasError ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                gap: '12px',
                padding: '24px'
              }}
            >
              <AlertCircle size={36} color="#F29A38" />
              <div style={{ fontSize: '16px', fontWeight: 700 }}>Unable to load video stream</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                Please ensure <code>/stockpilot_demo.mp4</code> is present in the public assets directory.
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src="/stockpilot_demo.mp4"
              playsInline
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onError={() => setHasError(true)}
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', cursor: 'pointer' }}
            />
          )}

          {/* Big Center Play Overlay (when paused) */}
          {!isPlaying && !hasError && (
            <div
              onClick={togglePlay}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#145C38',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  transform: 'scale(1)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <Play size={28} color="#ffffff" fill="#ffffff" style={{ marginLeft: '4px' }} />
              </div>
            </div>
          )}
        </div>

        {/* Custom Video Controls Bar */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#18251C',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {/* Progress Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              style={{
                flex: 1,
                accentColor: '#145C38',
                cursor: 'pointer',
                height: '5px'
              }}
            />
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#D6CEBF', whiteSpace: 'nowrap' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Buttons Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={togglePlay}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="#ffffff" />}
              </button>

              <button
                onClick={() => jumpToScene(0)}
                style={{ background: 'transparent', border: 'none', color: '#D6CEBF', cursor: 'pointer' }}
                title="Restart"
              >
                <RotateCcw size={17} />
              </button>

              {/* Volume */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={toggleMute}
                  style={{ background: 'transparent', border: 'none', color: '#D6CEBF', cursor: 'pointer' }}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{ width: '70px', accentColor: '#145C38', height: '4px', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Current Scene Display & Fullscreen */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '12px', color: '#F29A38', fontWeight: 700 }}>
                Scene {activeScene}/8: {scenes.find(s => s.num === activeScene)?.title}
              </span>

              <button
                onClick={handleFullscreen}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                title="Fullscreen"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Scene Navigation Quick-Jump Bar */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#FAF7F0',
            borderTop: '1px solid #E8E2D7',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#687369', marginRight: '6px' }}>
            CHAPTERS:
          </span>
          {scenes.map(s => {
            const isActive = activeScene === s.num;
            return (
              <button
                key={s.num}
                onClick={() => jumpToScene(s.time)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: isActive ? '#145C38' : '#E8E2D7',
                  backgroundColor: isActive ? '#145C38' : '#FFFFFF',
                  color: isActive ? '#ffffff' : '#18251C',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {s.num}. {s.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
