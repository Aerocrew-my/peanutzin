import { SimplePage } from "@/components/pages";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("About", "Meet PEANUTZIN, an independent Malaysian publishing and cultural media project.", "/about");
export default function About() { return <SimplePage title="Stories with a point of view" eyebrow="About PEANUTZIN" copy="Independent publishing and cultural media from Malaysia, made for curious people and generous communities." />; }
