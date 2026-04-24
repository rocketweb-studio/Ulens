"use client"
import { useState,useEffect,useRef } from "react";
import { useAudioRecorder } from "react-use-audio-recorder";
import { convertWebmToMp3 } from '@/src/entities/message/ui/voiceMessage/converterToMP3'
import { useUploadVoiceMessageMutation } from '@/src/entities/messenger'
import {IconPlayCircle,IconPauseCircle,IconCloseOutline} from '@rocketweb-studio/ulens-ui-kit'
import { Button } from '@/src/shared/ui'
import s from '@/src/entities/message/ui/voiceMessage/VoiceRecorder.module.scss'
import { io } from 'socket.io-client'
import WaveSurfer from 'wavesurfer.js'

interface VoiceRecorderProps {
  roomId: number;
  onUploadSuccess?: (response: any) => void;
  onUploadError?: (error: any) => void;
  isRecording: boolean;
  setStartVoiceRecorder: () => void;
}

export function VoiceRecorder({
                                roomId,
                                onUploadSuccess,
                                onUploadError,
                                isRecording,
                                setStartVoiceRecorder
                              }: VoiceRecorderProps) {
  const {
    recordingStatus,
    recordingTime,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  const [uploadVoiceMessage, { isLoading }] = useUploadVoiceMessageMutation();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Refs для waveform
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Эффект для записи
  useEffect(() => {
    if (!isRecording) return;

    const initLiveWaveform = (stream: MediaStream) => {
      if (!waveformRef.current) return;

      // Очищаем предыдущий
      waveSurferRef.current?.destroy();

      const audio = document.createElement('audio');
      audio.srcObject = stream;
      audio.muted = true;
      audio.play();

      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#A0A0A0',
        progressColor: '#4A90E2',
        cursorColor: 'transparent',
        height: 48,
        barWidth: 2,
        interact: false,
        backend: 'MediaElement',
        media: audio,
      });
    };

    const destroyWaveform = () => {
      waveSurferRef.current?.destroy();
      waveSurferRef.current = null;
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaStreamRef.current = stream;
        startRecording();
        initLiveWaveform(stream);
      })
      .catch((error) => {
        console.error('Ошибка доступа к микрофону:', error);
      });

    return () => {
      stopRecording();
      destroyWaveform();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  // Эффект для прослушивания записанного
  useEffect(() => {
    if (!audioUrl || !waveformRef.current) return;

    // Очищаем предыдущий
    waveSurferRef.current?.destroy();

    waveSurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#A0A0A0',
      progressColor: '#4A90E2',
      cursorColor: 'transparent',
      barWidth: 2,
      height: 48,
      interact: true,
    });

    waveSurferRef.current.load(audioUrl);

    // Добавляем обработчики событий для воспроизведения
    waveSurferRef.current.on('play', () => {
      setIsPlaying(true);
      startTimeUpdater();
    });

    waveSurferRef.current.on('pause', () => {
      setIsPlaying(false);
      stopTimeUpdater();
    });

    waveSurferRef.current.on('finish', () => {
      setIsPlaying(false);
      stopTimeUpdater();
      // Сбрасываем на начало при завершении
      if (waveSurferRef.current) {
        setCurrentTime(0);
      }
    });

    waveSurferRef.current.on('ready', () => {
      // Получаем длительность когда аудио готово
      const duration = waveSurferRef.current?.getDuration();
      if (duration && !isNaN(duration)) {
        setAudioDuration(duration);
      }
    });

    // Событие для обновления времени при перемотке
    waveSurferRef.current.on('audioprocess', (currentTime) => {
      if (!isNaN(currentTime)) {
        setCurrentTime(currentTime);
      }
    });

    return () => {
      waveSurferRef.current?.destroy();
      waveSurferRef.current = null;
      setIsPlaying(false);
      stopTimeUpdater();
    };
  }, [audioUrl]);

  // Функции для обновления времени
  const startTimeUpdater = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (waveSurferRef.current && isPlaying) {
        const time = waveSurferRef.current.getCurrentTime();
        if (!isNaN(time)) {
          setCurrentTime(time);
        }
      }
    }, 100); // Обновляем каждые 100ms
  };

  const stopTimeUpdater = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleStopRecording = () => {
    stopRecording((blob) => {
      if (!blob || blob.size === 0) {
        console.error('Blob пустой или поврежден');
        return;
      }
      const tempUrl = URL.createObjectURL(blob);
      setAudioUrl(tempUrl);
      setRecordedBlob(blob);
    });
  };

  const handlePlayPause = () => {
    if (!waveSurferRef.current) return;

    waveSurferRef.current.playPause();
  };

  const handleSendRecording = async () => {
    if (!recordedBlob || isUploading || !roomId) {
      return;
    }

    setIsUploading(true);

    try {
      // Конвертация в MP3
      const mp3Blob = await convertWebmToMp3(recordedBlob);

      // Проверка размера
      if (mp3Blob.size === 0) {
        throw new Error('Конвертированный файл пустой');
      }

      //  Создание файла
      const audioFile = new File(
        [mp3Blob],
        `voice-${Date.now()}.mp3`,
        { type: 'audio/mpeg' }
      );

      // Отправка на сервер
      const result = await uploadVoiceMessage({
        roomId,
        audio: audioFile
      }).unwrap();

      // WebSocket отправка
      const token = localStorage.getItem('accessToken');
      if (token) {
        const socket = io('https://ulens.org/ws', {
          auth: { token },
          transports: ['websocket']
        });

        socket.emit('SEND_MESSAGE', {
          roomId,
          content: 'Voice message',
          media: result
        });

        setTimeout(() => socket.disconnect(), 500);
      }

      // 6. Вызов успешного колбэка
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }

      // 7. Закрытие рекордера
      setStartVoiceRecorder();

    } catch (error) {
      console.error('Ошибка отправки: ', error);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      // 8. Очистка
      setIsUploading(false);
      setRecordedBlob(null);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
      return "00:00";
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDisplayTime = () => {
    if (!recordedBlob) {
      return formatTime(recordingTime);
    }

    if (isPlaying) {
      // Показываем текущее время при воспроизведении
      return formatTime(currentTime);
    } else {
      // Показываем либо текущее время (если аудио на паузе),
      // либо общую длительность (если аудио остановлено)
      const displayTime = currentTime > 0 ? currentTime : audioDuration;
      return formatTime(displayTime);
    }
  };

  const handleClose = () => {
    stopRecording();
    setStartVoiceRecorder();

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    setRecordedBlob(null);
    waveSurferRef.current?.destroy();
    waveSurferRef.current = null;
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioDuration(0);
    stopTimeUpdater();
  };

  // Определяем классы состояний
  const recordingClassName = isRecording ? s.recording : '';
  const playingClassName = isPlaying ? s.playing : '';

  return (
    <div className={`${s.voiceRecorder} ${recordingClassName} ${playingClassName}`}>
      <div className={s.mainContainer}>
        {/* Левый блок: иконка закрытия + время */}
        <div className={s.leftBlock}>
          <IconCloseOutline
            className={s.icon}
            onClick={handleClose}
          />
          <span className={s.time}>{getDisplayTime()}</span>
        </div>

        {/* Центральный блок: иконка play/pause + waveform */}
        <div className={s.centerBlock}>
          {!recordedBlob ? (
            // РЕЖИМ ЗАПИСИ
            <>
              {recordingStatus === 'stopped' && (
                <IconPlayCircle
                  className={s.icon}
                  onClick={startRecording}
                />
              )}
              <div> <div ref={waveformRef} className={s.waveform}/>
                <p className={s.audioPlaceholder}>An audio message is being recorded...</p></div>

            </>
          ) : (
            // РЕЖИМ ПРОСЛУШИВАНИЯ
            <>
              {isPlaying ? (
                <IconPauseCircle
                  className={s.icon}
                  onClick={handlePlayPause}
                />
              ) : (
                <IconPlayCircle
                  className={s.icon}
                  onClick={handlePlayPause}
                />
              )}
              <div ref={waveformRef} className={s.waveform} />
            </>
          )}
        </div>

        {/* Правый блок: кнопка отправки */}
        <div className={s.rightBlock}>
          {!recordedBlob ? (
            <Button
              className={s.buttonSubmit}
              type="button"
              variant="text"
              size="large"
              withoutPadding
              onClick={handleStopRecording}
              disabled={recordingStatus === 'idle'}
            >
              Stop
            </Button>
          ) : (
            <Button
              className={s.buttonSubmit}
              type="button"
              variant="text"
              size="large"
              withoutPadding
              onClick={handleSendRecording}
              disabled={isUploading || isLoading}
            >
              Send Voice
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceRecorder;
