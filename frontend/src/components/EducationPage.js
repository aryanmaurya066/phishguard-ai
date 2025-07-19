import React from 'react';
import Layout from './Layout';

export default function EducationPage() {
  return (
    <Layout>
      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">🎓 Phishing Education</h1>

        {/* Video Explainer */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">🎥 Watch: What is Phishing?</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/lxL-CuLpggM?si=NU1F2u6iX3JvzGae&amp;start=4" 
            title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
        </div>

        {/* Infographic */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">🖼️ Infographic: How to Detect Phishing</h2>
          <img
            src="https://imagecdn.spazioweb.it/4b/c0/4bc0a5b0-7ce7-4551-913b-fdea6682e181.PNG"
            alt="Phishing infographic"
            className="w-full max-w-2xl mx-auto rounded-md"
          />
        </div>

        {/* Types of Phishing */}
        <h2 className="text-lg font-semibold text-indigo-600 mb-3">Common Types of Phishing</h2>
        <ul className="list-disc ml-6 text-gray-800 space-y-2">
          <li><strong>Email Spoofing:</strong> Attackers pretend to be someone you trust and ask for personal information.</li>
          <li><strong>Spear Phishing:</strong> Highly targeted attacks based on your job, location, or personal interests.</li>
          <li><strong>Clone Phishing:</strong> Replicating a legitimate message and replacing links or attachments.</li>
          <li><strong>Website Phishing:</strong> Fake websites that steal credentials by mimicking real login pages.</li>
        </ul>

        {/* Staey Safe Tips */}
        <h2 className="mt-6 text-lg font-semibold text-indigo-600">How to Stay Safe</h2>
        <ul className="list-disc ml-6 text-gray-800 space-y-2">
          <li>Never click on suspicious links or open unknown attachments.</li>
          <li>Always verify the sender's email address and website URLs.</li>
          <li>Use two-factor authentication (2FA) where possible.</li>
          <li>Keep your software and antivirus up to date.</li>
        </ul>

        {/* Quiz/Progress Tracker */}
        {/* <div className="mt-8">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">🧠 Take the Quiz</h2>
          <a
            href="https://www.phishingquiz.withgoogle.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            ➤ Google Phishing Quiz
          </a>
        </div> */}

        {/* Download Certificate */}
        {/* <div className="mt-8">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">📄 Get Your Certificate</h2>
          <a
            href="/downloads/phishing-awareness-certificate.pdf"
            download
            className="inline-block mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Download Certificate PDF
          </a>
        </div> */}

        <p className="mt-6 text-sm text-gray-500 italic">
          "Think before you click. Pause before you trust."
        </p>
      </div>
    </Layout>
  );
}
