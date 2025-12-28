// @/src/entities/message/ui/AudioMessage/AudioMessage.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import s from './AudioMessage.module.scss'

interface AudioMessageProps {
  audioUrl: string
  duration?: number
  type: 'mine' | 'friend'
}

export const AudioMessage = ({ audioUrl, duration, type }: AudioMessageProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(duration || 0)
  const [volume, setVolume] = useState(0.7)

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(e => console.error('Play error:', e))
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !e.currentTarget) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const width = rect.width
    const percentage = clickPosition / width

    audioRef.current.currentTime = percentage * audioDuration
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`${s.audioMessage} ${s[type]}`}>
      <button
        className={s.playButton}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <div className={s.waveformContainer} onClick={handleSeek}>
        <div className={s.progressBar}>
          <div
            className={s.progressFill}
            style={{ width: `${(currentTime / audioDuration) * 100}%` }}
          />
        </div>

        <div className={s.timeInfo}>
          <span className={s.currentTime}>{formatTime(currentTime)}</span>
          <span className={s.duration}>/ {formatTime(audioDuration)}</span>
        </div>
      </div>

      <div className={s.volumeControl}>
        <Volume2 size={14} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value)
            setVolume(newVolume)
            if (audioRef.current) {
              audioRef.current.volume = newVolume
            }
          }}
          className={s.volumeSlider}
        />
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
    </div>
  )
}
