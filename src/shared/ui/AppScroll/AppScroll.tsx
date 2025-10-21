'use client'

import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

export const AppScroll = ({ children }: { children: React.ReactNode }) => {
  return <Scrollbars height={'100%'}>{children}</Scrollbars>
}
