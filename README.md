# CASEFILE

**Tugas Rutin 6 — Interactive Quiz App (reskin bertema investigasi kasus)**  
Pemrograman Web (3KOM40115) · FMIPA Universitas Negeri Medan · Semester Ganjil 2026/2027  
Dosen Pengampu: Adidtya Perdana, S.T., M.Kom

|       |                    |
| ----- | ------------------ |
| Nama  | Fatih Taqiyyuddin  |
| NIM   | *4253250057*       |
| Kelas | *PSIK 25B*         |

Website Live: [casefile.moreyartea.workers.dev](https://casefile.moreyartea.workers.dev)

---

## Tentang Proyek

CASEFILE adalah **Interactive Quiz App** untuk Tugas Rutin 6, dibungkus sebagai pengalaman investigasi kasus detektif. Pemain memilih kasus, membaca briefing, membuka evidence, menjawab **5 pertanyaan pilihan ganda pada setiap investigasi**, menentukan tersangka, lalu memperoleh skor otomatis.

Konsep investigasi digunakan sebagai reskin dari quiz konvensional. Mekanik utama tugas tetap diterapkan secara langsung melalui manipulasi DOM, event delegation, automatic scoring, LocalStorage, dan navigasi SPA tanpa reload. Dengan 8 kasus dan 5 pertanyaan pada setiap kasus, CASEFILE menyediakan **40 pertanyaan pilihan ganda** secara keseluruhan.

---

## Pemetaan Requirement → Fitur

| Requirement Tugas Rutin 6 | Implementasi di CASEFILE | Lokasi kode |
| --- | --- | --- |
| Minimal 5 pertanyaan pilihan ganda | Setiap dari 8 kasus memiliki 5 deduction questions, sehingga tersedia 40 pertanyaan pilihan ganda | `src/infrastructure/data/cases.json`, `src/features/investigation/investigation.view.js` |
| Render soal dengan `createElement` / `textContent` | Evidence card, deduction question, pilihan jawaban, suspect card, result, history, modal, dan footer dirender menggunakan DOM API dengan `createElement` dan `textContent` | `src/features/investigation/investigation.view.js`, `src/features/cases/case.view.js`, `src/features/scoring/scoring.view.js`, `src/features/history/history.view.js`, `src/shared/ui/` |
| Event delegation untuk pilihan jawaban | Interaksi evidence, deduction, suspect, dan pemilihan kasus ditangani melalui event delegation dengan `event.target.closest(...)` pada container terkait | `src/features/investigation/investigation.view.js`, `src/features/cases/case.view.js` |
| Skor otomatis di akhir quiz | Skor dihitung otomatis dari evidence, deduction accuracy, suspect decision, dan time bonus dengan total maksimum 100 | `src/features/scoring/scoring.engine.js`, `src/features/scoring/scoring.rules.js` |
| High score tersimpan di LocalStorage | Skor tertinggi disimpan menggunakan LocalStorage dan tetap tersedia setelah refresh browser | `src/infrastructure/storage/local-storage.adapter.js`, `src/features/history/history.repository.js` |
| Navigasi tanpa reload halaman (SPA pattern) | Router custom menggunakan `history.pushState` dan `popstate`; perpindahan halaman dilakukan tanpa full page reload | `src/app/router.js`, `src/app/bootstrap.js` |
| Feedback visual benar/salah | Jawaban benar diberi status hijau dan jawaban salah diberi status merah melalui class feedback dan CSS variables | `src/features/investigation/investigation.view.js`, `src/styles/components.css` |
| Tombol restart | Halaman result menyediakan tombol `↻ Ulangi Investigasi` untuk mengulang kasus yang sama dari briefing | `src/features/scoring/scoring.view.js` |

### Fitur bonus yang diimplementasikan

| Bonus | Status | Implementasi |
| --- | --- | --- |
| Timer | ✅ | Timer mengambang selama sesi investigasi dan tetap menggunakan waktu yang sama saat berpindah Investigation, Deduction, dan Feedback |
| Progress bar visual | ✅ | Progress evidence dan progress pertanyaan ditampilkan secara visual; deduction menggunakan indikator `QUESTION 01 / 05` dan progress bar |
| Kategori soal | ✅ | Setiap kasus memiliki kategori dan metadata kasus ditampilkan pada database serta briefing |
| Animasi transisi antar soal | ✅ | Halaman pertanyaan dan feedback menggunakan animasi masuk singkat saat berpindah state quiz |
| Dark mode toggle | ✅ | Toggle Dark/Light tersedia di navbar dan preferensi tema disimpan di LocalStorage |

---

## Alur Quiz

```text
LANDING
   ↓
HOW TO PLAY
   ↓
CASE DATABASE
   ↓
BRIEFING
   ↓
INVESTIGATION
   ↓
EVIDENCE
   ↓
DEDUCTION QUIZ
   ├── QUESTION 01 / 05
   ├── QUESTION 02 / 05
   ├── QUESTION 03 / 05
   ├── QUESTION 04 / 05
   └── QUESTION 05 / 05
   ↓
SUSPECT DECISION
   ↓
QUIZ RESULT
   ↓
HIGH SCORE / HISTORY
```

Popup **How to Play** muncul saat pengguna pertama kali menekan `Mulai Investigasi` dari landing page. Setelah panduan pertama diselesaikan, pengguna dapat membuka panduan kembali melalui tombol `How to Play` pada navbar atau landing page.

---

## Sistem Penilaian

CASEFILE menggunakan skor maksimum 100 poin:

| Komponen | Maksimum |
| --- | ---: |
| Evidence | 25 |
| Deduction Quiz | 40 |
| Suspect | 20 |
| Time | 15 |
| **Total** | **100** |

Deduction Quiz memiliki 5 pertanyaan per kasus. Nilai deduction ditentukan dari akurasi jawaban deduction. Suspect merupakan keputusan terpisah dan tidak dimasukkan ke perhitungan accuracy.

### Rank

| Score | Rank |
| ---: | :---: |
| 90–100 | S |
| 80–89 | A |
| 70–79 | B |
| 60–69 | C |
| < 60 | D |

---

## Fitur Utama

- 8 kasus investigasi berbeda.
- 40 pertanyaan pilihan ganda, 5 pertanyaan pada setiap kasus.
- Evidence dengan sistem penguncian bertahap berdasarkan deduction yang telah diselesaikan.
- Deduction Quiz dengan feedback benar/salah.
- Suspect selection berdasarkan keseluruhan evidence dan deduction.
- Skor otomatis dengan komponen Evidence, Deduction, Suspect, dan Time.
- High Score permanen menggunakan LocalStorage.
- History hasil investigasi menggunakan LocalStorage dengan maksimum 50 catatan terbaru.
- Session investigasi menggunakan sessionStorage agar state aktif dapat dipulihkan setelah refresh.
- Timer mengambang yang tidak mengganggu layout dan tidak reset saat berpindah fase.
- Progress evidence dan progress pertanyaan.
- Kategori, difficulty, lokasi, dan estimated time untuk setiap kasus.
- Dark mode dan light mode dengan penyimpanan preferensi tema.
- Popup How to Play dan About.
- Navigasi Home/Landing, Kasus, History, dan About melalui SPA router.
- Footer dengan shortcut ke profil GitHub.
- Restart investigasi dari halaman hasil.

---

## Implementasi Requirement Teknis

### DOM Manipulation

CASEFILE menggunakan DOM API native untuk membuat dan memperbarui elemen secara dinamis. Data kasus, evidence, pertanyaan, pilihan jawaban, suspect, hasil, history, footer, dan popup dibuat menggunakan `document.createElement`, kemudian teks dinamis dimasukkan menggunakan `textContent`.

### Event Delegation

Interaksi utama pada daftar kasus, evidence, deduction, dan suspect menggunakan event delegation. Container menangani event klik dan elemen aktual dicari melalui `event.target.closest(...)`. Pendekatan ini menghindari pembuatan listener individual untuk setiap pilihan yang dirender.

### Automatic Scoring

Setelah seluruh deduction selesai dan suspect dipilih, investigation engine berpindah ke result. Scoring engine menghitung nilai secara otomatis berdasarkan state investigasi dan data kasus.

### LocalStorage

LocalStorage digunakan untuk data yang harus tetap tersedia setelah refresh, yaitu:

- History investigasi.
- High Score.
- Preferensi Dark/Light Mode.
- Status bahwa panduan How to Play pertama kali sudah pernah ditampilkan.

### Session Storage

sessionStorage digunakan untuk menyimpan state investigasi aktif. Data ini memungkinkan pengguna melakukan refresh ketika berada dalam investigasi tanpa kehilangan progress yang sedang berjalan.

### SPA Navigation

Router menggunakan `history.pushState` untuk navigasi internal dan `popstate` untuk menangani tombol Back/Forward browser. Aplikasi tidak melakukan full page reload ketika berpindah halaman internal.

---

## Struktur Proyek

```text
CASEFILE/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
├── public/
│   ├── favicon.svg
│   └── images/
│       └── cases/
│           ├── case-001.png
│           ├── case-002.png
│           ├── case-003.png
│           ├── case-004.png
│           ├── case-005.png
│           ├── case-006.png
│           ├── case-007.png
│           └── case-008.png
└── src/
    ├── app/
    │   ├── app-state.js
    │   ├── bootstrap.js
    │   └── router.js
    ├── features/
    │   ├── cases/
    │   │   ├── case.model.js
    │   │   ├── case.repository.js
    │   │   ├── case.service.js
    │   │   └── case.view.js
    │   ├── history/
    │   │   ├── history.repository.js
    │   │   ├── history.service.js
    │   │   └── history.view.js
    │   ├── investigation/
    │   │   ├── investigation.engine.js
    │   │   ├── investigation.rules.js
    │   │   ├── investigation.state.js
    │   │   └── investigation.view.js
    │   ├── landing/
    │   │   └── landing.view.js
    │   ├── scoring/
    │   │   ├── scoring.engine.js
    │   │   ├── scoring.rules.js
    │   │   └── scoring.view.js
    │   └── settings/
    │       ├── settings.repository.js
    │       └── theme.service.js
    ├── infrastructure/
    │   ├── audio/
    │   ├── data/
    │   │   └── cases.json
    │   └── storage/
    │       ├── local-storage.adapter.js
    │       ├── session-storage.adapter.js
    │       └── storage.keys.js
    ├── shared/
    │   └── ui/
    │       ├── footer.js
    │       ├── info-modal.js
    │       └── navbar.js
    └── styles/
        ├── base.css
        ├── components.css
        └── utilities.css
```

---

## Tech Stack

- **Vanilla JavaScript ES6+ Modules** — DOM API native tanpa framework frontend.
- **Vite** — development server dan production build.
- **Tailwind CSS v4** — digunakan melalui plugin Vite dan import dasar; sebagian besar styling CASEFILE ditulis manual pada `src/styles/`.
- **Web Storage API** — LocalStorage untuk data permanen dan sessionStorage untuk state investigasi aktif.
- **CSS** — layout, responsive design, theme system, feedback state, modal, timer, progress bar, dan animasi transisi.

---

## Cara Menjalankan

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka alamat yang ditampilkan oleh Vite pada terminal. Secara default project ini menggunakan port Vite yang tersedia pada environment, sehingga gunakan URL yang diberikan terminal.

Build untuk produksi:

```bash
npm run build
```

Preview hasil production build:

```bash
npm run preview
```

---

## Pengujian yang Disarankan

Sebelum pengumpulan, lakukan pengujian dari awal sampai akhir pada minimal satu kasus:

1. Buka landing page.
2. Klik `Mulai Investigasi`.
3. Pastikan popup `How to Play` muncul pada penggunaan pertama.
4. Lanjut ke database kasus.
5. Pilih kasus.
6. Baca briefing dan mulai investigasi.
7. Pastikan timer mulai setelah countdown dan tetap mengambang.
8. Buka evidence yang tersedia.
9. Selesaikan seluruh 5 deduction questions.
10. Uji minimal satu jawaban salah dan satu jawaban benar.
11. Pilih suspect.
12. Pastikan score dan breakdown tampil otomatis.
13. Pastikan High Score tersimpan.
14. Simpan hasil dan buka History.
15. Uji tombol restart.
16. Uji navigasi Home, Kasus, History, dan About.
17. Uji Dark/Light Mode.
18. Refresh saat sesi investigasi aktif dan pastikan session dapat dipulihkan.

---

## Rubrik Penilaian yang Disasar

CASEFILE dirancang untuk memenuhi requirement dan mengarah pada kategori tertinggi pada rubrik Tugas Rutin 6.

### Fungsionalitas

- Quiz berjalan dari pemilihan kasus sampai result.
- Tersedia 40 pertanyaan pilihan ganda, dengan 5 pertanyaan pada setiap investigasi.
- Skor dihitung otomatis.
- High Score disimpan di LocalStorage.
- Feedback benar/salah tersedia.
- Restart tersedia.
- Navigasi internal menggunakan pola SPA tanpa reload.

### Kualitas Kode

- Menggunakan ES6+ modules.
- DOM dinamis dibuat menggunakan `createElement` dan `textContent`.
- Event delegation digunakan pada interaksi pilihan kasus, evidence, deduction, dan suspect.
- Data dipisahkan dari logic melalui `cases.json`.
- Fitur dipisahkan berdasarkan domain pada folder `features/`.
- Tidak menggunakan `innerHTML` untuk rendering data dinamis.
- Penyimpanan browser dipisahkan melalui storage adapter.

Rubrik Tugas Rutin 6 menempatkan fungsionalitas quiz, 5+ soal, skor otomatis, high score LocalStorage, serta kualitas kode ES6+, event delegation, dan `textContent` sebagai aspek utama penilaian.

---

## Informasi Pengumpulan

Project ini ditujukan untuk pengumpulan **Tugas Rutin 6 — Interactive Quiz App**.

Repository GitHub yang digunakan untuk pengumpulan:

```text
TugasWeb-Pertemuan6-QuizApp
```

Repository perlu dibuat **Public** dan link repository dikumpulkan melalui LMS UNIMED sesuai instruksi tugas.

Profil GitHub pengembang tersedia melalui shortcut GitHub pada footer aplikasi.
