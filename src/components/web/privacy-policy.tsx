import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useNavigation } from "../../context/navigation-context";

export default function PrivacyPolicy() {
  const navigation = useNavigation();

  return (
    <div className="flex flex-col gap-8 px-4 py-8 max-w-2xl mx-auto animate-fade-in text-left">
      {/* Back Button */}
      <button
        onClick={() => navigation.setView("settings")}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors w-fit text-sm font-medium cursor-pointer bg-transparent border-0 outline-none"
      >
        <ChevronLeft size={18} />
        <span>Back to settings</span>
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <ShieldCheck size={22} className="text-accent" />
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Privacy Policy</h1>
        </div>
        <p className="text-xs text-text-secondary">Last updated: August 26, 2026</p>
      </div>

      {/* Policy Text */}
      <div className="flex flex-col gap-6 text-sm leading-relaxed text-text-secondary">
        <p>
          Continuo (&quot;Continuo&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a Chrome extension designed to provide a focused New Tab experience.
        </p>
        <p>
          We believe your personal work information should remain yours. Continuo V1 is designed to store your personal Continuo data locally in your browser.
        </p>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Information Continuo stores</h2>
          <p>Depending on the features you use, Continuo may store:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>Your current focus/task</li>
            <li>Focus session history</li>
            <li>Session start and end times</li>
            <li>Quick captures or notes you create</li>
            <li>Links you choose to save</li>
            <li>Your appearance and extension preferences</li>
            <li>Other settings required for Continuo to function</li>
          </ul>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Where your data is stored</h2>
          <p>
            In V1, this information is stored locally using Chrome&apos;s extension storage.
          </p>
          <p className="font-semibold text-text-primary">
            Your Continuo data is not uploaded to a Continuo server.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Information we collect</h2>
          <p>Continuo does not intentionally collect:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>Your browsing history</li>
            <li>The websites you visit</li>
            <li>The contents of webpages you view</li>
            <li>Passwords or authentication information</li>
            <li>Personal communications</li>
            <li>Your files</li>
            <li>Precise location information</li>
          </ul>
          <p>
            Continuo does not require an account to use its core functionality.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">How your information is used</h2>
          <p>
            Your locally stored information is used only to provide Continuo&apos;s features, including displaying your current focus, maintaining session history, restoring your settings, and providing the New Tab experience.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Data sharing</h2>
          <p>
            Continuo V1 does not sell, rent, or share your stored Continuo data with advertisers, data brokers, or other third parties.
          </p>
          <p>
            Because the data described above is stored locally in your browser and is not transmitted to our servers in V1, we do not have access to that data.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Analytics and tracking</h2>
          <p>
            Continuo V1 does not use advertising trackers or sell user data.
          </p>
          <p>
            If analytics or other third-party services are introduced in a future version, this Privacy Policy will be updated to explain what information is collected, why it is collected, and how it is handled.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Deleting your data</h2>
          <p>
            You can remove your Continuo data through the extension&apos;s data/settings controls.
          </p>
          <p>
            Uninstalling Continuo may also remove its locally stored extension data according to Chrome&apos;s storage behavior.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Third-party services</h2>
          <p>
            Continuo V1 does not intentionally transmit your Continuo data to third-party services.
          </p>
          <p>
            The extension is distributed through the Chrome Web Store, which is operated by Google. Google&apos;s own services and privacy practices are governed by Google&apos;s applicable policies.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Changes to this policy</h2>
          <p>
            If Continuo&apos;s data practices change, we will update this Privacy Policy and the &quot;Last updated&quot; date.
          </p>
        </section>

        {/* Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Contact</h2>
          <p>
            If you have questions about this Privacy Policy or Continuo&apos;s data practices, contact:
          </p>
          <a
            href="mailto:vaibhav.notifications@gmail.com"
            className="text-accent hover:underline font-semibold w-fit"
          >
            vaibhav.notifications@gmail.com
          </a>
        </section>

        {/* Chrome Store Compliance Declaration */}
        <p className="border-t border-border/40 pt-4 mt-2 text-xs italic text-text-tertiary">
          Continuo&apos;s use of information received through Chrome APIs complies with the Chrome Web Store User Data Policy, including the Limited Use requirements.
        </p>
      </div>
    </div>
  );
}
