"use client"
import { useState,useEffect,useRef } from "react";
import { useAudioRecorder } from "react-use-audio-recorder";
import { convertWebmToMp3 } from '@/src/entities/message/ui/voiceMessage/converterToMP3'
import { useUploadVoiceMessageMutation } from '@/src/entities/messenger'
import {IconPlayCircle,IconPauseCircle,IconClose} from '@rocketweb-studio/ulens-ui-kit'
import { Button } from '@/src/shared/ui'
import s from '@/src/entities/message/ui/voiceMessage/VoiceRecorder.module.scss'
import { io } from 'socket.io-client'
import WaveSurfer from 'wavesurfer.js'
import { UploadVoiceResponce } from '@/src/entities/messenger/api/messengerApi.type'

interface VoiceRecorderProps {
  roomId: number;
  onUploadSuccess?: (response: any) => void;
  onUploadError?: (error: any) => void;
  isRecording: boolean;
  setStartVoiceRecorder:() => void;
}

export  function VoiceRecorder({
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
    pauseRecording,
    resumeRecording,
  } = useAudioRecorder();

  const [uploadVoiceMessage, { isLoading, isSuccess, isError, error }] =
    useUploadVoiceMessageMutation();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null)

  // useEffect(() => {
  //   startRecording()
  //   return () => stopRecording()
  // }, [isRecording])
  useEffect(() => {
    if (!isRecording) return
    const initLiveWaveform = (stream: MediaStream) => {
      if (!waveformRef.current) return

      destroyWaveform()

      const audio = document.createElement('audio')
      audio.srcObject = stream
      audio.muted = true
      audio.play()

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
      })
    }

    const destroyWaveform = () => {
      waveSurferRef.current?.destroy()
      waveSurferRef.current = null
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaStreamRef.current = stream
      startRecording()
      initLiveWaveform(stream) // 🔥
    })

    return () => {
      stopRecording()
      destroyWaveform()
    }
  }, [isRecording])

  const waveformRef = useRef<HTMLDivElement | null>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)
  useEffect(() => {
    if (!audioUrl || !waveformRef.current) return

    if (waveSurferRef.current) {
      waveSurferRef.current.destroy()
    }

    waveSurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#A0A0A0',
      progressColor: '#4A90E2',
      cursorColor: 'transparent',
      barWidth: 2,
      height: 48,
    })

    waveSurferRef.current.load(audioUrl)

    return () => {
      waveSurferRef.current?.destroy()
      waveSurferRef.current = null
    }
  }, [audioUrl])


      const handleStopAndUpload = () => {
        if (roomId === null || roomId === undefined) {
          console.error('Room ID не указан');
          return;
        }

        if (isUploading) return;
        setIsUploading(true);

        stopRecording(async (blob) => { // ← добавляем async здесь
          if (!blob) {
            console.error('Нет аудио данных');
            setIsUploading(false);
            return;
          }

          const tempUrl = URL.createObjectURL(blob);
          setAudioUrl(tempUrl);


          waveSurferRef.current?.destroy()
          waveSurferRef.current = null


          // setTimeout(() => {
          //   if (!waveformRef.current) return
          //
          //   waveSurferRef.current = WaveSurfer.create({
          //     container: waveformRef.current,
          //     waveColor: '#A0A0A0',
          //     progressColor: '#4A90E2',
          //     cursorColor: 'transparent',
          //     height: 48,
          //     barWidth: 2,
          //   })
          //
          //   waveSurferRef.current.load(tempUrl)
          // }, 0)

          try {
            // КОНВЕРТИРУЕМ В MP3
            console.log('🔄 Конвертация WebM → MP3...');
            const mp3Blob = await convertWebmToMp3(blob); // ← здесь конвертация
            console.log('✅ Конвертация завершена:', {
              original: { size: blob.size, type: blob.type },
              converted: { size: mp3Blob.size, type: mp3Blob.type }
            });

            // Создаем File для отправки (MP3 вместо WAV)
            const audioFile = new File([mp3Blob], `voice-${Date.now()}.mp3`, { // ← меняем расширение
              type: 'audio/mpeg' // ← меняем MIME-тип
            });

            console.log('📤 Отправка MP3 файла:', {
              fileName: audioFile.name,
              fileType: audioFile.type,
              fileSize: audioFile.size
            });

            // Проверяем размер файла
            if (audioFile.size > 20 * 1024 * 1024) {
              console.error('Файл слишком большой (макс. 20MB)');
              URL.revokeObjectURL(tempUrl);
              setAudioUrl(null);
              setIsUploading(false);
              return;
            }

            // Отправляем на сервер
            uploadVoiceMessage({
              roomId,
              audio: audioFile // ← отправляем MP3 файл
            })
              .unwrap()
              .then((result) => {
                const token = localStorage.getItem('accessToken')
                const socket = io('https://ulens.org/ws', { auth: { token }, })
                console.log( {
                  id: result.id,
                  messageId: result.messageId,
                  url: result.url,
                  type: 'AUDIO',
                })

                socket.emit('SEND_MESSAGE', {
                  roomId,
                  content: 'VoiceMessage',
                  media: {
                    id: result.id,
                    messageId: result.messageId,
                    url: result.url,
                    type: 'AUDIO',
                  },
                })

                socket.disconnect()

                setStartVoiceRecorder()

                if (onUploadSuccess) {
                  onUploadSuccess(result)
                }
              })

              .catch((err) => {
                console.error('Ошибка загрузки:', err);
                if (onUploadError) {
                  onUploadError(err);
                }
              })
              .finally(() => {
                if (tempUrl) {
                  URL.revokeObjectURL(tempUrl);
                  setAudioUrl(null);
                }
                setIsUploading(false);
              });

          } catch (conversionError) {
            console.error('❌ Ошибка конвертации:', conversionError);
            setIsUploading(false);
            }
        });
      };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className={s.voiceRecorder}>

       <div>   <IconClose className={s.icon} onClick={() => {
         stopRecording()
         setStartVoiceRecorder()
       }}/></div>


      {recordingStatus === 'recording' ? (
        <IconPauseCircle
          className={s.icon}
          onClick={pauseRecording} // ✅ ПАУЗА ЗАПИСИ
        />
      ) : recordingStatus === 'paused' ? (
        <IconPlayCircle
          className={s.icon}
          onClick={resumeRecording} // ✅ ПРОДОЛЖИТЬ ЗАПИСЬ
        />
      ) : (
        <IconPlayCircle
          className={s.icon}
          onClick={() => waveSurferRef.current?.playPause()} // ▶️ ПРОИГРЫВАНИЕ
        />
      )}

      <div ref={waveformRef} className={s.waveform}/>

      <span> {formatTime(recordingTime)}</span>

        <Button
          className={s.buttonSubmit}
          type={'submit'}
          variant={'text'}
          size={'large'}
          withoutPadding
          onClick={handleStopAndUpload}
        >
          Send voice
        </Button>
    </div>
  );
}
export default VoiceRecorder;
