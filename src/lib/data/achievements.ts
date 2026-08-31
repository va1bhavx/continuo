export interface Achievement {
  id: string;
  title: string;
  description: string;
  requirement: string;
  icon: string;
  category: "focus" | "quirks" | "customization" | "links" | "history" | "stats";
}

export const ACHIEVEMENTS: Achievement[] = [
  // Category 1: Focus Session Milestones
  {
    id: "first_timber",
    title: "First Timber",
    description: "You chopped your first log. Let the fire burn.",
    requirement: "Complete 1 focus session.",
    icon: "🪵",
    category: "focus"
  },
  {
    id: "timber_squad",
    title: "Timber Squad",
    description: "Five sessions down. You're building a steady routine.",
    requirement: "Complete 5 focus sessions.",
    icon: "🪵",
    category: "focus"
  },
  {
    id: "tenacious_ten",
    title: "Tenacious Ten",
    description: "Double digits! Double the focus.",
    requirement: "Complete 10 focus sessions.",
    icon: "🪵",
    category: "focus"
  },
  {
    id: "silver_quarter",
    title: "Silver Quarter",
    description: "A quarter of a hundred. You are becoming a master of your time.",
    requirement: "Complete 25 focus sessions.",
    icon: "🪵",
    category: "focus"
  },
  {
    id: "half_centurion",
    title: "Half-Centurion",
    description: "50 sessions! That is a massive wall of productivity built.",
    requirement: "Complete 50 focus sessions.",
    icon: "🪵",
    category: "focus"
  },
  {
    id: "the_centurion",
    title: "The Centurion",
    description: "100 sessions completed! Legend status achieved.",
    requirement: "Complete 100 focus sessions.",
    icon: "👑",
    category: "focus"
  },
  {
    id: "industrial_age",
    title: "Industrial Age",
    description: "Your focus is a factory of great things.",
    requirement: "Complete 250 focus sessions.",
    icon: "🏛️",
    category: "focus"
  },
  {
    id: "transcendent_flow",
    title: "Transcendent Flow",
    description: "500 focus sessions! Time and space are yours to command.",
    requirement: "Complete 500 focus sessions.",
    icon: "💫",
    category: "focus"
  },
  {
    id: "quick_spark",
    title: "Quick Spark",
    description: "A quick check-in. Every second counts.",
    requirement: "Complete a session under 10 minutes.",
    icon: "⚡",
    category: "focus"
  },
  {
    id: "classic_pomodoro",
    title: "Classic Pomodoro",
    description: "Honoring the classic Francesco Cirillo interval.",
    requirement: "Complete a session of exactly 25 minutes.",
    icon: "🍅",
    category: "focus"
  },
  {
    id: "orbiting",
    title: "Orbiting",
    description: "You spent three quarters of an hour in flight.",
    requirement: "Complete a session of at least 45 minutes.",
    icon: "🚀",
    category: "focus"
  },
  {
    id: "flow_pioneer",
    title: "Flow Pioneer",
    description: "Time bent around your focus. You entered the deep state.",
    requirement: "Complete a session of at least 60 minutes.",
    icon: "🌊",
    category: "focus"
  },
  {
    id: "deep_space_navigator",
    title: "Deep Space Navigator",
    description: "One hour and a half in flow state. Incredible endurance.",
    requirement: "Complete a session of at least 90 minutes.",
    icon: "🪐",
    category: "focus"
  },
  {
    id: "peak_flow",
    title: "Peak Flow",
    description: "Two hours of uninterrupted concentration. You climbed the mountain.",
    requirement: "Complete a session of at least 120 minutes.",
    icon: "🏔️",
    category: "focus"
  },

  // Category 2: Focus Timing & Quirks
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Catching the worm and the morning peace.",
    requirement: "Complete a session before 6:00 AM.",
    icon: "🌅",
    category: "quirks"
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "The world is quiet, but your mind is awake.",
    requirement: "Complete a session after 10:00 PM.",
    icon: "🦉",
    category: "quirks"
  },
  {
    id: "midnight_oil",
    title: "Midnight Oil",
    description: "Burning the candle at both ends. Write that code!",
    requirement: "Complete a session between 12:00 AM and 3:00 AM.",
    icon: "🕯️",
    category: "quirks"
  },
  {
    id: "midday_rush",
    title: "Midday Rush",
    description: "Focusing through the lunch hour rush.",
    requirement: "Complete a session between 12:00 PM and 2:00 PM.",
    icon: "☕",
    category: "quirks"
  },
  {
    id: "just_a_breath",
    title: "Just a Breath",
    description: "Stopping to take a breath. The clock stands still.",
    requirement: "Pause a focus session.",
    icon: "⏸️",
    category: "quirks"
  },
  {
    id: "unstoppable",
    title: "Unstoppable",
    description: "And we are back. Flow cannot be permanently broken.",
    requirement: "Resume a paused session.",
    icon: "🔄",
    category: "quirks"
  },
  {
    id: "tactical_retreat",
    title: "Tactical Retreat",
    description: "Sometimes we must retreat to fight another day.",
    requirement: "Stop a focus session before completion.",
    icon: "🛑",
    category: "quirks"
  },
  {
    id: "precision_intent",
    title: "Precision Intent",
    description: "A highly specific goal yields highly specific results.",
    requirement: "Complete a session with a title longer than 50 characters.",
    icon: "🎯",
    category: "quirks"
  },
  {
    id: "speedy_resume",
    title: "Speedy Resume",
    description: "A micro-pause. Blink and you missed it.",
    requirement: "Resume a paused session within 5 seconds.",
    icon: "🏎️",
    category: "quirks"
  },

  // Category 3: Customization & Settings
  {
    id: "interior_designer",
    title: "Interior Designer",
    description: "Fresh paint on the walls. Looks good.",
    requirement: "Change the default wallpaper preset.",
    icon: "🎨",
    category: "customization"
  },
  {
    id: "aesthetic_architect",
    title: "Aesthetic Architect",
    description: "Desktop beauty unlocked. A window to your own world.",
    requirement: "Save a custom wallpaper URL in Settings.",
    icon: "🖼️",
    category: "customization"
  },
  {
    id: "minimalist",
    title: "Minimalist",
    description: "No distractions, no noise. Just pure void.",
    requirement: "Set background wallpaper to 'Solid Color'.",
    icon: "🖤",
    category: "customization"
  },
  {
    id: "second_counter",
    title: "Second Counter",
    description: "Watching the particles of time sweep past.",
    requirement: "Toggle the 'Show Seconds' preference.",
    icon: "⏲️",
    category: "customization"
  },
  {
    id: "military_time",
    title: "Military Time",
    description: "00:00 to 23:59. Precise, organized, logical.",
    requirement: "Toggle the 'Use 24-Hour Format' preference.",
    icon: "🌐",
    category: "customization"
  },
  {
    id: "silent_focus",
    title: "Silent Focus",
    description: "Silence is golden. Inner peace achieved.",
    requirement: "Toggle 'Play completed alert sound' to disabled.",
    icon: "🔇",
    category: "customization"
  },
  {
    id: "tab_watcher",
    title: "Tab Watcher",
    description: "Keeping one eye on the clock tab.",
    requirement: "Toggle 'Show timer in tab title' preference.",
    icon: "📑",
    category: "customization"
  },
  {
    id: "tabula_rasa",
    title: "Tabula Rasa",
    description: "Clean slate. Back to the fundamentals.",
    requirement: "Reset all settings to default.",
    icon: "🔄",
    category: "customization"
  },

  // Category 4: Quick Links Dock
  {
    id: "ignition_sequence",
    title: "Ignition Sequence",
    description: "Mapping out your cockpit. The launchpad is ready.",
    requirement: "Add 1 quick link to the dashboard dock.",
    icon: "🚀",
    category: "links"
  },
  {
    id: "anchor_point",
    title: "Anchor Point",
    description: "Your primary destinations are docked.",
    requirement: "Add 5 quick links to the dashboard dock.",
    icon: "⚓",
    category: "links"
  },
  {
    id: "cockpit_commander",
    title: "Cockpit Commander",
    description: "Everything you need is within arm's reach.",
    requirement: "Add 10 quick links to the dashboard dock.",
    icon: "🎛️",
    category: "links"
  },
  {
    id: "organizer",
    title: "Organizer",
    description: "Perfect alignment. Everything in its right place.",
    requirement: "Reorder quick links using drag-and-drop.",
    icon: "🔀",
    category: "links"
  },
  {
    id: "renovator",
    title: "Renovator",
    description: "Updating the shortcuts to match your growth.",
    requirement: "Edit a quick link label or URL.",
    icon: "✏️",
    category: "links"
  },
  {
    id: "spring_cleaning",
    title: "Spring Cleaning",
    description: "Discarding the old to make room for the new.",
    requirement: "Delete a quick link.",
    icon: "🗑️",
    category: "links"
  },

  // Category 5: History & Notes
  {
    id: "scribe",
    title: "Scribe",
    description: "Writing history. Your achievements are recorded.",
    requirement: "Save 1 accomplishment note.",
    icon: "✍️",
    category: "history"
  },
  {
    id: "chronicle",
    title: "Chronicle",
    description: "A book of small wins. Page by page.",
    requirement: "Save 10 accomplishment notes.",
    icon: "📜",
    category: "history"
  },
  {
    id: "biographer",
    title: "Biographer",
    description: "Your daily focus is writing an epic novel of progress.",
    requirement: "Save 50 accomplishment notes.",
    icon: "📚",
    category: "history"
  },
  {
    id: "stoic_optimizer",
    title: "Stoic Optimizer",
    description: "Pivot, don't quit. Even interrupted paths lead to progress.",
    requirement: "Log an accomplishment note for a Stopped session.",
    icon: "🌱",
    category: "history"
  },
  {
    id: "historian",
    title: "Historian",
    description: "Looking back at the path you traveled.",
    requirement: "Search your session history using the Search bar.",
    icon: "🔍",
    category: "history"
  },
  {
    id: "time_traveler",
    title: "Time Traveler",
    description: "Isolating specific eras of your focus work.",
    requirement: "Apply a Timeframe Filter in History.",
    icon: "⏳",
    category: "history"
  },
  {
    id: "category_inspector",
    title: "Category Inspector",
    description: "Analyzing different styles of sessions.",
    requirement: "Apply a Status or Duration filter in History.",
    icon: "🏷️",
    category: "history"
  },
  {
    id: "resetter",
    title: "Resetter",
    description: "Zooming back out to see the full chronicle.",
    requirement: "Click 'Reset Filters' in history.",
    icon: "🧼",
    category: "history"
  },

  // Category 6: Statistics & Streaks
  {
    id: "analyst",
    title: "Analyst",
    description: "Looking at the numbers. Data-driven growth.",
    requirement: "Visit the Statistics tab.",
    icon: "📈",
    category: "stats"
  },
  {
    id: "spark",
    title: "Spark",
    description: "A small flame has been ignited.",
    requirement: "Complete focus sessions on 2 consecutive days.",
    icon: "🔥",
    category: "stats"
  },
  {
    id: "habitual_spark",
    title: "Habitual Spark",
    description: "Habits are formed by showing up. Day 3 and counting!",
    requirement: "Complete focus sessions on 3 consecutive days.",
    icon: "🔥",
    category: "stats"
  },
  {
    id: "volcano_streak",
    title: "Volcano Streak",
    description: "One week of continuous focus. You are an unstoppable force.",
    requirement: "Complete focus sessions on 7 consecutive days.",
    icon: "🌋",
    category: "stats"
  },
  {
    id: "perfect_score",
    title: "Perfect Score",
    description: "No stops, no interruptions. Pure execution.",
    requirement: "Achieve 100% completion rate across 5 consecutive sessions.",
    icon: "💯",
    category: "stats"
  }
];
