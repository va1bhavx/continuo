import { ChevronLeft, Info, Heart, ArrowRight } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";

export default function AboutContinuo() {
  const navigation = useNavigation();

  return (
    <div className="flex flex-col gap-8 px-4 py-8 max-w-2xl mx-auto animate-fade-in text-left">
      {/* Back Button / Navigation Breadcrumbs */}
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <button
          onClick={() => navigation.setView("settings")}
          className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer bg-transparent border-0 outline-none font-medium"
        >
          <ChevronLeft size={18} />
          <span>Back to settings</span>
        </button>
        <span className="text-text-tertiary">/</span>
        <button
          onClick={() => navigation.setView("main")}
          className="hover:text-text-primary transition-colors cursor-pointer bg-transparent border-0 outline-none font-medium"
        >
          Back to New Tab
        </button>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <Info size={20} className="text-accent" />
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">About Continuo</h1>
        </div>
        <p className="text-accent text-sm font-medium tracking-wide">Keep the work going.</p>
      </div>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-text-secondary">
        {/* Core Intro */}
        <p className="text-base text-text-primary font-medium">
          Continuo is a simple New Tab built around one idea: help you remember what you came here to do.
        </p>

        {/* Why I built it */}
        <section className="flex flex-col gap-3">
          <h2 className="text-md font-bold text-text-primary">Why I built Continuo</h2>
          <p>
            I often found myself opening a new tab with a clear intention, only to end up somewhere completely different a few minutes later.
          </p>
          <p>
            One tab became another. A quick search became a rabbit hole. And somewhere along the way, I lost track of what I actually wanted to work on.
          </p>
          <p>
            So I built Continuo as a small reminder.
          </p>
          <p>
            Instead of giving you another feed, another distraction, or another reason to browse, Continuo puts your current intention back in front of you.
          </p>
          <p className="font-semibold text-text-primary mt-1">
            Open a tab. Remember why you're here. Continue.
          </p>
        </section>

        {/* Note from creator */}
        <section className="flex flex-col gap-3 p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20">
          <h2 className="text-md font-bold text-text-primary">A note from the creator</h2>
          <p>
            I didn't build Continuo to make you more productive every minute of the day.
          </p>
          <p>
            I built it because I wanted something small that could help me stay connected to the things I had already decided were worth doing.
          </p>
          <div className="flex flex-col gap-1.5 py-2 pl-3 border-l-2 border-accent/40 font-medium text-text-primary">
            <span>No productivity scores.</span>
            <span>No pressure.</span>
            <span>No complicated systems.</span>
          </div>
          <p>
            Just a quiet reminder to come back to your work.
          </p>
          <p>
            I hope Continuo helps you do the same.
          </p>
          <p className="font-semibold text-text-primary mt-2">— Vaibhav</p>
        </section>

        {/* What Continuo gives you */}
        <section className="flex flex-col gap-3">
          <h2 className="text-md font-bold text-text-primary">What Continuo gives you</h2>
          <ul className="flex flex-col gap-2">
            {[
              "A place to set your current focus",
              "Simple focus sessions with history",
              "Quick capture for thoughts and ideas",
              "Easy access to useful links",
              "A new tab that stays out of your way"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <ArrowRight size={14} className="text-accent shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* The Idea quote */}
        <section className="text-center py-4 border-t border-b border-border/40 font-medium text-text-primary text-base italic">
          "You don't always need more motivation.
          <br />
          Sometimes you just need to remember why you started."
        </section>

        {/* Footer info */}
        <div className="flex flex-col items-center gap-1.5 pt-4 text-xs text-text-tertiary">
          <span className="font-semibold text-text-secondary">Continuo v0.1.0</span>
          <span className="flex items-center gap-1">
            Built with care. <Heart size={10} className="text-accent fill-accent" />
          </span>
        </div>
      </div>
    </div>
  );
}
