import { ChevronLeft, FileText } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";

export default function TermsOfUse() {
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
          <FileText size={22} className="text-accent" />
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Terms of Use</h1>
        </div>
        <p className="text-xs text-text-secondary">Last updated: August 26, 2026</p>
      </div>

      {/* Terms Text */}
      <div className="flex flex-col gap-6 text-sm leading-relaxed text-text-secondary">
        <p>Welcome to Continuo.</p>
        <p>By installing or using Continuo, you agree to these Terms of Use.</p>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Using Continuo</h2>
          <p>Continuo is provided as a productivity and personal organization tool.</p>
          <p>You may use Continuo for personal and lawful purposes.</p>
          <p>You are responsible for how you use the extension and for the information you choose to store within it.</p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Your data</h2>
          <p>You retain responsibility for the information you enter into Continuo.</p>
          <p>
            Continuo V1 is designed to store your data locally in your browser. You should maintain your own backups of any information that is important to you.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Availability</h2>
          <p>
            We aim to keep Continuo reliable and functional, but we do not guarantee that the extension will always be available, uninterrupted, or error-free.
          </p>
          <p>
            Chrome, browser updates, operating-system changes, third-party services, or other technical circumstances may affect functionality.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Changes to Continuo</h2>
          <p>We may modify, improve, add, or remove features from Continuo over time.</p>
          <p>We may also discontinue the extension in the future.</p>
          <p>
            When changes materially affect how user data is handled, we will update the relevant privacy information.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Intellectual property</h2>
          <p>
            Continuo, including its branding, logo, design, source code, and original content, belongs to its respective owner unless otherwise stated.
          </p>
          <p>Nothing in these Terms grants you ownership of Continuo&apos;s intellectual property.</p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Third-party services</h2>
          <p>
            Continuo may rely on third-party platforms or services for distribution or functionality.
          </p>
          <p>Those services may have their own terms and privacy policies.</p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Disclaimer</h2>
          <p>
            Continuo is provided on an &quot;as is&quot; and &quot;as available&quot; basis to the extent permitted by applicable law.
          </p>
          <p>
            Continuo is not intended to provide professional, legal, medical, financial, or other specialized advice.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Contact</h2>
          <p>Questions about these Terms can be sent to:</p>
          <a
            href="mailto:vaibhav.notifications@gmail.com"
            className="text-accent hover:underline font-semibold w-fit"
          >
            vaibhav.notifications@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
}
