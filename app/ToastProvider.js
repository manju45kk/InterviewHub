"use client";
import { useEffect, useState } from "react";
import { toastBus } from "../utils";
import Toast from "../components/Toast";

export default function ToastProvider() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsubscribe = toastBus.subscribe(setToast);
    return unsubscribe;
  }, []);

  if (!toast) return null;

  return (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  );
}
