'use client'

import { MouseEvent, useRef } from 'react'
import { Modal } from '@/src/shared/ui/Modal/Modal'
import { Button } from '@/src/shared/ui/Button/Button'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'
import { FilterPanel } from '@/src/features/post/postCreate/ui/FilterPanel/FilterPanel'
import s from '@/src/widgets/ViewPostModal/ui/ViewPostModal.module.scss'
import { FilteredImage, UploadedFile } from '@/src/features/post/postCreate/model/types'

type Props = {
  isModalOpen: boolean
  onModalClose: () => void
  onOverlayClick: () => void
  changeNextStep: () => void
  changePrevStep: () => void
  uploadedFiles: UploadedFile[]
  currentImage: UploadedFile | undefined
  setUploadedFiles: (files: UploadedFile[]) => void
}

export const FilterStep = ({
  isModalOpen,
  onModalClose,
  onOverlayClick,
  changeNextStep,
  changePrevStep,
  uploadedFiles,
  currentImage,
  setUploadedFiles,
}: Props) => {
  const filterPanelRef = useRef<{ applyFilter: () => void }>(null)

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOverlayClick()
    }
  }

  const handleFilterApply = (filteredData: FilteredImage, indexActiveSlide: number) => {
    const updatedFiles = uploadedFiles.map((file, index) =>
      index === indexActiveSlide ?
        {
          ...file,
          filteredImage: filteredData,
          filter: `${filteredData.filter}-${filteredData.intensity}`,
        }
      : file,
    )
    setUploadedFiles(updatedFiles)
  }

  const handleNextStep = async () => {
    if (filterPanelRef.current) {
      await filterPanelRef.current.applyFilter()
    }
    changeNextStep()
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onModalClose}
      className={`${s.modal} ${s.viewPostModal}`}
      onOverlayClick={handleOverlayClick}
      modalTitle={'Filters'}
      hideCloseButton
      hideDefaultButton
      withoutPadding
      buttonRightInModalHeader={
        <Button tagType={'button'} variant={'text'} withoutPadding onClick={handleNextStep}>
          Next
        </Button>
      }
      buttonLeftInModalHeader={
        <Button tagType={'button'} variant={'text'} withoutPadding onClick={changePrevStep}>
          <IconArrowIosBackOutline />
        </Button>
      }
    >
      <FilterPanel
        ref={filterPanelRef}
        onFilterApply={handleFilterApply}
        currentFilter={currentImage?.filter?.split('-')[0]}
        uploadedFiles={uploadedFiles}
      />
    </Modal>
  )
}
