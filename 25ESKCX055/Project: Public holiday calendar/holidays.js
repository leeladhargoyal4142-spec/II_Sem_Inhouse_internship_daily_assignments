/* ============================================================
   holidays.js
   Indian Public Holiday Calendar — Data Layer
   Every holiday is defined once. Fixed-date holidays repeat the
   same month/day every year; variable (lunar/Hijri) holidays carry
   a hand-set date per year because they shift on the Gregorian
   calendar. Dates for 2027–2028 for lunar/Hijri festivals are best
   estimates — always confirm against the official Government of
   India gazette before relying on them for leave planning.
   ============================================================ */

const YEARS_SUPPORTED = [2024, 2025, 2026, 2027, 2028];

/**
 * type: "fixed"    -> { month, day } repeats every year
 * type: "variable" -> { dates: { year: "YYYY-MM-DD" } }
 */
const RAW_HOLIDAYS = [
  {
    id: "new-year", name: "New Year's Day", hindiName: "नव वर्ष", englishName: "New Year's Day",
    category: "restricted", religion: "Secular", states: ["All States"],
    emoji: "🎆", color: "#5B4B8A",
    type: "fixed", month: 1, day: 1,
    history: "Marks the start of the Gregorian calendar year, observed nationally as a restricted holiday and widely celebrated with parties and gatherings.",
    importance: "A day of fresh starts, resolutions, and reflection on the year gone by.",
    celebration: "Countdown parties, fireworks, family gatherings, and resolution-setting.",
    foods: ["Cake", "Sparkling drinks", "Festive sweets"],
    dress: "Party wear, festive colours",
    decoration: "Fairy lights, balloons, banners",
    facts: ["The Gregorian calendar was introduced in 1582.", "India also follows regional new years like Ugadi and Baisakhi on different dates."],
    quote: "Cheers to a new chapter!",
    wiki: "https://en.wikipedia.org/wiki/New_Year",
    govLink: "https://www.india.gov.in/",
    lat: 28.6139, lng: 77.2090
  },
  {
    id: "makar-sankranti", name: "Makar Sankranti / Pongal", hindiName: "मकर संक्रांति", englishName: "Harvest Festival",
    category: "national", religion: "Hindu", states: ["Tamil Nadu", "Punjab", "Gujarat", "Karnataka", "Andhra Pradesh", "Telangana", "West Bengal"],
    emoji: "🪁", color: "#E98A15",
    type: "fixed", month: 1, day: 14,
    history: "Celebrates the sun's transition into Capricorn (Makara), marking the end of winter and the start of the harvest season.",
    importance: "Thanksgiving for a good harvest; the day kite-flying skies come alive across North India.",
    celebration: "Kite flying, bonfires, Pongal cooking rituals in the south, sesame-jaggery sweets exchanged as goodwill.",
    foods: ["Til-gud laddoo", "Pongal (rice dish)", "Khichdi"],
    dress: "Traditional regional wear",
    decoration: "Kolam/rangoli, sugarcane stalks",
    facts: ["Known by different names across India: Pongal, Uttarayan, Bihu, Maghi.", "One of the few Hindu festivals tied to the solar, not lunar, calendar."],
    quote: "Til gud ghya, god god bola — eat sweets, speak sweetly.",
    wiki: "https://en.wikipedia.org/wiki/Makar_Sankranti",
    govLink: "https://www.india.gov.in/",
    lat: 13.0827, lng: 80.2707
  },
  {
    id: "republic-day", name: "Republic Day", hindiName: "गणतंत्र दिवस", englishName: "Republic Day",
    category: "national", religion: "Secular", states: ["All States"],
    emoji: "🇮🇳", color: "#FF9933",
    type: "fixed", month: 1, day: 26,
    history: "Commemorates the day the Constitution of India came into effect in 1950, replacing the Government of India Act.",
    importance: "Celebrates India's transition into a sovereign republic.",
    celebration: "Parade at Kartavya Path in New Delhi, flag hoisting across schools and offices, Beating Retreat ceremony.",
    foods: ["Tricolour-themed sweets"],
    dress: "Tricolour badges, formal attire",
    decoration: "National flags, tricolour lights",
    facts: ["The Constitution took 2 years, 11 months, and 18 days to draft.", "The Republic Day parade route is called Kartavya Path."],
    quote: "Unity in diversity, strength in democracy.",
    wiki: "https://en.wikipedia.org/wiki/Republic_Day_(India)",
    govLink: "https://www.india.gov.in/republic-day",
    lat: 28.6129, lng: 77.2295
  },
  {
    id: "basant-panchami", name: "Basant Panchami", hindiName: "बसंत पंचमी", englishName: "Spring Festival",
    category: "restricted", religion: "Hindu", states: ["Punjab", "Uttar Pradesh", "Bihar", "West Bengal"],
    emoji: "🌼", color: "#F2C230",
    type: "variable", dates: { 2024: "2024-02-14", 2025: "2025-02-02", 2026: "2026-01-23", 2027: "2027-02-11", 2028: "2028-01-31" },
    history: "Dedicated to Goddess Saraswati, the deity of knowledge, music, and art; marks the onset of spring.",
    importance: "Students and artists seek blessings for wisdom and creativity.",
    celebration: "Wearing yellow, flying kites, worshipping Saraswati in schools.",
    foods: ["Kesar halwa", "Yellow rice (meethe chawal)"],
    dress: "Yellow attire",
    decoration: "Yellow flowers, marigold",
    facts: ["Yellow symbolises the mustard fields blooming at this time of year.", "Also called Saraswati Puja in eastern India."],
    quote: "May wisdom bloom like spring flowers.",
    wiki: "https://en.wikipedia.org/wiki/Vasant_Panchami",
    govLink: "https://www.india.gov.in/",
    lat: 25.5941, lng: 85.1376
  },
  {
    id: "maha-shivratri", name: "Maha Shivratri", hindiName: "महा शिवरात्रि", englishName: "Great Night of Shiva",
    category: "gazetted", religion: "Hindu", states: ["All States"],
    emoji: "🔱", color: "#3D5A80",
    type: "variable", dates: { 2024: "2024-03-08", 2025: "2025-02-26", 2026: "2026-02-15", 2027: "2027-03-06", 2028: "2028-02-23" },
    history: "Honours Lord Shiva, believed to mark the night he performed the cosmic dance of creation, preservation, and destruction.",
    importance: "A night of fasting, prayer, and meditation for devotees of Shiva.",
    celebration: "Night-long vigils, temple visits, Rudrabhishek rituals.",
    foods: ["Fruits", "Milk-based prasad", "Sabudana khichdi (fasting food)"],
    dress: "Simple, traditional attire",
    decoration: "Bael leaves, temple lighting",
    facts: ["Devotees observe a strict fast, breaking it only the next morning.", "Major Shiva temples like Somnath see millions of pilgrims."],
    quote: "Om Namah Shivaya.",
    wiki: "https://en.wikipedia.org/wiki/Maha_Shivaratri",
    govLink: "https://www.india.gov.in/",
    lat: 25.3176, lng: 82.9739
  },
  {
    id: "holi", name: "Holi", hindiName: "होली", englishName: "Festival of Colours",
    category: "national", religion: "Hindu", states: ["All States"],
    emoji: "🎨", color: "#E63946",
    type: "variable", dates: { 2024: "2024-03-25", 2025: "2025-03-14", 2026: "2026-03-03", 2027: "2027-03-22", 2028: "2028-03-11" },
    history: "Celebrates the victory of good over evil (the legend of Holika and Prahlad) and the arrival of spring.",
    importance: "One of India's most joyous, community-uniting festivals.",
    celebration: "Playing with coloured powders and water, bonfires the night before (Holika Dahan), music and dance.",
    foods: ["Gujiya", "Thandai", "Malpua"],
    dress: "Old white clothes (to be coloured)",
    decoration: "Colour powders (gulal), water balloons",
    facts: ["Holi is mentioned in ancient Sanskrit texts as early as the 4th century CE.", "The Braj region's Holi celebrations, including Lathmar Holi, last over a week."],
    quote: "Bura na mano, Holi hai! — Don't mind, it's Holi!",
    wiki: "https://en.wikipedia.org/wiki/Holi",
    govLink: "https://www.india.gov.in/",
    lat: 27.5706, lng: 77.6539
  },
  {
    id: "ram-navami", name: "Ram Navami", hindiName: "राम नवमी", englishName: "Birth of Lord Rama",
    category: "gazetted", religion: "Hindu", states: ["All States"],
    emoji: "🏹", color: "#C1440E",
    type: "variable", dates: { 2024: "2024-04-17", 2025: "2025-04-06", 2026: "2026-03-26", 2027: "2027-04-14", 2028: "2028-04-02" },
    history: "Celebrates the birth of Lord Rama, the seventh avatar of Vishnu and the hero of the Ramayana.",
    importance: "Reveres Rama as the ideal of righteousness (dharma).",
    celebration: "Recitations of the Ramayana, processions, temple decorations, fasting.",
    foods: ["Panakam", "Kosambari", "Fruit prasad"],
    dress: "Traditional attire",
    decoration: "Rama-Sita idols, floral rangoli",
    facts: ["Ayodhya, Rama's birthplace, hosts grand celebrations.", "The festival closes the nine-day Chaitra Navratri."],
    quote: "Jai Shri Ram.",
    wiki: "https://en.wikipedia.org/wiki/Rama_Navami",
    govLink: "https://www.india.gov.in/",
    lat: 26.7922, lng: 82.1998
  },
  {
    id: "mahavir-jayanti", name: "Mahavir Jayanti", hindiName: "महावीर जयंती", englishName: "Birth of Lord Mahavira",
    category: "gazetted", religion: "Jain", states: ["All States"],
    emoji: "🕊️", color: "#8D6A9F",
    type: "variable", dates: { 2024: "2024-04-21", 2025: "2025-04-10", 2026: "2026-03-31", 2027: "2027-04-19", 2028: "2028-04-07" },
    history: "Marks the birth anniversary of Lord Mahavira, the 24th and last Tirthankara of Jainism.",
    importance: "Honours the principles of non-violence (ahimsa) and truth.",
    celebration: "Temple processions, charity, reading of Jain scriptures.",
    foods: ["Simple satvik meals"],
    dress: "White traditional attire",
    decoration: "Jain flags, temple lighting",
    facts: ["Mahavira attained enlightenment after 12 years of intense meditation.", "Jain temples across Rajasthan and Gujarat see the largest gatherings."],
    quote: "Ahimsa Paramo Dharma — non-violence is the highest duty.",
    wiki: "https://en.wikipedia.org/wiki/Mahavir_Jayanti",
    govLink: "https://www.india.gov.in/",
    lat: 26.9124, lng: 75.7873
  },
  {
    id: "good-friday", name: "Good Friday", hindiName: "गुड फ्राइडे", englishName: "Good Friday",
    category: "gazetted", religion: "Christian", states: ["Goa", "Kerala", "Nagaland", "Mizoram", "Meghalaya"],
    emoji: "✝️", color: "#4A5859",
    type: "variable", dates: { 2024: "2024-03-29", 2025: "2025-04-18", 2026: "2026-04-03", 2027: "2027-03-26", 2028: "2028-04-14" },
    history: "Commemorates the crucifixion of Jesus Christ and his death at Calvary.",
    importance: "A solemn day of mourning and reflection before Easter Sunday.",
    celebration: "Church services, processions, fasting and prayer.",
    foods: ["Hot cross buns", "Fish dishes"],
    dress: "Sombre, dark attire",
    decoration: "Church interiors draped in purple/black",
    facts: ["Followed two days later by Easter Sunday, the celebration of resurrection.", "Goa's Old Goa churches hold especially large services."],
    quote: "It is finished.",
    wiki: "https://en.wikipedia.org/wiki/Good_Friday",
    govLink: "https://www.india.gov.in/",
    lat: 15.5007, lng: 73.9114
  },
  {
    id: "eid-ul-fitr", name: "Eid-ul-Fitr", hindiName: "ईद-उल-फ़ित्र", englishName: "Festival of Breaking the Fast",
    category: "national", religion: "Muslim", states: ["All States"],
    emoji: "🌙", color: "#2A9D8F",
    type: "variable", dates: { 2024: "2024-04-11", 2025: "2025-03-31", 2026: "2026-03-20", 2027: "2027-03-10", 2028: "2028-02-27" },
    history: "Marks the end of the holy month of Ramadan, a month of fasting from dawn to dusk.",
    importance: "A celebration of self-discipline, gratitude, and community.",
    celebration: "Morning prayers (Eid namaz), feasting, giving to charity (Zakat), family visits.",
    foods: ["Sheer khurma", "Biryani", "Kebabs"],
    dress: "New traditional outfits",
    decoration: "Lanterns, crescent moon motifs",
    facts: ["The date depends on the sighting of the new moon.", "Sheer khurma, a vermicelli pudding, is the signature Eid dish across South Asia."],
    quote: "Eid Mubarak!",
    wiki: "https://en.wikipedia.org/wiki/Eid_al-Fitr",
    govLink: "https://www.india.gov.in/",
    lat: 28.6507, lng: 77.2334
  },
  {
    id: "buddha-purnima", name: "Buddha Purnima", hindiName: "बुद्ध पूर्णिमा", englishName: "Birth of Buddha",
    category: "gazetted", religion: "Buddhist", states: ["All States"],
    emoji: "☸️", color: "#D4AF37",
    type: "variable", dates: { 2024: "2024-05-23", 2025: "2025-05-12", 2026: "2026-05-01", 2027: "2027-05-20", 2028: "2028-05-08" },
    history: "Celebrates the birth, enlightenment, and death (Mahaparinirvana) of Gautama Buddha, all believed to fall on this day.",
    importance: "A day of meditation, teachings, and reflection on the Four Noble Truths.",
    celebration: "Prayers at Bodh Gaya, lighting lamps, meditation sessions, charity.",
    foods: ["Simple vegetarian meals", "Kheer"],
    dress: "White or saffron robes",
    decoration: "Lotus motifs, prayer flags",
    facts: ["Bodh Gaya, where Buddha attained enlightenment, is a UNESCO World Heritage Site.", "Also called Vesak in many South and Southeast Asian countries."],
    quote: "Peace comes from within.",
    wiki: "https://en.wikipedia.org/wiki/Vesak",
    govLink: "https://www.india.gov.in/",
    lat: 24.6959, lng: 84.9911
  },
  {
    id: "bakrid", name: "Bakrid (Eid al-Adha)", hindiName: "बकरीद", englishName: "Festival of Sacrifice",
    category: "national", religion: "Muslim", states: ["All States"],
    emoji: "🐐", color: "#457B9D",
    type: "variable", dates: { 2024: "2024-06-17", 2025: "2025-06-07", 2026: "2026-05-27", 2027: "2027-05-17", 2028: "2028-05-05" },
    history: "Commemorates Prophet Ibrahim's willingness to sacrifice his son as an act of obedience to God.",
    importance: "A festival of sacrifice, charity, and sharing with the less fortunate.",
    celebration: "Morning prayers, ritual sacrifice (Qurbani), distributing meat to family, friends, and the poor.",
    foods: ["Biryani", "Seekh kebabs", "Sevaiyan"],
    dress: "New traditional outfits",
    decoration: "Lanterns, festive lights",
    facts: ["One-third of the sacrificial meat is traditionally donated to the needy.", "Coincides with the annual Hajj pilgrimage to Mecca."],
    quote: "Eid Mubarak!",
    wiki: "https://en.wikipedia.org/wiki/Eid_al-Adha",
    govLink: "https://www.india.gov.in/",
    lat: 17.3850, lng: 78.4867
  },
  {
    id: "muharram", name: "Muharram", hindiName: "मुहर्रम", englishName: "Islamic New Year / Ashura",
    category: "gazetted", religion: "Muslim", states: ["All States"],
    emoji: "🕌", color: "#1D3557",
    type: "variable", dates: { 2024: "2024-07-17", 2025: "2025-07-06", 2026: "2026-06-26", 2027: "2027-06-15", 2028: "2028-06-04" },
    history: "Marks the Islamic New Year; the tenth day (Ashura) mourns the martyrdom of Imam Hussain at Karbala.",
    importance: "A period of reflection, mourning, and remembrance for Shia and Sunni Muslims alike.",
    celebration: "Processions (Tazia), recitation of elegies (Marsiya), community meals.",
    foods: ["Haleem", "Sherbet"],
    dress: "Black attire (mourning)",
    decoration: "Tazia replicas, black banners",
    facts: ["Ashura processions in Lucknow and Hyderabad are among the largest in India.", "The Islamic calendar is purely lunar, so Muharram shifts ~11 days earlier each Gregorian year."],
    quote: "Labbaik Ya Hussain.",
    wiki: "https://en.wikipedia.org/wiki/Muharram",
    govLink: "https://www.india.gov.in/",
    lat: 26.8467, lng: 80.9462
  },
  {
    id: "raksha-bandhan", name: "Raksha Bandhan", hindiName: "रक्षा बंधन", englishName: "Bond of Protection",
    category: "restricted", religion: "Hindu", states: ["All States"],
    emoji: "🧵", color: "#E76F51",
    type: "variable", dates: { 2024: "2024-08-19", 2025: "2025-08-09", 2026: "2026-08-28", 2027: "2027-08-17", 2028: "2028-09-04" },
    history: "Celebrates the bond between brothers and sisters, symbolised by a sacred thread (rakhi).",
    importance: "Sisters tie a rakhi on their brothers' wrists; brothers vow lifelong protection.",
    celebration: "Rakhi-tying ceremonies, gift exchanges, festive meals.",
    foods: ["Ladoo", "Kaju katli"],
    dress: "Festive traditional wear",
    decoration: "Rakhi threads, decorative thalis",
    facts: ["The tradition has roots in the epic Mahabharata.", "Rakhis are now sent internationally to siblings living abroad."],
    quote: "A thread of love, a bond for life.",
    wiki: "https://en.wikipedia.org/wiki/Raksha_Bandhan",
    govLink: "https://www.india.gov.in/",
    lat: 23.0225, lng: 72.5714
  },
  {
    id: "independence-day", name: "Independence Day", hindiName: "स्वतंत्रता दिवस", englishName: "Independence Day",
    category: "national", religion: "Secular", states: ["All States"],
    emoji: "🎇", color: "#138808",
    type: "fixed", month: 8, day: 15,
    history: "Commemorates India's independence from British rule on 15 August 1947.",
    importance: "Honours the freedom struggle and India's sovereignty.",
    celebration: "Flag hoisting, the Prime Minister's address from the Red Fort, cultural programs, kite flying.",
    foods: ["Tricolour-themed sweets"],
    dress: "Tricolour badges",
    decoration: "National flags, patriotic lighting",
    facts: ["Jawaharlal Nehru delivered the famous 'Tryst with Destiny' speech at midnight on 15 August 1947.", "India and Pakistan celebrate independence a day apart (15th and 14th)."],
    quote: "Saare Jahan Se Achha, Hindustan Hamara.",
    wiki: "https://en.wikipedia.org/wiki/Independence_Day_(India)",
    govLink: "https://www.india.gov.in/independence-day",
    lat: 28.6562, lng: 77.2410
  },
  {
    id: "janmashtami", name: "Janmashtami", hindiName: "जन्माष्टमी", englishName: "Birth of Lord Krishna",
    category: "gazetted", religion: "Hindu", states: ["All States"],
    emoji: "🪈", color: "#3A86FF",
    type: "variable", dates: { 2024: "2024-08-26", 2025: "2025-08-16", 2026: "2026-09-04", 2027: "2027-08-24", 2028: "2028-09-11" },
    history: "Celebrates the birth of Lord Krishna, the eighth avatar of Vishnu.",
    importance: "Devotees fast and stay up until midnight, Krishna's believed birth hour.",
    celebration: "Dahi Handi (human pyramids breaking curd pots), devotional singing, temple decorations.",
    foods: ["Makhan mishri (butter-sugar)", "Panjiri", "Chappan bhog"],
    dress: "Krishna/Radha costumes for children",
    decoration: "Jhankis (tableaux), cradles for baby Krishna idols",
    facts: ["Mumbai's Dahi Handi celebrations draw massive crowds and prize money.", "Mathura and Vrindavan, Krishna's birthplace, host the grandest celebrations."],
    quote: "Hare Krishna, Hare Rama.",
    wiki: "https://en.wikipedia.org/wiki/Krishna_Janmashtami",
    govLink: "https://www.india.gov.in/",
    lat: 27.4924, lng: 77.6737
  },
  {
    id: "ganesh-chaturthi", name: "Ganesh Chaturthi", hindiName: "गणेश चतुर्थी", englishName: "Birth of Lord Ganesha",
    category: "national", religion: "Hindu", states: ["Maharashtra", "Karnataka", "Goa", "Andhra Pradesh", "Telangana"],
    emoji: "🐘", color: "#EF6C00",
    type: "variable", dates: { 2024: "2024-09-07", 2025: "2025-08-27", 2026: "2026-09-14", 2027: "2027-09-03", 2028: "2028-08-22" },
    history: "Celebrates the birth of Lord Ganesha, the remover of obstacles.",
    importance: "A ten-day festival ending in the immersion of Ganesha idols (visarjan).",
    celebration: "Elaborate pandals, community idol installations, processions to rivers/sea for immersion.",
    foods: ["Modak", "Puran poli"],
    dress: "Traditional Maharashtrian attire",
    decoration: "Ganesha idols, flower garlands, pandal lighting",
    facts: ["Mumbai's Lalbaugcha Raja is one of the most visited Ganesh pandals in the world.", "The festival was revived as a public event by freedom fighter Bal Gangadhar Tilak in 1893."],
    quote: "Ganpati Bappa Morya!",
    wiki: "https://en.wikipedia.org/wiki/Ganesh_Chaturthi",
    govLink: "https://www.india.gov.in/",
    lat: 19.0760, lng: 72.8777
  },
  {
    id: "onam", name: "Onam", hindiName: "ओणम", englishName: "Harvest Festival of Kerala",
    category: "state", religion: "Hindu", states: ["Kerala"],
    emoji: "🛶", color: "#2A9D8F",
    type: "variable", dates: { 2024: "2024-09-15", 2025: "2025-09-05", 2026: "2026-08-25", 2027: "2027-09-13", 2028: "2028-09-01" },
    history: "Celebrates the homecoming of the mythical King Mahabali, a symbol of prosperity and equality.",
    importance: "Kerala's biggest harvest festival, spanning ten days.",
    celebration: "Pookalam (flower carpets), Vallam Kali (snake boat races), Onasadya feast.",
    foods: ["Onasadya (26-dish banana-leaf feast)", "Payasam"],
    dress: "Kasavu saree/mundu",
    decoration: "Pookalam flower rangoli",
    facts: ["The Onasadya feast traditionally has 26 dishes served on a banana leaf.", "The Nehru Trophy Boat Race in Alappuzha is a major Onam attraction."],
    quote: "Onashamsakal! Happy Onam!",
    wiki: "https://en.wikipedia.org/wiki/Onam",
    govLink: "https://www.india.gov.in/",
    lat: 9.9312, lng: 76.2673
  },
  {
    id: "milad-un-nabi", name: "Milad-un-Nabi", hindiName: "ईद-ए-मिलाद", englishName: "Birth of Prophet Muhammad",
    category: "gazetted", religion: "Muslim", states: ["All States"],
    emoji: "🕋", color: "#264653",
    type: "variable", dates: { 2024: "2024-09-16", 2025: "2025-09-05", 2026: "2026-08-26", 2027: "2027-08-15", 2028: "2028-08-03" },
    history: "Commemorates the birth anniversary of Prophet Muhammad.",
    importance: "A day of devotional gatherings, sermons, and charity.",
    celebration: "Processions, recitation of Naat (devotional poetry), community meals.",
    foods: ["Sheer khurma", "Biryani"],
    dress: "Traditional attire",
    decoration: "Green banners, lights on mosques",
    facts: ["Also known as Mawlid across the Islamic world.", "Celebrated with grand processions in Hyderabad and Lucknow."],
    quote: "Peace and blessings upon the Prophet.",
    wiki: "https://en.wikipedia.org/wiki/Mawlid",
    govLink: "https://www.india.gov.in/",
    lat: 17.3616, lng: 78.4747
  },
  {
    id: "navratri", name: "Navratri", hindiName: "नवरात्रि", englishName: "Nine Nights of the Goddess",
    category: "national", religion: "Hindu", states: ["Gujarat", "West Bengal", "All States"],
    emoji: "🪔", color: "#9B2226",
    type: "variable", dates: { 2024: "2024-10-03", 2025: "2025-09-22", 2026: "2026-10-11", 2027: "2027-09-30", 2028: "2028-09-19" },
    history: "Nine nights honouring nine forms of Goddess Durga, culminating in Dussehra.",
    importance: "A celebration of feminine divine energy (Shakti).",
    celebration: "Garba and Dandiya Raas dance nights in Gujarat, Durga Puja pandals in Bengal.",
    foods: ["Sabudana khichdi", "Kuttu puri (fasting food)"],
    dress: "Chaniya choli, vibrant colour-coded outfits per day",
    decoration: "Garba pots (garba), Durga idols",
    facts: ["Nine nights each correspond to a different form of Durga.", "Gujarat's Garba nights are recognised by UNESCO as intangible cultural heritage."],
    quote: "Jai Mata Di!",
    wiki: "https://en.wikipedia.org/wiki/Navratri",
    govLink: "https://www.india.gov.in/",
    lat: 23.0225, lng: 72.5714
  },
  {
    id: "durga-puja-dussehra", name: "Durga Puja / Dussehra", hindiName: "दुर्गा पूजा / दशहरा", englishName: "Victory of Good over Evil",
    category: "national", religion: "Hindu", states: ["All States"],
    emoji: "🏹", color: "#BC6C25",
    type: "variable", dates: { 2024: "2024-10-12", 2025: "2025-10-02", 2026: "2026-10-20", 2027: "2027-10-09", 2028: "2028-09-28" },
    history: "Marks Lord Rama's victory over Ravana, and Goddess Durga's victory over the demon Mahishasura.",
    importance: "Symbolises the triumph of good over evil.",
    celebration: "Burning Ravana effigies (Ravan Dahan), Durga idol immersion (visarjan), Ramlila performances.",
    foods: ["Bhog khichuri", "Jalebi"],
    dress: "Festive traditional wear",
    decoration: "Ravana effigies, Durga pandals",
    facts: ["Kolkata's Durga Puja is recognised by UNESCO as intangible cultural heritage.", "Mysuru's Dussehra procession dates back over 400 years."],
    quote: "Asato Ma Sadgamaya — lead us from untruth to truth.",
    wiki: "https://en.wikipedia.org/wiki/Dussehra",
    govLink: "https://www.india.gov.in/",
    lat: 22.5726, lng: 88.3639
  },
  {
    id: "karwa-chauth", name: "Karwa Chauth", hindiName: "करवा चौथ", englishName: "Fast for Marital Devotion",
    category: "restricted", religion: "Hindu", states: ["Punjab", "Haryana", "Uttar Pradesh", "Rajasthan"],
    emoji: "🌕", color: "#7209B7",
    type: "variable", dates: { 2024: "2024-10-20", 2025: "2025-10-10", 2026: "2026-10-28", 2027: "2027-10-17", 2028: "2028-10-05" },
    history: "Married women observe a sunrise-to-moonrise fast for their husbands' long life.",
    importance: "A symbol of devotion and marital love in North Indian tradition.",
    celebration: "Sargi meal before dawn, sighting the moon through a sieve, breaking the fast with the husband.",
    foods: ["Sargi (pre-dawn meal)", "Feni", "Mathri"],
    dress: "Red bridal-toned attire, henna",
    decoration: "Decorative thalis, diyas",
    facts: ["The fast is broken only after sighting the moon.", "Bollywood has popularised the festival widely across urban India."],
    quote: "May the moon bless your bond forever.",
    wiki: "https://en.wikipedia.org/wiki/Karva_Chauth",
    govLink: "https://www.india.gov.in/",
    lat: 30.7333, lng: 76.7794
  },
  {
    id: "diwali", name: "Diwali", hindiName: "दीपावली", englishName: "Festival of Lights",
    category: "national", religion: "Hindu", states: ["All States"],
    emoji: "🪔", color: "#FFB703",
    type: "variable", dates: { 2024: "2024-10-31", 2025: "2025-10-20", 2026: "2026-11-08", 2027: "2027-10-29", 2028: "2028-10-17" },
    history: "Celebrates Lord Rama's return to Ayodhya after 14 years of exile, and the victory of light over darkness.",
    importance: "India's most widely celebrated festival, symbolising hope, prosperity, and new beginnings.",
    celebration: "Lighting diyas, fireworks, Lakshmi Puja, gift exchanges, home decoration.",
    foods: ["Kaju katli", "Gulab jamun", "Assorted mithai"],
    dress: "New festive clothing",
    decoration: "Diyas, rangoli, string lights",
    facts: ["Diwali is a five-day festival, each day with its own significance.", "It is a public holiday in several countries beyond India, including Singapore and Malaysia."],
    quote: "Shubh Deepavali! May light triumph over darkness.",
    wiki: "https://en.wikipedia.org/wiki/Diwali",
    govLink: "https://www.india.gov.in/",
    lat: 26.8467, lng: 80.9462
  },
  {
    id: "govardhan-puja", name: "Govardhan Puja", hindiName: "गोवर्धन पूजा", englishName: "Worship of Govardhan Hill",
    category: "state", religion: "Hindu", states: ["Uttar Pradesh", "Rajasthan", "Bihar"],
    emoji: "⛰️", color: "#606C38",
    type: "variable", dates: { 2024: "2024-11-02", 2025: "2025-10-22", 2026: "2026-11-10", 2027: "2027-10-31", 2028: "2028-10-19" },
    history: "Commemorates Lord Krishna lifting the Govardhan Hill to shelter villagers from torrential rain.",
    importance: "Celebrated the day after Diwali as a symbol of nature worship and community protection.",
    celebration: "Building small hill replicas from cow dung, offering a 56-dish feast (Annakut).",
    foods: ["Annakut (56-dish spread)", "Kheer"],
    dress: "Festive traditional wear",
    decoration: "Govardhan hill replicas",
    facts: ["Also called Annakut, meaning 'mountain of food'.", "Widely observed by the Vaishnavite community in Mathura-Vrindavan."],
    quote: "Nature protected is nature that protects.",
    wiki: "https://en.wikipedia.org/wiki/Govardhan_Puja",
    govLink: "https://www.india.gov.in/",
    lat: 27.5010, lng: 77.6642
  },
  {
    id: "bhai-dooj", name: "Bhai Dooj", hindiName: "भाई दूज", englishName: "Brother-Sister Bond Day",
    category: "restricted", religion: "Hindu", states: ["All States"],
    emoji: "👫", color: "#F4A261",
    type: "variable", dates: { 2024: "2024-11-03", 2025: "2025-10-23", 2026: "2026-11-11", 2027: "2027-11-01", 2028: "2028-10-20" },
    history: "Celebrates the bond between brothers and sisters, similar in spirit to Raksha Bandhan.",
    importance: "Sisters perform an aarti for their brothers' wellbeing and long life.",
    celebration: "Tilak ceremony, festive meals, gift exchanges.",
    foods: ["Ladoo", "Kheer"],
    dress: "Festive traditional wear",
    decoration: "Decorative thalis, diyas",
    facts: ["Falls on the last day of the five-day Diwali festival.", "Known as Bhau Beej in Maharashtra and Bhai Tika in Nepal."],
    quote: "A bond that time cannot erode.",
    wiki: "https://en.wikipedia.org/wiki/Bhai_Dooj",
    govLink: "https://www.india.gov.in/",
    lat: 28.7041, lng: 77.1025
  },
  {
    id: "chhath-puja", name: "Chhath Puja", hindiName: "छठ पूजा", englishName: "Worship of the Sun God",
    category: "state", religion: "Hindu", states: ["Bihar", "Jharkhand", "Uttar Pradesh"],
    emoji: "🌅", color: "#E76F51",
    type: "variable", dates: { 2024: "2024-11-07", 2025: "2025-10-28", 2026: "2026-11-15", 2027: "2027-11-05", 2028: "2028-10-24" },
    history: "A four-day festival dedicated to Surya (Sun God) and Chhathi Maiya, thanking them for sustaining life.",
    importance: "One of the most rigorous fasting festivals, involving standing in water at sunrise and sunset.",
    celebration: "Offering arghya (water offerings) to the setting and rising sun on riverbanks.",
    foods: ["Thekua", "Fruits", "Sugarcane"],
    dress: "Traditional Bihari/Purvanchali attire",
    decoration: "Bamboo baskets (soop) with offerings",
    facts: ["Devotees fast without water for over 36 hours.", "Patna's Ganga ghats see millions of devotees during Chhath."],
    quote: "Chhathi Maiya ki jai!",
    wiki: "https://en.wikipedia.org/wiki/Chhath",
    govLink: "https://www.india.gov.in/",
    lat: 25.5941, lng: 85.1376
  },
  {
    id: "guru-nanak-jayanti", name: "Guru Nanak Jayanti", hindiName: "गुरु नानक जयंती", englishName: "Birth of Guru Nanak",
    category: "gazetted", religion: "Sikh", states: ["Punjab", "All States"],
    emoji: "☬", color: "#023E8A",
    type: "variable", dates: { 2024: "2024-11-15", 2025: "2025-11-05", 2026: "2026-11-24", 2027: "2027-11-14", 2028: "2028-11-02" },
    history: "Celebrates the birth of Guru Nanak Dev Ji, the founder of Sikhism.",
    importance: "Prakash Purab honours Guru Nanak's teachings of equality, service, and devotion.",
    celebration: "Akhand Path (48-hour continuous scripture reading), Nagar Kirtan processions, langar (community meals).",
    foods: ["Kada prasad", "Langar meals (open to all)"],
    dress: "Traditional Punjabi attire",
    decoration: "Gurdwara lighting, floral decorations",
    facts: ["The Golden Temple in Amritsar hosts millions of pilgrims on this day.", "Langar, the community kitchen, serves free meals to all regardless of faith."],
    quote: "Ik Onkar — there is one God.",
    wiki: "https://en.wikipedia.org/wiki/Guru_Nanak_Gurpurab",
    govLink: "https://www.india.gov.in/",
    lat: 31.6200, lng: 74.8765
  },
  {
    id: "christmas", name: "Christmas", hindiName: "क्रिसमस", englishName: "Birth of Jesus Christ",
    category: "national", religion: "Christian", states: ["All States"],
    emoji: "🎄", color: "#2A9134",
    type: "fixed", month: 12, day: 25,
    history: "Celebrates the birth of Jesus Christ, observed by Christians worldwide.",
    importance: "A festival of hope, family, and giving, widely celebrated even beyond the Christian community in India.",
    celebration: "Midnight mass, carol singing, decorating trees, gift-giving.",
    foods: ["Plum cake", "Kalkals", "Marzipan"],
    dress: "Festive Christmas attire",
    decoration: "Christmas trees, stars, fairy lights",
    facts: ["Goa's Christmas celebrations blend Portuguese and Indian traditions.", "Churches across India hold midnight mass on Christmas Eve."],
    quote: "Merry Christmas and a joyful season!",
    wiki: "https://en.wikipedia.org/wiki/Christmas",
    govLink: "https://www.india.gov.in/",
    lat: 15.2993, lng: 74.1240
  },
  {
    id: "new-year-eve", name: "New Year's Eve", hindiName: "नववर्ष पूर्व संध्या", englishName: "New Year's Eve",
    category: "restricted", religion: "Secular", states: ["All States"],
    emoji: "🥳", color: "#7209B7",
    type: "fixed", month: 12, day: 31,
    history: "The final evening of the Gregorian calendar year, celebrated worldwide with festivities.",
    importance: "A time for reflection on the year gone by and celebration of what's ahead.",
    celebration: "Parties, countdowns, fireworks displays at midnight.",
    foods: ["Party snacks", "Cakes", "Sparkling drinks"],
    dress: "Party wear",
    decoration: "Balloons, string lights, countdown banners",
    facts: ["Mumbai and Goa host some of India's biggest New Year's Eve parties.", "Many cities host public countdown events at central squares."],
    quote: "Here's to new beginnings!",
    wiki: "https://en.wikipedia.org/wiki/New_Year%27s_Eve",
    govLink: "https://www.india.gov.in/",
    lat: 19.0760, lng: 72.8777
  }
];

/**
 * Expands RAW_HOLIDAYS into flat per-year holiday instances usable by the
 * calendar and list views, e.g. { ...meta, year, date: Date, iso: "YYYY-MM-DD" }
 */
function buildHolidayInstances() {
  const instances = [];
  RAW_HOLIDAYS.forEach((h) => {
    YEARS_SUPPORTED.forEach((year) => {
      let iso;
      if (h.type === "fixed") {
        const mm = String(h.month).padStart(2, "0");
        const dd = String(h.day).padStart(2, "0");
        iso = `${year}-${mm}-${dd}`;
      } else {
        iso = h.dates[year];
      }
      if (!iso) return;
      const dateObj = new Date(iso + "T00:00:00");
      instances.push({
        ...h,
        year,
        iso,
        date: dateObj,
        dayName: dateObj.toLocaleDateString("en-IN", { weekday: "long" }),
        monthName: dateObj.toLocaleDateString("en-IN", { month: "long" })
      });
    });
  });
  return instances.sort((a, b) => a.date - b.date);
}

const HOLIDAY_INSTANCES = buildHolidayInstances();

const CATEGORY_LABELS = {
  national: "National Holiday",
  gazetted: "Gazetted Holiday",
  restricted: "Restricted Holiday",
  state: "State Holiday",
  government: "Government Holiday"
};
