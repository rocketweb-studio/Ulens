"use client"

import { ToastContainer } from "react-toastify"

import React from "react"

export const AlertSnackbar = () => {
  return <ToastContainer position="bottom-right" autoClose={2000} closeOnClick pauseOnHover theme="light" />
}
