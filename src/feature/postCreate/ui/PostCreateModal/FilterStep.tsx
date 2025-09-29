import { MouseEvent, useRef } from 'react'
import { Modal } from '@/src/shared/components/Modal/Modal'
import { Button } from '@/src/shared/components/Button/Button'
import { IconArrowIosBackOutline } from '@rocketweb-studio/ulens-ui-kit'
import { FilterPanel } from '@/src/shared/components/FilterPanel/FilterPanel'
import { UploadedFile, FilteredImage } from '@/src/feature/postCreate/types/types'
import s from './PostCreateModal.module.scss'

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
