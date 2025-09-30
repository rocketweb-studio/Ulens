export type FilterPanelHandle = {
  applyFilter: () => void
}

export type Filter = {
  name: string
  value: string
  cssFilter: string
  preview: string
}

export type ImageFilters = {
  [imageIndex: number]: string
}
