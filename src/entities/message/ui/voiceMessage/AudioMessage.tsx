'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'
import s from './AudioMessage.module.scss'

interface AudioMessageProps {
  audioUrl: string
  type: 'mine' | 'friend'
}

export const AudioMessage = ({ audioUrl, type }: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState( 0)
  const [volume, setVolume] = useState(0.7)

  const waveformRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (!audioUrl || !waveformRef.current) return



    waveRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: type === 'mine' ? '#9CA3AF' : '#CBD5E1',
      progressColor: type === 'mine' ? '#2563EB' : '#0EA5E9',
      height: 32,
      barWidth: 2,
      cursorColor: 'transparent',
    })

    waveRef.current.load(audioUrl)

    waveRef.current.on('audioprocess', () => {
      setCurrentTime(waveRef.current!.getCurrentTime())
    })

    waveRef.current.on('ready', () => {
      setAudioDuration(waveRef.current!.getDuration())
      waveRef.current!.setVolume(volume)
    })

    waveRef.current.on('play', () => setIsPlaying(true))
    waveRef.current.on('pause', () => setIsPlaying(false))
    waveRef.current.on('finish', () => setIsPlaying(false))

    return () => {
      waveRef.current?.destroy()
      waveRef.current = null
    }
  }, [audioUrl, type])

  // громкость
  useEffect(() => {
    waveRef.current?.setVolume(volume)
  }, [volume])

  const togglePlay = () => {
    waveRef.current?.playPause()
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

      <div className={s.waveformContainer}>
        <div ref={waveformRef} className={s.waveform} />

        <div className={s.timeInfo}>
          <span className={s.currentTime}>{formatTime(currentTime)}</span>
          <span className={s.duration}>/ {formatTime(audioDuration)}</span>
        </div>
      </div>

    </div>
  )
}
