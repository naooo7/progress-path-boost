/**
 * Local data contracts intentionally mirror the shape a future API/database can
 * return. UI components consume these collections rather than owning question
 * content or exam taxonomy.
 */
export type ExamId = "skd" | "utbk" | "psikotes" | "tpa" | "tbi";
export type QuestionType = "single-choice" | "personality";

export type Exam = {
  id: ExamId;
  name: string;
  fullName: string;
  available: boolean;
};

export type Subtest = {
  id: string;
  examId: ExamId;
  name: string;
  fullName: string;
  count: number;
  mastery: number;
};

export type Material = {
  id: string;
  examId: ExamId;
  subtestId: string;
  name: string;
  questions: number;
  mastery: number;
};

export type Question = {
  id: string;
  examId: ExamId;
  subtestId: string;
  materialId: string;
  questionType: QuestionType;
  prompt: string;
  options: string[];
  answer?: number;
  explanation?: string;
  estimatedSeconds: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
};

export const allExams: Exam[] = [
  { id: "skd", name: "SKD", fullName: "Seleksi Kompetensi Dasar", available: true },
  { id: "utbk", name: "UTBK", fullName: "Ujian Tulis Berbasis Komputer", available: false },
  { id: "psikotes", name: "Psikotes", fullName: "Tes Psikologi", available: false },
  { id: "tpa", name: "TPA", fullName: "Tes Potensi Akademik", available: false },
  { id: "tbi", name: "TBI", fullName: "Tes Bahasa Inggris", available: false },
];

// Keep the original Learn overview focused while the additional catalogs are prepared.
export const exams = allExams.slice(0, 2);

const subtestDefinitions: Array<[string, string, string, number]> = [
  ["twk", "TWK", "Tes Wawasan Kebangsaan", 5],
  ["tiu", "TIU", "Tes Intelegensia Umum", 10],
  ["tkp", "TKP", "Tes Karakteristik Pribadi", 6],
];

export const subtests: Subtest[] = subtestDefinitions.map(([id, name, fullName, count]) => ({
  id,
  name,
  fullName,
  count,
  mastery: { twk: 64, tiu: 72, tkp: 81 }[id] ?? 0,
  examId: "skd",
}));

const materialDefinitions: Record<string, string[]> = {
  twk: ["Nasionalisme", "Integritas", "Bela Negara", "Pilar Negara", "Bahasa Negara"],
  tiu: ["Verbal Analogi", "Verbal Silogisme", "Verbal Analitis", "Numerik Berhitung", "Numerik Deret Angka", "Numerik Perbandingan Kuantitatif", "Numerik Soal Cerita", "Figural Analogi", "Figural Ketidaksamaan", "Figural Serial"],
  tkp: ["Pelayanan Publik", "Jejaring Kerja", "Sosial Budaya", "Teknologi Informasi dan Komunikasi", "Profesionalisme", "Anti Radikalisme"],
};

const questionCounts = [36, 28, 32, 42, 38, 24, 34, 26, 22, 30];
const masteryValues = [78, 66, 70, 72, 61, 75, 69, 80, 74, 68];

export const materials: Material[] = Object.entries(materialDefinitions).flatMap(([subtestId, names]) =>
  names.map((name, index) => ({
    id: `${subtestId}-${index + 1}`,
    examId: "skd" as const,
    subtestId,
    name,
    questions: subtestId === "tiu" ? questionCounts[index] ?? 30 : 20 + index * 3,
    mastery: subtestId === "tiu" ? masteryValues[index] ?? 70 : 60 + index * 4,
  })),
);

export const tiuMaterials = materials.filter((material) => material.subtestId === "tiu");

export const skdTaxonomy = materialDefinitions;

export const utbkSubtests = ["PU", "PPU", "PBM", "PK", "LBI", "LBE", "PM"].map((name) => ({
  id: name.toLowerCase(),
  examId: "utbk" as const,
  name,
  fullName: name,
  count: 0,
  mastery: 0,
}));

export const additionalExamTaxonomy: Record<Exclude<ExamId, "skd" | "utbk">, string[]> = {
  psikotes: ["Verbal", "Numerik", "Logika", "Analogi", "Deret", "Ketelitian", "Spasial/Figural", "Kepribadian"],
  tpa: ["Verbal", "Numerik", "Logika", "Figural/Spasial"],
  tbi: [],
};

export const questions: Question[] = [
  { id: "q1", examId: "skd", subtestId: "tiu", materialId: "tiu-4", questionType: "single-choice", prompt: "Jika 25% dari suatu bilangan adalah 40, maka bilangan tersebut adalah...", options: ["100", "120", "140", "160", "180"], answer: 3, explanation: "25% sama dengan ¼. Jika ¼ dari bilangan adalah 40, maka bilangannya 40 × 4 = 160.", estimatedSeconds: 45, difficulty: "easy", tags: ["persentase"] },
  { id: "q2", examId: "skd", subtestId: "tiu", materialId: "tiu-4", questionType: "single-choice", prompt: "Hasil dari 48 ÷ 6 × 3 + 7 adalah...", options: ["24", "29", "31", "35", "38"], answer: 2, explanation: "Kerjakan pembagian dan perkalian dari kiri: 48 ÷ 6 = 8, lalu 8 × 3 = 24. Tambahkan 7 sehingga hasilnya 31.", estimatedSeconds: 50, difficulty: "easy", tags: ["operasi hitung"] },
  { id: "q3", examId: "skd", subtestId: "tiu", materialId: "tiu-4", questionType: "single-choice", prompt: "Sebuah barang seharga Rp240.000 mendapat diskon 15%. Harga setelah diskon adalah...", options: ["Rp196.000", "Rp200.000", "Rp204.000", "Rp210.000", "Rp216.000"], answer: 2, explanation: "Diskon 15% dari Rp240.000 adalah Rp36.000. Jadi harga akhirnya Rp204.000.", estimatedSeconds: 55, difficulty: "medium", tags: ["persentase", "soal cerita"] },
];

export const attempts = [
  { id: "a1", questionId: "q1", correct: true, seconds: 42 },
  { id: "a2", questionId: "q2", correct: false, seconds: 58 },
];
export const progress = { accuracy: 76, questions: 184, studyMinutes: 312, currentStreak: 7, longestStreak: 14, weeklyAccuracy: [62, 68, 65, 74, 71, 79, 76] };
export const reviewItems = [{ materialId: "tiu-4", count: 7 }, { materialId: "tiu-1", count: 5 }];
export const streak = { days: 7, activeDates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] };

export const materialById = (id: string) => materials.find((item) => item.id === id);
export const questionsForMaterial = (materialId: string) => questions.filter((question) => question.materialId === materialId);