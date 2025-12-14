import { PostDraft, Steps, UploadedFile } from '../model/types'

const DB_NAME = 'PostDraftsDB'
const DB_VERSION = 1
const STORE_NAME = 'drafts'

let dbInstance: IDBDatabase | null = null

function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance)
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('Failed to open database'))
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        objectStore.createIndex('updatedAt', 'updatedAt', { unique: false })
      }
    }
  })
}

export async function saveDraft(
  step: Steps,
  uploadedFiles: UploadedFile[],
  currentImageIndex: number,
  description: string,
): Promise<void> {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    // Сначала получаем существующий черновик в той же транзакции
    const existingDraft = await new Promise<PostDraft | null>((resolve, reject) => {
      const getRequest = store.get('current-draft')
      getRequest.onsuccess = () => {
        resolve(getRequest.result || null)
      }
      getRequest.onerror = () => {
        reject(new Error('Failed to get existing draft'))
      }
    })

    const draft: PostDraft = {
      id: 'current-draft',
      step,
      uploadedFiles,
      currentImageIndex,
      description,
      createdAt: existingDraft?.createdAt || Date.now(),
      updatedAt: Date.now(),
    }

    // Сохраняем черновик в той же транзакции
    await new Promise<void>((resolve, reject) => {
      const putRequest = store.put(draft)
      putRequest.onsuccess = () => resolve()
      putRequest.onerror = () => reject(new Error('Failed to save draft'))
    })
  } catch (error) {
    console.error('Error saving draft:', error)
    throw error
  }
}

export async function getDraft(): Promise<PostDraft | null> {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise<PostDraft | null>((resolve, reject) => {
      const request = store.get('current-draft')
      request.onsuccess = () => {
        resolve(request.result || null)
      }
      request.onerror = () => {
        reject(new Error('Failed to get draft'))
      }
    })
  } catch (error) {
    console.error('Error getting draft:', error)
    return null
  }
}

export async function deleteDraft(): Promise<void> {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    await new Promise<void>((resolve, reject) => {
      const request = store.delete('current-draft')
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to delete draft'))
    })
  } catch (error) {
    console.error('Error deleting draft:', error)
    throw error
  }
}

export async function hasDraft(): Promise<boolean> {
  const draft = await getDraft()
  return draft !== null
}

