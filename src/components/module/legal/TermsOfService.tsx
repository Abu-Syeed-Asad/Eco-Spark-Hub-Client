import LegalPage from "./LegalPage";

const termsSections = [
  {
    title: "Acceptance of terms",
    text: [
      "By accessing or using Eco Spark Hub, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
      "If you do not agree with any part of these terms, you should not use the platform.",
    ],
  },
  {
    title: "User responsibilities",
    text: [
      "You are responsible for the accuracy of the information you provide and for keeping your account secure and confidential.",
      "You agree not to post harmful, misleading, illegal, or abusive content, and not to interfere with the security or functionality of the platform.",
    ],
  },
  {
    title: "Content and community standards",
    text: [
      "Users may submit posts, comments, and other materials for community engagement. We reserve the right to review, remove, or restrict content that violates these terms or community standards.",
      "By submitting content, you represent that you have the right to share it and that it does not infringe on anyone else's rights.",
    ],
  },
  {
    title: "Service availability",
    text: [
      "We aim to keep the platform available and reliable, but we cannot guarantee uninterrupted service or error-free operation.",
      "We may update or modify features, suspend access, or discontinue parts of the service without prior notice when necessary.",
    ],
  },
  {
    title: "Limitation of liability",
    text: "Eco Spark Hub is provided on an as-is basis. We are not liable for indirect, incidental, or consequential damages arising from the use or inability to use the service, including data loss or system disruptions.",
  },
  {
    title: "Updates to these terms",
    text: "We may revise these terms from time to time. Continued use of the service after changes are posted means you accept the updated terms.",
  },
];

export default function TermsOfService() {
  return (
    <LegalPage
      badge="Terms of service"
      title="Guidelines for using Eco Spark Hub"
      intro="These terms explain the expectations, responsibilities, and limits that apply when using Eco Spark Hub and participating in our community."
      sections={termsSections}
    />
  );
}
