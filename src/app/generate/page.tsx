import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GeneratorForm from "@/components/GeneratorForm";

export const metadata = {
  title: "Generate a Document — HakiDocs",
};

export default function GeneratePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
            ⚖️ HakiDocs Generator
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-haki-950 sm:text-4xl">
            Generate your legal document
          </h1>
          <div className="gold-rule mx-auto mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-haki-500">
            Tell us what happened in your own words. We&apos;ll turn it into a
            structured, professional document — with a Swahili summary you can
            understand.
          </p>
        </div>
        <GeneratorForm />
      </main>
      <Footer />
    </>
  );
}
