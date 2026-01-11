//
// 'use client'
// import { useState,useEffect,useRef } from "react";
// import { useAudioRecorder } from "react-use-audio-recorder";
// import { convertWebmToMp3 } from '@/src/entities/message/ui/voiceMessage/converterToMP3'
// import { useUploadVoiceMessageMutation } from '@/src/entities/messenger'
// import {IconPlayCircle,IconPauseCircle,IconClose} from '@rocketweb-studio/ulens-ui-kit'
// import { Button } from '@/src/shared/ui'
// import s from '@/src/entities/message/ui/voiceMessage/VoiceRecorder.module.scss'
// import { io } from 'socket.io-client'
// import WaveSurfer from 'wavesurfer.js'
// import { UploadVoiceResponce } from '@/src/entities/messenger/api/messengerApi.type'
//
// interface VoiceRecorderProps {
//   roomId: number;
//   onUploadSuccess?: (response: any) => void;
//   onUploadError?: (error: any) => void;
//   isRecording: boolean;
//   setStartVoiceRecorder:() => void;
// }
//
// export  function VoiceRecorder({
//                                  roomId,
//                                  onUploadSuccess,
//                                  onUploadError,
//                                  isRecording,
//                                  setStartVoiceRecorder
//                                }: VoiceRecorderProps) {
//   const {
//     recordingStatus,
//     recordingTime,
//     startRecording,
//     stopRecording,
//     pauseRecording,
//     resumeRecording,
//   } = useAudioRecorder();
//
//   const [uploadVoiceMessage, { isLoading, isSuccess, isError, error }] =
//     useUploadVoiceMessageMutation();
//
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const mediaStreamRef = useRef<MediaStream | null>(null)
//
//   // useEffect(() => {
//   //   startRecording()
//   //   return () => stopRecording()
//   // }, [isRecording])
//   useEffect(() => {
//     if (!isRecording) return
//     const initLiveWaveform = (stream: MediaStream) => {
//       if (!waveformRef.current) return
//
//       destroyWaveform()
//
//       const audio = document.createElement('audio')
//       audio.srcObject = stream
//       audio.muted = true
//       audio.play()
//
//       waveSurferRef.current = WaveSurfer.create({
//         container: waveformRef.current,
//         waveColor: '#A0A0A0',
//         progressColor: '#4A90E2',
//         cursorColor: 'transparent',
//         height: 48,
//         barWidth: 2,
//         interact: false,
//         backend: 'MediaElement',
//         media: audio,
//       })
//     }
//
//     const destroyWaveform = () => {
//       waveSurferRef.current?.destroy()
//       waveSurferRef.current = null
//     }
//
//     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//       mediaStreamRef.current = stream
//       startRecording()
//       initLiveWaveform(stream) // 🔥
//     })
//
//     return () => {
//       stopRecording()
//       destroyWaveform()
//     }
//   }, [isRecording])
//
//   const waveformRef = useRef<HTMLDivElement | null>(null)
//   const waveSurferRef = useRef<WaveSurfer | null>(null)
//   useEffect(() => {
//     if (!audioUrl || !waveformRef.current) return
//
//     if (waveSurferRef.current) {
//       waveSurferRef.current.destroy()
//     }
//
//     waveSurferRef.current = WaveSurfer.create({
//       container: waveformRef.current,
//       waveColor: '#A0A0A0',
//       progressColor: '#4A90E2',
//       cursorColor: 'transparent',
//       barWidth: 2,
//       height: 48,
//     })
//
//     waveSurferRef.current.load(audioUrl)
//     // console.log('waveSurferRef?.current?.load(audioUrl)',waveSurferRef.current.load(audioUrl))
//     return () => {
//       waveSurferRef.current?.destroy()
//       waveSurferRef.current = null
//     }
//   }, [audioUrl])
//
//
//   const handleStopAndUpload = () => {
//     if (roomId === null || roomId === undefined) {
//       console.error('Room ID не указан');
//       return;
//     }
//
//     if (isUploading) return;
//     setIsUploading(true);
//
//     stopRecording(async (blob) => { // ← добавляем async здесь
//       if (!blob) {
//         console.error('Нет аудио данных');
//         setIsUploading(false);
//         return;
//       }
//
//       const tempUrl = URL.createObjectURL(blob);
//       setAudioUrl(tempUrl);
//       console.log('tempUrl', tempUrl);
//
//       waveSurferRef.current?.destroy()
//       waveSurferRef.current = null
//
//
//       // setTimeout(() => {
//       //   if (!waveformRef.current) return
//       //
//       //   waveSurferRef.current = WaveSurfer.create({
//       //     container: waveformRef.current,
//       //     waveColor: '#A0A0A0',
//       //     progressColor: '#4A90E2',
//       //     cursorColor: 'transparent',
//       //     height: 48,
//       //     barWidth: 2,
//       //   })
//       //
//       //   waveSurferRef.current.load(tempUrl)
//       // }, 0)
//
//       try {
//         // КОНВЕРТИРУЕМ В MP3
//         console.log('🔄 Конвертация WebM → MP3...');
//         const mp3Blob = await convertWebmToMp3(blob); // ← здесь конвертация
//         console.log('✅ Конвертация завершена:', {
//           original: { size: blob.size, type: blob.type },
//           converted: { size: mp3Blob.size, type: mp3Blob.type }
//         });
//
//         // Создаем File для отправки (MP3 вместо WAV)
//         // const audioFile = new File([mp3Blob], `voice-${Date.now()}.mp3`, { // ← меняем расширение
//         //   type: 'audio/mpeg' // ← меняем MIME-тип
//         // });
//         const audioFile = new File(
//           [mp3Blob],
//           `audio-${Date.now()}-mp3`,
//           { type: mp3Blob.type }
//         );
//
//         console.log('📤 Отправка MP3 файла:', audioFile);
//
//         // Проверяем размер файла
//         if (audioFile.size > 20 * 1024 * 1024) {
//           console.error('Файл слишком большой (макс. 20MB)');
//           URL.revokeObjectURL(tempUrl);
//           setAudioUrl(null);
//           setIsUploading(false);
//           return;
//         }
//
//         // Отправляем на сервер
//         uploadVoiceMessage({
//           roomId,
//           audio: audioFile // ← отправляем MP3 файл
//         })
//           .unwrap()
//           .then((result) => {
//             const token = localStorage.getItem('accessToken')
//             const socket = io('https://ulens.org/ws', { auth: { token }, })
//             console.log('response message: ', result)
//
//             socket.emit('SEND_MESSAGE', {
//               roomId,
//               content: 'VoiceMessage',
//               media:result
//             })
//
//             socket.disconnect()
//
//             setStartVoiceRecorder()
//
//             if (onUploadSuccess) {
//               onUploadSuccess(result)
//             }
//           })
//
//           .catch((err) => {
//             console.error('Ошибка загрузки:', err);
//             if (onUploadError) {
//               onUploadError(err);
//             }
//           })
//           .finally(() => {
//             if (tempUrl) {
//               URL.revokeObjectURL(tempUrl);
//               setAudioUrl(null);
//             }
//             setIsUploading(false);
//           });
//
//       } catch (conversionError) {
//         console.error('❌ Ошибка конвертации:', conversionError);
//         setIsUploading(false);
//       }
//     });
//   };
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   }
//
//   return (
//     <div className={s.voiceRecorder}>
//
//       <div>   <IconClose className={s.icon} onClick={() => {
//         stopRecording()
//         setStartVoiceRecorder()
//       }}/></div>
//
//
//       {recordingStatus === 'recording' ? (
//         <IconPauseCircle
//           className={s.icon}
//           onClick={pauseRecording} // ✅ ПАУЗА ЗАПИСИ
//         />
//       ) : recordingStatus === 'paused' ? (
//         <IconPlayCircle
//           className={s.icon}
//           onClick={resumeRecording} // ✅ ПРОДОЛЖИТЬ ЗАПИСЬ
//         />
//       ) : (
//         <IconPlayCircle
//           className={s.icon}
//           onClick={() => waveSurferRef.current?.playPause()} // ▶️ ПРОИГРЫВАНИЕ
//         />
//       )}
//
//       <div ref={waveformRef} className={s.waveform}/>
//
//       <span> {formatTime(recordingTime)}</span>
//
//       <Button
//         className={s.buttonSubmit}
//         type={'submit'}
//         variant={'text'}
//         size={'large'}
//         withoutPadding
//         onClick={handleStopAndUpload}
//       >
//         Send voice
//       </Button>
//     </div>
//   );
// }
// export default VoiceRecorder;


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
    pauseRecording,
    resumeRecording,
  } = useAudioRecorder();

  const [uploadVoiceMessage, { isLoading }] = useUploadVoiceMessageMutation();

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Refs для waveform
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

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

    return () => {
      waveSurferRef.current?.destroy();
      waveSurferRef.current = null;
    };
  }, [audioUrl]);

  const handleStopRecording = () => {
    console.log('Остановка записи...');

    stopRecording((blob) => {
      console.log('Запись остановлена, blob:', blob?.size);

      if (!blob || blob.size === 0) {
        console.error('Blob пустой или поврежден');
        return;
      }

      const tempUrl = URL.createObjectURL(blob);
      setAudioUrl(tempUrl);
      setRecordedBlob(blob);
    });
  };

  const handleSendRecording = async () => {
    if (!recordedBlob || isUploading || !roomId) {
      console.log('Не могу отправить:', { recordedBlob, isUploading, roomId });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Конвертация в MP3
      console.log('Конвертация аудио...');
      const mp3Blob = await convertWebmToMp3(recordedBlob);

      // 2. Проверка размера
      if (mp3Blob.size === 0) {
        throw new Error('Конвертированный файл пустой');
      }

      // 3. Создание файла
      const audioFile = new File(
        [mp3Blob],
        `voice-${Date.now()}.mp3`,
        { type: 'audio/mpeg' }
      );

      console.log('Отправка файла:', {
        size: audioFile.size,
        type: audioFile.type
      });
      // 4. Отправка на сервер
      const result = await uploadVoiceMessage({
        roomId,
        audio: audioFile
      }).unwrap();

      console.log('✅ Аудио загружено:', result);

      // 5. WebSocket отправка
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
      console.error('❌ Ошибка отправки:', error);
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
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
  };

  return (
    <div className={s.voiceRecorder}>
      {/* Кнопка закрытия */}
      <div>
        <IconClose
          className={s.icon}
          onClick={handleClose}
        />
      </div>

      {!recordedBlob ? (
        // РЕЖИМ ЗАПИСИ
        <>
          {recordingStatus === 'recording' ? (
            <IconPauseCircle
              className={s.icon}
              onClick={pauseRecording}
            />
          ) : recordingStatus === 'paused' ? (
            <IconPlayCircle
              className={s.icon}
              onClick={resumeRecording}
            />
          ) : (
            <IconPlayCircle
              className={s.icon}
              onClick={startRecording}
            />
          )}

          <div ref={waveformRef} className={s.waveform} />
          <span>{formatTime(recordingTime)}</span>

          <Button
            className={s.buttonSubmit}
            type="button"
            variant="text"
            size="large"
            withoutPadding
            onClick={handleStopRecording}
            disabled={recordingStatus === 'idle'}
          >
            Stop & Preview
          </Button>
        </>
      ) : (
        // РЕЖИМ ПРОСЛУШИВАНИЯ
        <>
          <IconPlayCircle
            className={s.icon}
            onClick={() => waveSurferRef.current?.playPause()}
          />

          <div ref={waveformRef} className={s.waveform} />

          <span>
            {waveSurferRef.current
              ? formatTime(Math.floor(waveSurferRef.current.getDuration()))
              : formatTime(recordingTime)
            }
          </span>

          <Button
            className={s.buttonSubmit}
            type="button"
            variant="text"
            size="large"
            withoutPadding
            onClick={handleSendRecording}
            disabled={isUploading}
          >
            {isUploading ? 'Sending...' : 'Send Voice'}
          </Button>
        </>
      )}
    </div>
  );
}

 export default VoiceRecorder;



//
// "use client"
// import { useState, useEffect, useRef } from "react";
// import { useAudioRecorder } from "react-use-audio-recorder";
// import { convertWebmToMp3 } from '@/src/entities/message/ui/voiceMessage/converterToMP3'
// import { useUploadVoiceMessageMutation } from '@/src/entities/messenger'
// import { IconPlayCircle, IconPauseCircle, IconClose } from '@rocketweb-studio/ulens-ui-kit'
// import { Button } from '@/src/shared/ui'
// import s from '@/src/entities/message/ui/voiceMessage/VoiceRecorder.module.scss'
// import { io } from 'socket.io-client'
// import WaveSurfer from 'wavesurfer.js'
//
// interface VoiceRecorderProps {
//   roomId: number;
//   onUploadSuccess?: (response: any) => void;
//   onUploadError?: (error: any) => void;
//   isRecording: boolean;
//   setStartVoiceRecorder: () => void;
// }
//
// export function VoiceRecorder({
//                                 roomId,
//                                 onUploadSuccess,
//                                 onUploadError,
//                                 isRecording,
//                                 setStartVoiceRecorder
//                               }: VoiceRecorderProps) {
//   const {
//     recordingStatus,
//     recordingTime,
//     startRecording,
//     stopRecording,
//     pauseRecording,
//     resumeRecording,
//   } = useAudioRecorder();
//
//   const [uploadVoiceMessage] = useUploadVoiceMessageMutation();
//
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
//
//   const mediaStreamRef = useRef<MediaStream | null>(null);
//   const waveformRef = useRef<HTMLDivElement | null>(null);
//   const waveSurferRef = useRef<WaveSurfer | null>(null);
//
//   // Эффект для инициализации записи
//   useEffect(() => {
//     if (!isRecording) return;
//
//     const initLiveWaveform = (stream: MediaStream) => {
//       if (!waveformRef.current) return;
//
//       // Очищаем предыдущий waveform
//       if (waveSurferRef.current) {
//         waveSurferRef.current.destroy();
//         waveSurferRef.current = null;
//       }
//
//       const audio = document.createElement('audio');
//       audio.srcObject = stream;
//       audio.muted = true;
//
//       waveSurferRef.current = WaveSurfer.create({
//         container: waveformRef.current,
//         waveColor: '#A0A0A0',
//         progressColor: '#4A90E2',
//         cursorColor: 'transparent',
//         height: 48,
//         barWidth: 2,
//         interact: false,
//         backend: 'MediaElement',
//         media: audio,
//       });
//
//       audio.play().catch(console.error);
//     };
//
//     const destroyWaveform = () => {
//       if (waveSurferRef.current) {
//         waveSurferRef.current.destroy();
//         waveSurferRef.current = null;
//       }
//     };
//
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then((stream) => {
//         mediaStreamRef.current = stream;
//         startRecording();
//         initLiveWaveform(stream);
//       })
//       .catch((error) => {
//         console.error('Ошибка доступа к микрофону:', error);
//       });
//
//     return () => {
//       stopRecording();
//       destroyWaveform();
//
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach(track => track.stop());
//         mediaStreamRef.current = null;
//       }
//     };
//   }, [isRecording]);
//
//   // Эффект для отображения записанного аудио
//   useEffect(() => {
//     if (!audioUrl || !waveformRef.current) return;
//
//     // Очищаем предыдущий waveform
//     if (waveSurferRef.current) {
//       waveSurferRef.current.destroy();
//     }
//
//     waveSurferRef.current = WaveSurfer.create({
//       container: waveformRef.current,
//       waveColor: '#A0A0A0',
//       progressColor: '#4A90E2',
//       cursorColor: 'transparent',
//       barWidth: 2,
//       height: 48,
//       interact: true,
//     });
//
//     waveSurferRef.current.load(audioUrl);
//
//     return () => {
//       if (waveSurferRef.current) {
//         waveSurferRef.current.destroy();
//         waveSurferRef.current = null;
//       }
//     };
//   }, [audioUrl]);
//
//   const handleStopAndUpload = () => {
//     if (roomId === null || roomId === undefined) {
//       console.error('Room ID не указан');
//       return;
//     }
//
//     if (isUploading) return;
//
//     stopRecording((blob) => {
//       if (!blob) {
//         console.error('Нет аудио данных');
//         return;
//       }
//
//       const tempUrl = URL.createObjectURL(blob);
//       setAudioUrl(tempUrl);
//       setRecordedBlob(blob);
//     });
//   };
//
//   const handleSendRecording = async () => {
//     if (!recordedBlob || isUploading) {
//       console.error('Нет записанного аудио или уже идет отправка');
//       return;
//     }
//
//     setIsUploading(true);
//
//     try {
//       console.log('🔄 Конвертация WebM → MP3...');
//       const mp3Blob = await convertWebmToMp3(recordedBlob);
//
//       console.log('✅ Конвертация завершена:', {
//         original: { size: recordedBlob.size, type: recordedBlob.type },
//         converted: { size: mp3Blob.size, type: mp3Blob.type }
//       });
//
//       const audioFile = new File([mp3Blob], `voice-${Date.now()}.mp3`, {
//         type: 'audio/mpeg'
//       });
//
//       // Проверяем размер файла
//       if (audioFile.size > 20 * 1024 * 1024) {
//         console.error('Файл слишком большой (макс. 20MB)');
//         throw new Error('File too large');
//       }
//
//       console.log('📤 Отправка MP3 файла:', {
//         fileName: audioFile.name,
//         fileType: audioFile.type,
//         fileSize: audioFile.size
//       });
//
//       const result = await uploadVoiceMessage({
//         roomId,
//         audio: audioFile
//       }).unwrap();
//
//       console.log('✅ Аудио загружено:', result);
//
//       // Отправка через WebSocket
//       const token = localStorage.getItem('accessToken');
//       if (token) {
//         const socket = io('https://ulens.org/ws', {
//           auth: { token },
//           transports: ['websocket']
//         });
//
//         socket.emit('SEND_MESSAGE', {
//           roomId,
//           content: 'VoiceMessage',
//           media: result
//         });
//
//         setTimeout(() => socket.disconnect(), 500);
//       }
//
//       if (onUploadSuccess) {
//         onUploadSuccess(result);
//       }
//
//       // Сброс состояния
//       handleClose();
//
//     } catch (error) {
//       console.error('❌ Ошибка:', error);
//       if (onUploadError) {
//         onUploadError(error);
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };
//
//   const handleClose = () => {
//     stopRecording();
//
//     // Очистка аудио URL
//     if (audioUrl) {
//       URL.revokeObjectURL(audioUrl);
//       setAudioUrl(null);
//     }
//
//     setRecordedBlob(null);
//
//     // Очистка медиа потока
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach(track => track.stop());
//       mediaStreamRef.current = null;
//     }
//
//     // Очистка waveform
//     if (waveSurferRef.current) {
//       waveSurferRef.current.destroy();
//       waveSurferRef.current = null;
//     }
//
//     // Закрытие рекордера
//     setStartVoiceRecorder();
//   };
//
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };
//
//   // Определяем текущий режим
//   const isPreviewMode = !!recordedBlob;
//
//   return (
//     <div className={s.voiceRecorder}>
//       {/* Кнопка закрытия */}
//       <IconClose
//         className={s.icon}
//         onClick={handleClose}
//       />
//
//       {/* Кнопка воспроизведения/паузы */}
//       {isPreviewMode ? (
//         <IconPlayCircle
//           className={s.icon}
//           onClick={() => waveSurferRef.current?.playPause()}
//         />
//       ) : recordingStatus === 'recording' ? (
//         <IconPauseCircle
//           className={s.icon}
//           onClick={pauseRecording}
//         />
//       ) : recordingStatus === 'paused' ? (
//         <IconPlayCircle
//           className={s.icon}
//           onClick={resumeRecording}
//         />
//       ) : (
//         <IconPlayCircle
//           className={s.icon}
//           onClick={startRecording}
//         />
//       )}
//
//       {/* Waveform */}
//       <div ref={waveformRef} className={s.waveform} />
//
//       {/* Таймер */}
//       <span>
//         {isPreviewMode && waveSurferRef.current
//           ? formatTime(Math.floor(waveSurferRef.current.getDuration() || 0))
//           : formatTime(recordingTime)
//         }
//       </span>
//
//       {/* Кнопка действия */}
//       {isPreviewMode ? (
//         <Button
//           className={s.buttonSubmit}
//           type="button"
//           variant="text"
//           size="large"
//           withoutPadding
//           onClick={handleSendRecording}
//           disabled={isUploading}
//         >
//           {isUploading ? 'Sending...' : 'Send Voice'}
//         </Button>
//       ) : (
//         <Button
//           className={s.buttonSubmit}
//           type="button"
//           variant="text"
//           size="large"
//           withoutPadding
//           onClick={handleStopAndUpload}
//           disabled={recordingStatus === 'idle'}
//         >
//           Stop & Preview
//         </Button>
//       )}
//     </div>
//   );
// }
//
// export default VoiceRecorder;
