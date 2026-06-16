export interface Minigame {
  id: string;
  title: string;
  description: string;
  titleEn: string;
  descriptionEn: string;
  icon: string;
  color: string;
  slug: string;
}

export const MINIGAMES: Minigame[] = [
  {
    id: "tts",
    title: "Teka Teki Silang (TTS)",
    description: "Pecahkan teka-teki silang seputar istilah-istilah penting kesehatan reproduksi.",
    titleEn: "Crossword Puzzle (TTS)",
    descriptionEn: "Solve crossword puzzles about important reproductive health terms.",
    icon: "📝",
    color: "#FAC775",
    slug: "/minigames/tts",
  },
  {
    id: "mitos-atau-fakta",
    title: "Mitos atau Fakta",
    description: "Uji pengetahuanmu dengan menebak mana yang mitos dan mana yang fakta seputar kesehatan reproduksi.",
    titleEn: "Myth or Fact",
    descriptionEn: "Test your knowledge by guessing which statements are myths and which are facts.",
    icon: "🧠",
    color: "#7C78A8",
    slug: "/minigames/mitos-atau-fakta",
  },
];
