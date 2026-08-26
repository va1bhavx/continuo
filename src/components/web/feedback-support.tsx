import { ChevronLeft, HelpCircle, Bug, Lightbulb, MessageSquare } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";

export default function FeedbackSupport() {
  const navigation = useNavigation();

  // Prefilled mailto link generators
  const bugMailto = "mailto:vaibhav.notifications@gmail.com?subject=Continuo%20Bug%20Report&body=Describe%20what%20happened,%20what%20you%20expected,%20and%20what%20you%20were%20doing%20when%20the%20bug%20occurred:";
  const ideaMailto = "mailto:vaibhav.notifications@gmail.com?subject=Continuo%20Feature%20Suggestion&body=Tell%20me%20about%20your%20idea%20or%20the%20feature%20you'd%20like%20to%20suggest:";
  const helloMailto = "mailto:vaibhav.notifications@gmail.com?subject=Hello%20from%20Continuo%20User&body=Hi%20Vaibhav,%0D%0A%0D%0A";

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
          <HelpCircle size={22} className="text-accent" />
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Help & Support</h1>
        </div>
        <p className="text-xs text-text-secondary">Help make Continuo better.</p>
      </div>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-text-secondary">
        <p className="text-base text-text-primary font-medium">
          Continuo is a small product, and feedback is a big part of how it improves.
        </p>

        <div className="flex flex-col gap-4 mt-2">
          {/* Card: Report Bug */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20">
            <div className="flex gap-3 text-left">
              <Bug size={20} className="text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">Found a bug?</span>
                <span className="text-xs text-text-secondary mt-0.5">
                  Tell me what happened, what you expected, and what you were doing when it occurred.
                </span>
              </div>
            </div>
            <a
              href={bugMailto}
              className="h-9 px-4 rounded-md text-xs font-semibold bg-surface-hover hover:bg-surface-2 text-text-primary border border-border/60 flex items-center justify-center shrink-0 transition-colors w-fit"
            >
              Report a bug &rarr;
            </a>
          </div>

          {/* Card: Suggest Feature */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20">
            <div className="flex gap-3 text-left">
              <Lightbulb size={20} className="text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">Have an idea?</span>
                <span className="text-xs text-text-secondary mt-0.5">
                  If there&apos;s something you&apos;d like Continuo to do, I&apos;d love to hear it.
                </span>
              </div>
            </div>
            <a
              href={ideaMailto}
              className="h-9 px-4 rounded-md text-xs font-semibold bg-surface-hover hover:bg-surface-2 text-text-primary border border-border/60 flex items-center justify-center shrink-0 transition-colors w-fit"
            >
              Suggest a feature &rarr;
            </a>
          </div>

          {/* Card: Hello */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg bg-surface/70 backdrop-blur-md border border-border-strong/20">
            <div className="flex gap-3 text-left">
              <MessageSquare size={20} className="text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">Just want to say hello?</span>
                <span className="text-xs text-text-secondary mt-0.5 font-normal">
                  That&apos;s welcome too. Contact the creator directly.
                </span>
              </div>
            </div>
            <a
              href={helloMailto}
              className="h-9 px-4 rounded-md text-xs font-semibold bg-surface-hover hover:bg-surface-2 text-text-primary border border-border/60 flex items-center justify-center shrink-0 transition-colors w-fit"
            >
              Contact the creator &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
