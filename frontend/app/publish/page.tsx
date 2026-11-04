import { PublishForm } from "@/components/publish/PublishForm";

export default function PublishPage() {
  return (
    <section className="content-page narrow">
      <p className="eyebrow">ADD A NEW CORNER</p>
      <h1>Make a page for the <em>small web.</em></h1>
      <p className="page-lede">Choose a publisher, give your page its own .zz address, and write it in HTML.</p>
      <div className="security-callout"><span>✳</span><p>Your page is cleaned before it is saved and displayed in an isolated frame. Scripts, forms, images and external navigation are not supported.</p></div>
      <PublishForm />
    </section>
  );
}
