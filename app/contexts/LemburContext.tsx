"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface LemburItem {
  id: number;
  nama: string;
  jabatan: string;
  periode: string;
  tanggal: string;
  hari: string;
  jam: string;
  jamArray?: number[];
  durasi: string;
  keterangan: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

interface LemburContextType {
  submissions: LemburItem[];
  addSubmission: (item: Omit<LemburItem, "id" | "status" | "createdAt">) => void;
  approveSubmission: (id: number) => void;
  rejectSubmission: (id: number) => void;
  getSubmissionsByStatus: (status: string) => LemburItem[];
  getSubmissionsByUser: (nama: string) => LemburItem[];
}

const LemburContext = createContext<LemburContextType | undefined>(undefined);

export function LemburProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<LemburItem[]>([
    {
      id: 1,
      nama: "ABDUL AZIS",
      jabatan: "DRIVER",
      periode: "Januari 2026",
      tanggal: "2026-01-24",
      hari: "Sabtu",
      jam: "17:00-21:00",
      jamArray: [17, 18, 19, 20],
      durasi: "4 Jam",
      keterangan: "JEMPUT BU Austri dan Bu AMBAR",
      status: "Pending",
      createdAt: new Date().toISOString(),
    },
  ]);

  const addSubmission = (item: Omit<LemburItem, "id" | "status" | "createdAt">) => {
    const newSubmission: LemburItem = {
      ...item,
      id: submissions.length + 1,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    setSubmissions([...submissions, newSubmission]);
  };

  const approveSubmission = (id: number) => {
    setSubmissions(submissions.map((s) => (s.id === id ? { ...s, status: "Approved" as const } : s)));
  };

  const rejectSubmission = (id: number) => {
    setSubmissions(submissions.map((s) => (s.id === id ? { ...s, status: "Rejected" as const } : s)));
  };

  const getSubmissionsByStatus = (status: string) => {
    return submissions.filter((s) => s.status === status);
  };

  const getSubmissionsByUser = (nama: string) => {
    return submissions.filter((s) => s.nama.toUpperCase() === nama.toUpperCase());
  };

  return <LemburContext.Provider value={{ submissions, addSubmission, approveSubmission, rejectSubmission, getSubmissionsByStatus, getSubmissionsByUser }}>{children}</LemburContext.Provider>;
}

export function useLembur() {
  const context = useContext(LemburContext);
  if (!context) {
    throw new Error("useLembur must be used within LemburProvider");
  }
  return context;
}
