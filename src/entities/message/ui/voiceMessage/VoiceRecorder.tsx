"use client"
import { useState,useEffect } from "react";
import { useAudioRecorder } from "react-use-audio-recorder";
import { convertWebmToMp3 } from '@/src/entities/message/ui/voiceMessage/converterToMP3'
import { useUploadVoiceMessageMutation } from '@/src/entities/messenger'
import {IconPlayCircle,IconPauseCircle,IconClose} from '@rocketweb-studio/ulens-ui-kit'
import { Button } from '@/src/shared/ui'
import s from '@/src/entities/message/ui/voiceMessage/VoiceRecorder.module.scss'
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
  useEffect(() => {
    startRecording()
    return () => stopRecording()
  }, [isRecording])
  // useEffect(() => {
  //   return () => {
  //     // Очистка при размонтировании компонента
  //     if (audioUrl) {
  //       URL.revokeObjectURL(audioUrl);
  //     }
  //   };
  // }, [audioUrl]);
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
                // Вызываем колбэк при успехе
                console.log('result',result);
                setStartVoiceRecorder()
                if (onUploadSuccess && result) {
                  onUploadSuccess(result);
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

            // Fallback: отправляем оригинальный файл если конвертация не удалась
            console.log('🔄 Fallback: отправка оригинального файла...');
            // ... код для отправки оригинального blob
            }
        });
      };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  // Комбинированное состояние загрузки
  // const isButtonDisabled = isLoading || isUploading;

  return (
    <div className={s.voiceRecorder}>
      {/*<div className="recorder-status">*/}
        {/*<div className="status-indicator">*/}
        {/*  Статус: <strong>*/}
        {/*  {recordingStatus === 'recording' ? 'Запись' :*/}
        {/*    recordingStatus === 'paused' ? 'На паузе' :*/}
        {/*      recordingStatus === 'stopped' ? 'Остановлено' : 'Готово'}*/}
        {/*</strong>*/}
        {/*</div>*/}

      {/*</div>*/}


          <IconClose className={s.icon} onClick={() => stopRecording()}/>
        {/*<button*/}
        {/*  className={s.btn}*/}
        {/*  onClick={() => recordingStatus === 'recording' ? pauseRecording() : resumeRecording()}*/}
        {/*>*/}
          {/*{recordingStatus === 'recording' ? 'Запись' :*/}
          {/*  recordingStatus === 'paused' ? 'На паузе' :*/}
          {/*    // recordingStatus === 'stopped' ? 'Остановлено' : 'Готово'}*/}
          {recordingStatus === 'recording' ?
            <IconPauseCircle className={s.icon} onClick={()=>pauseRecording()} />
            : <IconPlayCircle className={s.icon} onClick={()=>resumeRecording()} />}
        {/*</button>*/}
      <span>TYT BUDET WAVEFORM</span>
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


      {/* Предпрослушивание аудио */}
      {/*{audioUrl && recordingStatus === "stopped" && !isButtonDisabled && (*/}
      {/*  <div className="audio-preview">*/}
      {/*    <p>Предпросмотр записи:</p>*/}
      {/*    <audio controls src={audioUrl} />*/}
      {/*    <small>Временный файл, будет удален после отправки</small>*/}
      {/*  </div>*/}
      {/*)}*/}

      {/* Отладочная информация (можно убрать в production) */}
      {/*<div className="debug-info" style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>*/}
      {/*  Room ID: {roomId} | Status: {recordingStatus} |*/}
      {/*  Uploading: {isUploading ? 'Yes' : 'No'} |*/}
      {/*  Loading: {isLoading ? 'Yes' : 'No'}*/}
      {/*</div>*/}
    </div>
  );
}
//export default VoiceRecorder;
