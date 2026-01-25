import { Candidate, VotingStep } from './types';

export const CANDIDATES_DATA: Record<VotingStep, Candidate[]> = {
  [VotingStep.OPPN_PUTRA]: [
    {
      id: '01',
      number: '01',
      name: 'Diki Maulana',
      class: 'Kelas 5 KUI', // Assuming class based on context or keep as is if not specified, defaulting to typical
      image: 'https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765923911/OPPN_PUTRA_1_ogkxlu.jpg',
      vision: "Mewujudkan PPNH yang tertib, bersih dan disiplin sebagai langkah untuk menciptakan lingkungan yang mendukung proses pembelajaran akhlak yang baik, dan mengembangkan pribadi santri yang optimal.",
      missions: [
        'Meningkatkan kebersihan dan kenyamanan lingkungan Pondok.',
        'Menegakan disiplin waktu dan kegiatan.',
        'Menegakan ketertiban harian yang jelas.',
        'Membentuk kesadaran kepribadian santri.'
      ]
    },
    {
      id: '02',
      number: '02',
      name: 'Muhammad Aditya',
      class: 'Kelas 5 KUI',
      image: 'https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765923911/OPPN_PUTRA_2_vqovk0.jpg',
      vision: "Mewujudkan santri Ponpes Nurul Huda yang berakhlakul karimah, disiplin, jujur, bertanggung Jawab dan berintegritas dalam setiap tindakan dan keputusan sebagai teladan bagi seluruh lingkungan pesantren.",
      missions: [
        'Membentuk santri yang berakhlakul karimah dan berintegritas.',
        'Menegakan kedisiplinan dalam melaksanakan Ibadah dan pembelajaran.',
        'Menguatkan pembinaan dan pemahaman al-qur\'an serta doa-doa harian.',
        'Membentuk kerjasama yang solidaritas antar dewan, ustad, pengurus dan para santri.',
        'Membentuk kesadaran santri dalam kebersihan pribadi maupun umum dengan konsisten.'
      ]
    },
    {
      id: '03',
      number: '03',
      name: 'Muhammad Malik Fudholi',
      class: 'Kelas 5 KUI',
      image: 'https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765923911/OPPN_PUTRA_3_cwugpc.jpg',
      vision: "Mewujudkan Santri yang bertaqwa, bertanggung jawab, cerdas dan berakhlakul karimah serta menjadi figur dalam berbahasa.",
      missions: [
        'Menciptakan lingkungan pendidikan kondusif dan profesional.',
        'Mengadakan hari berbahasa.',
        'Menerapkan kesadaran terhadap lingkungan pondok.',
        'Mengadakan Mudakaroh Santri.',
        'Mengembangkan kemampuan yang ada pada diri Santri.'
      ]
    },
  ],
  [VotingStep.OPPN_PUTRI]: [
    {
      id: '04',
      number: '01',
      name: 'Najla Ain Zinatul',
      class: 'Kelas 5 KUI',
      image: 'https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765969605/OPPN_PUTRI_1_otbq6n.jpg',
      vision: "Mewujudkan Kepengurusan yang berintegritas, berakhlak mulia serta membangun lingkungan Pesantren yang disiplin Harmonis dan Inspiratif demi lahirnya Santri yang unggul dalam ilmu, amal, dan karakter.",
      missions: [
        'Membangun disiplin dan keteladanan.',
        'Memperkuat kerjasama antara Pengurus dan Santri.',
        'Menegakan nilai - nilai Akhlakul Karimah.',
        'Menjadikan ekstrakulikuler sebagai wadah pembinaan kepemimpinan islam.'
      ]
    },
    {
      id: '05',
      number: '02',
      name: 'Sinta Rosmayanti',
      class: 'Kelas 5 KUI',
      image: 'https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765969608/OPPN_PUTRI_2_gp6clh.jpg',
      vision: "Mewujudkan Santri PPNH yang Berakhlakul Karimah, Beramal Ilmah, Disiplin, Mandiri, serta mampu menjadi Teladan dalam kehidupan Santri.",
      missions: [
        'Mengoptimalkan Kegiatan Keagamaan seperti Sholat berjamaah, Mengaji, dan Membaca Wirid.',
        'Menegakan tata tertib pesantren secara adil dan bijaksana.',
        'Menegakan nilai - nilai akhlakul karimah Santri.',
        'Meningkatkan kualitas pendidikan dan keterampilan Santri.'
      ]
    },
    {
      id: '06',
      number: '03',
      name: 'Seli Raifani',
      class: 'Kelas 5 KUI',
      image: 'https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765969605/OPPN_PUTRI_3_jbmixc.jpg',
      vision: "Membentuk generasi Santri yang berakhlak mulia, berintegritas tinggi, dan mampu memimpin perubahan di era Modern dengan Nilai - Nilai Islam sebagai pondasi.",
      missions: [
        'Membangun budaya Akhlak dan Adab sebagai identitas utama Santri memulai pembiasaan yang Konsisten.',
        'Menanam dan menumbuhkembangkan rasa Tanggung Jawab dalam melaksanakan tugas sehari - hari.',
        'Mewujudkan lingkungan Pesantren yang aman, inklusif, dan kondusif bagi tumbuhnya potensi secara formal.',
        'Disiplin dalam melaksanakan tugasnya masing - masing sesuai dengan ketentuan yang berlaku.'
      ]
    },
  ],
  [VotingStep.GUDEP]: [
    {
      id: '07',
      number: '01',
      name: 'Felix Edbert Mubarok',
      class: 'Kelas 5 KUI',
      image: 'https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765924650/GUDEP_1_dhew3b.jpg',
      vision: "Mewujudkan Gugus Depan Kepramukaan yang Berakhlakul Karimah, Disiplin, dan Berintegritas sebagai teladan bagi seluruh Santri di lingkungan PPNH.",
      missions: [
        'Meningkatkan Kedisiplinan, Tanggung Jawab, dan Karakter Santri.',
        'Mengembangkan Kepemimpinan dan Keterampilan Kepramukaan.',
        'Membangun Kerja sama dan kekompakan dalam Gugus Depan Kepramukaan.',
        'Membina Santri agar mampu Mempraktikan nilai ibadah dalam tindakan, seperti Kejujuran, dan Tolong Menolong.'
      ]
    },
    {
      id: '08',
      number: '02',
      name: 'Muhammad Arifal', // Silakan informasikan nama kandidat ini
      class: 'Kelas 5 KUI',
      image: 'https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765924650/GUDEP_2_wcewfd.jpg',
      vision: "Mewujudkan Gugus Depan PPNH sebagai generasi Pramuka yang Berakhlak Mulia, Berwawasan Luas, dan berperan aktif dalam membangun budaya Santri.",
      missions: [
        'Menanam akhlakul karimah sebagai pondasi kepribadian anggota.',
        'Membentuk karakter disiplin, mandiri, dan bertanggung jawab.',
        'Mengembangkan kemampuan kepemimpinan dan keterampilan hidup.',
        'Mendorong budaya literasi dan wawasan keilmuan, baik agama maupun umum.',
        'Menguatkan jiwa solidaritas dan kepedulian sosial.',
        'Mengoptimalkan potensi bakat dan minat anggota.',
        'Mewujudkan Gudep yang unggul dan Modern.'
      ]
    },
    {
      id: '09',
      number: '03',
      name: 'Sandi Muhammad Dani',
      class: 'Kelas 5 KUI',
      image: 'https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765924650/GUDEP_3_epj0hd.jpg',
      vision: "Menjadi Gugus Depan yang unggul dalam pembentukan karakter keislaman yang luhur serta mencetak generasi Berakhlakul Karimah, Berkarakter, Berilmu dan siap Berkontribusi secara Positif.",
      missions: [
        'Membina dan Mengembangkan Karakter perlandasan Akhlakul Karimah.',
        'Mengatakan kopetensi kepemimpinan yang Profesional dan Beretika.',
        'Mempunyai jiwa korsa (1 Darah tapi tidak 1 rahim).',
        'Bersikap Adil & tidak memandang bulu.',
        'Ingin meningkatkan jiwa kesolidaritasan terhadap orang.'
      ]
    },
  ]
};
