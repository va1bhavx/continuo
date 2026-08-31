export interface ToastDetail {
  message: string;
  type?: "default" | "achievement";
  achievement?: {
    title: string;
    description: string;
    icon: string;
  };
}

export function triggerToast(detail: ToastDetail) {
  window.dispatchEvent(new CustomEvent("app-show-toast", { detail }));
}

export function playAchievementSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Play a rising, happy arpeggio chord (C5 -> E5 -> G5 -> C6)
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.65);
  } catch (e) {
    console.warn("Failed to play achievement chime:", e);
  }
}
