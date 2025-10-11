"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} from "@/src/entities/userProfile/api/userProfileApi";
import { Button } from "@/src/shared/ui/Button/Button";
import { toast } from "react-toastify";

import s from "./UserAvatarUploader.module.scss";
import { useGetMeQuery } from "@/src/entities/auth/api/authApi";
import { Modal } from "@/src/shared/ui/Modal/Modal";

interface Props {
  avatars?: {
    url: string;
    width: number;
    height: number;
    fileSize: number;
    size: string;
    createdAt: string;
  }[];
}

export const AvatarUploader = ({ avatars }: Props) => {
  // 🔹 Получаем текущего пользователя
  const { data: me } = useGetMeQuery();
  const userId = me?.id ?? ""; // безопасно, если пользователь ещё не подгрузился

  // 🔹 Хуки для загрузки и удаления
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation();

  // 🔹 Состояния
  const avatarUrl = avatars && avatars.length > 0 ? avatars[0].url : null;
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Открыть окно выбора файла
  const handleSelect = () => fileInputRef.current?.click();

  // 🔹 Валидация и предпросмотр
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const isValidFormat = ["image/jpeg", "image/png"].includes(
      selectedFile.type,
    );
    const isValidSize = selectedFile.size <= 10 * 1024 * 1024; // 10MB

    if (!isValidFormat || !isValidSize) {
      toast.error(
        "The photo must be less than 10 Mb and have JPEG or PNG format",
      );
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setIsModalOpen(true);
  };

  // 🔹 Загрузка файла
  const handleUpload = async () => {
    if (!file || !userId) return;

    try {
      await uploadAvatar({ file, userId }).unwrap();
      toast.success("Photo uploaded successfully!");
      setIsModalOpen(false);
      setFile(null);
    } catch {
      toast.error("Upload failed");
    }
  };

  // 🔹 Удаление аватара
  const handleDelete = async () => {
    if (!userId) return;
    if (!confirm("Do you really want to delete your profile photo?")) return;

    try {
      await deleteAvatar({ userId }).unwrap();
      setPreview(null);
      setFile(null);
      toast.success("Photo deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // 🔹 Если пользователь ещё не подгрузился
  if (!me) return null;

  return (
    <div className={s.avatarUploader}>
      <div className={s.previewContainer}>
        {preview ? (
          <>
            <Image
              src={
                preview.startsWith("blob:")
                  ? preview
                  : `${process.env.NEXT_PUBLIC_BASE_URL}${preview}`
              }
              alt="Avatar preview"
              width={192}
              height={192}
              className={s.avatar}
            />
            <button
              type="button"
              onClick={handleDelete}
              className={s.deleteBtn}
              disabled={isDeleting}
            >
              ×
            </button>
          </>
        ) : (
          <div className={s.placeholder}>No photo</div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        hidden
        onChange={handleFileChange}
      />

      <div className={s.buttons}>
        <Button type="button" onClick={handleSelect} disabled={isUploading}>
          Select from Computer
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle="Add a Profile Photo"
        className={s.photoModal}
        hideDefaultButton
      >
        <div className={s.modalContent}>
          {preview && (
            <div className={s.imageWrapper}>
              <Image
                src={preview}
                alt="Avatar preview"
                width={300}
                height={300}
                className={s.roundImage}
              />
            </div>
          )}

          <div className={s.modalActions}>
            {file && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
