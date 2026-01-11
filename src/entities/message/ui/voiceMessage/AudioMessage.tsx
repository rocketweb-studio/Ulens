'use client'
import { useState, useRef, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'
import s from './AudioMessage.module.scss'

interface AudioMessageProps {
  audioUrl: string
  type: 'mine' | 'friend'
}

export const AudioMessage = ({ audioUrl, type }: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)

  const waveformRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<WaveSurfer | null>(null)
  const destroyedRef = useRef(false)


  //  Создание WaveSurfer (один раз)
  useEffect(() => {
    if (!waveformRef.current || waveRef.current) return
    destroyedRef.current = false

    const wave = WaveSurfer.create({
      container: waveformRef.current!,
      waveColor: type === 'mine' ? '#9CA3AF' : '#CBD5E1',
      progressColor: type === 'mine' ? '#2563EB' : '#0EA5E9',
      interact: true,
      media: new Audio(audioUrl),
    })

    waveRef.current = wave
    wave.on('audioprocess', () => {
      if (!destroyedRef.current) {
        setCurrentTime(wave.getCurrentTime())
      }
    })

    wave.on('ready', () => {
      if (!destroyedRef.current) {
        setAudioDuration(wave.getDuration())
      }
    })

    wave.on('play', () => setIsPlaying(true))
    wave.on('pause', () => setIsPlaying(false))
    wave.on('finish', () => setIsPlaying(false))

    return () => {
      destroyedRef.current = true
      wave.destroy()
      waveRef.current = null
    }
  }, [type])

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
      <button className={s.playButton} onClick={togglePlay}>
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className={s.waveformContainer}>
        <div ref={waveformRef} className={s.waveform} />

        <div className={s.timeInfo}>
          <span>{formatTime(currentTime)}</span>
          <span> / {formatTime(audioDuration)}</span>
        </div>
      </div>
    </div>
  )
}
