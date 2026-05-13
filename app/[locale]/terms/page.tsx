export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-20 max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading font-bold mb-8">Terms of Service</h1>
      <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">
        <p>By accessing xojuli.com, you confirm that you are at least 18 years old and agree to these terms.</p>
        <p>All content on this website is owned by Juli and may not be reproduced, distributed, or transmitted without prior written permission.</p>
        <p>This website contains links to third-party platforms (Fanvue, Telegram, Instagram). We are not responsible for the content or practices of these platforms.</p>
        <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of any changes.</p>
        <p>For questions, contact us through the provided channels.</p>
      </div>
    </div>
  );
}
