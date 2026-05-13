export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-20 max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">
        <p>This privacy policy describes how xojuli.com collects and uses information.</p>
        <h2 className="text-lg font-bold text-[var(--text)] pt-4">Information We Collect</h2>
        <p>We use cookies and local storage to remember your age verification, theme preference, and language selection.</p>
        <p>We use Google Analytics and Meta Pixel to understand how visitors use our site. These services may collect anonymized usage data.</p>
        <h2 className="text-lg font-bold text-[var(--text)] pt-4">Third-Party Links</h2>
        <p>Our site contains links to Fanvue, Telegram, and Instagram. These platforms have their own privacy policies.</p>
        <h2 className="text-lg font-bold text-[var(--text)] pt-4">Your Choices</h2>
        <p>You can clear your browser&apos;s local storage at any time to reset preferences. You can also disable cookies in your browser settings.</p>
        <h2 className="text-lg font-bold text-[var(--text)] pt-4">Contact</h2>
        <p>For privacy-related questions, please reach out through our social channels.</p>
      </div>
    </div>
  );
}
