import LegalPage from "./LegalPage";

const privacySections = [
  {
    title: "Information we collect",
    text: [
      "We collect information you provide directly to us, such as your name, email address, profile details, and content you submit to the platform.",
      "We also gather usage data such as device information, browser type, visit activity, and interactions that help us improve the experience and maintain platform security.",
    ],
  },
  {
    title: "How we use your information",
    text: [
      "We use your information to operate the platform, personalize your experience, respond to your requests, manage posts and user accounts, and improve the quality of our services.",
      "We may also use your information to send product updates, service announcements, and security-related notices when necessary.",
    ],
  },
  {
    title: "Sharing and disclosure",
    text: [
      "We do not sell personal data. We may share information with trusted service providers who help us run the platform, as well as when required by law or to protect the rights and safety of our users.",
      "Public content, profile details, and community activity may be visible to other users depending on the settings you choose.",
    ],
  },
  {
    title: "Your choices",
    text: [
      "You can review and update your account details at any time from your profile settings. You may also choose to limit certain communications and manage cookie preferences in supported browsers.",
      "If you want to request deletion or access to your personal information, please contact us using the contact details listed on the site.",
    ],
  },
  {
    title: "Security",
    text: "We take reasonable steps to protect personal information from unauthorized access, change, or disclosure. However, no method of transmission or electronic storage is completely secure, and we cannot guarantee absolute security.",
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      badge="Privacy policy"
      title="Your privacy matters to us"
      intro="This privacy policy explains how Eco Spark Hub collects, uses, and protects information related to your account, content, and visits to the platform."
      sections={privacySections}
    />
  );
}
