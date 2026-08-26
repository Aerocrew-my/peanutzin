import { SimplePage } from "@/components/pages";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Contact", "Share a story, event or book with the PEANUTZIN team.", "/contact");
export default function Contact() { return <SimplePage title="Come say hello" eyebrow="Contact" copy="Have a story, event or book we should know about? We would love to hear from you." />; }
