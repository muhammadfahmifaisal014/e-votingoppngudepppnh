import { UserRole } from '../types';

export interface VerificationResponse {
  valid: boolean;
  message: string;
  studentName?: string;
  studentClass?: string;
  role?: UserRole;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
}

// Placeholder URL - User must update this after deploying their Google Apps Script
// Placeholder URL - User must update this after deploying their Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5wnsCzRHXmtjGP6lTBT3LsQi_K4CxXx5BY4F5LbwjGUA1fifxJD8FooD2pP9b8qh5Tw/exec";

export const verifyToken = async (token: string): Promise<VerificationResponse> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("GOOGLE_SCRIPT_URL is not set. Using mock verification.");
    return new Promise(resolve => {
      setTimeout(() => {
        if (token.length >= 5) {
          let role: UserRole = 'PUTRA';
          if (token.toUpperCase().startsWith('GURU')) role = 'GURU';
          else if (token.toUpperCase().startsWith('PUTRI')) role = 'PUTRI';

          resolve({
            valid: true,
            message: "Token Valid",
            studentName: "Siswa Demo",
            studentClass: "12 IPA",
            role: role
          });
        }
        else resolve({ valid: false, message: "Token tidak ditemukan" });
      }, 1500);
    });
  }

  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=verify&token=${encodeURIComponent(token)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Verification Error:", error);
    return { valid: false, message: "Terjadi kesalahan koneksi" };
  }
};

export const submitVote = async (token: string, votes: Record<string, string>): Promise<SubmissionResponse> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("GOOGLE_SCRIPT_URL is not set. Using mock submission.");
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: "Suara berhasil disimpan (Mode Demo)" }), 2000));
  }

  try {
    // We use sendBeacon or POST with 'no-cors' if purely distinct, but GAS usually requires CORS handling in the script
    // Standard approach for GAS JSON API:
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // GAS weirdness hack
      body: JSON.stringify({ action: "vote", token, votes }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: false, message: "Gagal mengirim suara" };
  }
};

export interface ResultsResponse {
  success: boolean;
  results: Record<string, number>;
  totalVotes: number;
}

export const getResults = async (): Promise<ResultsResponse> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("GOOGLE_SCRIPT_URL is not set. Using mock results.");
    // Return mock data if no URL
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      results: { '01': 10, '02': 20, '03': 15 },
      totalVotes: 45
    }), 1000));
  }

  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=results`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Results Fetch Error:", error);
    return { success: false, results: {}, totalVotes: 0 };
  }
};
