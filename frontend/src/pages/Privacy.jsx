import React from "react";
import Container from "../components/common/Container";
import BackButton from "../components/common/BackButton";
import PageHeader from "../components/common/PageHeader";

function Privacy() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-16">

        <BackButton />

        <PageHeader
          title="Privacy"
          highlight="Policy"
          subtitle="Your data matters to us at Ramtek Bazar."
        />

        <div className="space-y-10 text-slate-400 leading-relaxed mt-12">

          <section>
            <h2 className="text-xl font-semibold text-slate-200 mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect basic information required to list your products,
              such as your name, phone number, product details, and images.
              Your phone number may be visible to buyers so they can contact
              you directly via call or WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-200 mb-3">
              2. How We Use Your Data
            </h2>
            <p>
              Your data is used only to display your listings on Ramtek Bazar.
              We do not sell, rent, or trade your personal information to
              third-party marketing companies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-200 mb-3">
              3. Image Storage
            </h2>
            <p>
              Product images are securely stored using Cloudinary. By uploading
              content, you confirm that you have the right to share the images
              publicly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-200 mb-3">
              4. Data Security
            </h2>
            <p>
              We implement reasonable security practices to protect your
              information. However, as an online platform, we cannot guarantee
              absolute security of data transmission over the internet.
            </p>
          </section>

          <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              User Responsibility
            </h2>
            <p className="text-sm text-slate-300">
              Ramtek Bazar is a hyper-local marketplace. Users are responsible
              for verifying buyers and sellers before transactions. Always meet
              in safe public locations and avoid advance payments to unknown
              individuals.
            </p>
          </section>

        </div>

        <p className="mt-14 text-xs text-slate-600 italic">
          Last Updated: February 2026
        </p>

      </div>
    </Container>
  );
}

export default Privacy;