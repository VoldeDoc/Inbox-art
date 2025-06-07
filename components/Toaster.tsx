"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useTheme } from "next-themes";
import { CheckCircle, Loader2, TriangleAlert } from "lucide-react";

const ToasterComponent = () => {
  const [isDarkMode, setIsDarkMode] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) setIsDarkMode(theme);
  }, [isDarkMode, theme]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Bounce}
      theme={isDarkMode ?? "light"}
      draggablePercent={40}
      stacked
    />
  );
};

export const successToast = (message: string) => {
  toast.success(message, {
    icon: <CheckCircle />,
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    icon: <TriangleAlert />,
    autoClose: 7000,
  });
};

export const loadingToast = (message: string) => {
  toast.loading(message, {
    icon: <Loader2 className="animate-spin" />,
  });
};

export default ToasterComponent;
