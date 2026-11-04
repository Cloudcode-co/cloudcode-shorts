// The kinds of video the pipeline makes (FORMAT, /video kieu). Voiced formats
// go through pipeline/write-script.mjs (research, checked facts, voiceover)
// with their own shape; silent ones (no voiceover, music only) through
// pipeline/write-meme.mjs. `style` is the art direction used when STYLE is
// empty (null: Gemini picks one that fits); `scenes` and `words` bound the script.
export const FORMATS = {
  explainer: {
    label: "Giải thích",
    voiced: true,
    style: null,
    scenes: [6, 16],
    words: [120, 380],
    pick: "A head-to-head comparison with a well-known alternative works well.",
    shape:
      "Shape: 8–14 scenes, 60–110 seconds spoken in total (about 14 Vietnamese words per 5 seconds). " +
      "Scene 1 is a hook question in under 5 seconds. If there is an install, show it as steps with commands " +
      "copied character for character from the research; never invent or edit a command, and prefer the " +
      "shortest official way (one-line installer, docker run, or docker compose). The last scene says to save " +
      "the video to try later and follow for more.",
  },
  quiz: {
    label: "Đố vui",
    voiced: true,
    style: "quiz-show",
    scenes: [4, 9],
    words: [60, 200],
    pick: "Pick a tool or idea with a surprising fact a quiz can ask about (a common misconception works well).",
    shape:
      "Shape: a quiz, 25–50 seconds. Scene 1 asks one question about the topic with 2–4 short answer options " +
      'in "lines" (A. ..., B. ...), the question in "headline". Scene 2 is only a countdown for viewers to guess: ' +
      '"Ba... hai... một..." (headline "3 2 1", no lines). Scene 3 reveals the answer: "headline" is the right ' +
      'option word for word, "lines" one short reason. Then 1–4 scenes explain why, from the research. The last ' +
      "scene asks viewers who got it right to comment and to follow for the next quiz. The answer must be a fact " +
      "from the research, and the wrong options plausible but clearly wrong by the research.",
  },
  news: {
    label: "Tin tuần",
    voiced: true,
    style: "news-desk",
    scenes: [6, 12],
    words: [110, 300],
    pick:
      "This is the weekly roundup: pick 3 different repos from the list that are rising this week (no two " +
      'doing the same thing), all in "repos", and name the topic "Tin tuần: <the three names>".',
    shape:
      "Shape: a weekly news roundup, 45–80 seconds. Scene 1 says this week's 3 projects worth knowing in under 5 " +
      "seconds. Then each project gets 2–3 scenes: what it is and who it is for, one concrete fact from the research " +
      '(with its repo in "repos" so its logo and real star count show), and the one reason to try it. Number them ' +
      '"1/3", "2/3", "3/3" in the headline. The last scene asks which one viewers would try and to follow for next ' +
      "week's roundup.",
  },
  brief: {
    label: "Điểm tin sáng",
    voiced: true,
    style: "news-desk",
    scenes: [5, 10],
    words: [70, 180],
    // The stories come from Hacker News (pipeline/write-script.mjs), so the
    // trending pick never runs for it.
    pick: "",
    shape:
      "Shape: a morning tech news brief, 30–50 seconds. Scene 1 opens with \"Điểm tin sáng\" and the day, and " +
      "names the 3 stories in under 5 seconds. Each story gets 1–2 scenes: what happened, one concrete fact from " +
      "its page (a number, a name, a date), and what it changes for Vietnamese developers or self-hosters. Number " +
      'them "1/3", "2/3", "3/3" in the headline. Say only what the pages say: no guessing at causes or what ' +
      "comes next, and say \"theo <site>\" for claims a company makes about itself. The last scene asks which " +
      "story viewers care about most and to follow for tomorrow's brief.",
  },
  tutorial: {
    label: "Hướng dẫn 30 giây",
    voiced: true,
    style: "terminal-tutorial",
    scenes: [4, 9],
    words: [60, 200],
    pick: "Pick a tool that installs with one or two official commands (a one-line installer, docker run, or docker compose).",
    shape:
      "Shape: a 30–50 second install tutorial. Scene 1 says what we install and what it gives you, in under 5 " +
      'seconds. Then 2–5 steps, each one scene with the exact command in "commands", copied character for ' +
      "character from the research (never invent or edit one; skip the video's install if the research has none), " +
      'and the step in a few words as "headline". Then one scene says how to open it (the port or URL the research ' +
      "gives). The last scene says to save the video for when they set it up.",
  },
  top5: {
    label: "Top 5",
    voiced: true,
    style: "countdown",
    scenes: [7, 14],
    words: [120, 340],
    pick:
      'Pick a "top 5" theme (5 self-hosted alternatives to a well-known app, 5 tools for one job) and put 5 ' +
      'repos for it in "repos", with "queries" to find more.',
    shape:
      "Shape: a top 5 countdown, 50–90 seconds. Scene 1 names the list in under 5 seconds. Then one or two scenes " +
      'per entry from number 5 down to number 1, the rank in the headline ("#5 ..."), with its repo in "repos" and ' +
      "the one thing it does best from the research. Rank by what the research supports (stars, maturity, ease); " +
      "say why number 1 wins. The last scene asks viewers what they would add and to follow for more.",
  },
  story: {
    label: "Kể chuyện dev",
    voiced: true,
    style: "documentary",
    scenes: [7, 14],
    words: [140, 360],
    pick: "",
    shape:
      "Shape: a true story told like a short documentary, 60–100 seconds, from the page in the research. Scene 1 " +
      "is the hook: the most surprising moment of the story, in under 5 seconds. Then tell what happened in order: " +
      "who, what went wrong or right, the turning point, the numbers the page gives, what they changed after. " +
      "Use only what the page says; no invented quotes, names or numbers. The last scene is the lesson for " +
      'developers in one line, then "follow to hear the next story". Put a stock-video search in "footage" in ' +
      "most scenes (offices, servers, a developer at night, a city) since the story has no screenshots.",
  },
  meme: { label: "Meme", voiced: false, style: "meme-skit" },
  chat: { label: "POV tin nhắn", voiced: false, style: "chat-thread" },
};

export const formatOf = (name) => FORMATS[(name ?? "").trim()] ? (name ?? "").trim() : "explainer";
