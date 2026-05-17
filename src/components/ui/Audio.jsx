import React, { useRef, useState, useEffect } from "react";
import {
  Mic,
  Trash2,
  Volume2,
  X,
  Play,
  Pause,
} from "lucide-react";

const VoiceRecorder = ({ onChange, name, disabled, maxDuration = 200 }) => {
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null); // FIX #3: store stream separately
  const chunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recordingError, setRecordingError] = useState(null);

  useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioURL]);

  // FIX #2: auto-stop via effect when time hits limit, not inside state updater
  useEffect(() => {
    if (recording && recordingTime >= maxDuration) {
      stopRecording();
    }
  }, [recordingTime, recording, maxDuration]);

  const formatTime = (seconds) => {
    const s = Math.floor(seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    if (disabled) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream; // FIX #3: save stream to ref
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);
        // FIX #5: duration is handled by onLoadedMetadata on the <audio> ref — no extra Audio() needed

        if (onChange) onChange(name, blob);

        // Stop all tracks via the stored ref
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setRecording(true);
      setRecordingTime(0); // FIX #4: always reset timer on new recording
      setRecordingError(null);

      // FIX #1: correct timer — increment every second, stop at maxDuration (handled by effect)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setRecordingError(
        "Please allow microphone access to record voice messages"
      );
    }
  };

  const stopRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state !== "recording"
    )
      return;

    mediaRecorderRef.current.stop();
    // FIX #3: stop tracks via streamRef, not via mediaRecorderRef.current.stream
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    setRecording(false);
    // FIX #4: reset time so next recording starts from 0
    setRecordingTime(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      // Prevent onstop from firing onChange by clearing chunks
      chunksRef.current = [];
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop()); // FIX #3
      streamRef.current = null;
    }

    setRecording(false);
    setRecordingTime(0); // FIX #4
    setRecordingError(null);
  };

  const deleteRecording = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setAudioBlob(null);
    setDuration(0);
    setPlaybackTime(0);
    setIsPlaying(false);
    setShowDeleteConfirm(false);

    if (onChange) onChange(name, null);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setPlaybackTime(audioRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setPlaybackTime(newTime);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    if (!disabled && !audioURL) {
      setIsDragging(false);
      startRecording();
    }
  };

  const handleMouseUp = () => {
    if (recording && !isDragging) stopRecording();
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (recording) setIsDragging(true);
  };

  const ProgressBar = ({ value, max, onChange: onSeek, color }) => (
    <input
      type="range"
      min="0"
      max={max || 1}
      step="0.1"
      value={value}
      onChange={onSeek}
      className={`flex-1 h-1 rounded-lg appearance-none cursor-pointer ${color}`}
      style={{
        background: `linear-gradient(to right, ${
          color === "bg-green-500" ? "#10b981" : "#3b82f6"
        } ${(value / (max || 1)) * 100}%, #e5e7eb ${
          (value / (max || 1)) * 100
        }%)`,
      }}
    />
  );

  return (
    <div className="relative">
      {recordingError && (
        <div className="absolute -top-12 left-0 right-0 bg-red-500 text-white text-sm px-3 py-2 rounded-lg">
          {recordingError}
        </div>
      )}

      {!audioURL ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={disabled}
            className={`
              relative group flex items-center justify-center gap-2 px-5 py-2.5 rounded-full
              transition-all duration-200 transform active:scale-95
              ${recording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              text-white font-medium shadow-lg
            `}
          >
            <Mic size={18} className={recording ? "animate-pulse" : ""} />
            <span>
              {recording
                ? `${formatTime(recordingTime)} / ${formatTime(maxDuration)}`
                : "Hold to record"}
            </span>
          </button>

          {recording && (
            <button
              type="button"
              onClick={cancelRecording}
              className="p-2.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <X size={18} className="text-gray-700" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-gray-50 rounded-full p-2 shadow-sm border border-gray-200">
          <button
            type="button"
            onClick={togglePlayback}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors text-white"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <div className="flex-1 flex items-center gap-2">
            <Volume2 size={14} className="text-gray-500" />
            <ProgressBar
              value={playbackTime}
              max={duration}
              onChange={handleSeek}
              color="bg-blue-500"
            />
            <span className="text-xs text-gray-600 min-w-10">
              {formatTime(playbackTime)} / {formatTime(Math.floor(duration))}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {showDeleteConfirm ? (
              <>
                <button
                  type="button"
                  onClick={deleteRecording}
                  className="px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-full hover:bg-gray-200 transition-colors"
                  title="Delete recording"
                >
                  <Trash2 size={16} className="text-gray-600" />
                </button>
             
              </>
            )}
          </div>

          <audio
            ref={audioRef}
            src={audioURL}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          />
        </div>
      )}

      {recording && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Recording...
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;