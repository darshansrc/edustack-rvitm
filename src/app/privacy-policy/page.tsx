

import React from "react";
import { BsStack } from "react-icons/bs";

const EdustackPrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg  w-full">
        <h4 className="font-poppins flex flex-row  my-6 font-semibold  text-[24px] text-gray-800 mt-8">
          <BsStack className="w-10 h-10 text-[#0577fb] pr-2" /> Edustack
        </h4>
        <h1 className="text-2xl font-bold mb-4">Privacy Policy for Edustack</h1>

        <p className="text-gray-700 mb-4">Last Updated: 14th Dec, 2023</p>

        <p className="text-gray-700 mb-4">
          Thank you for using Edustack! This privacy policy explains how we
          collect, use, and protect your information when you use our mobile
          application.
        </p>

        <h2 className="text-xl font-bold mb-2">
          Information We Do Not Collect:
        </h2>
        <p className="text-gray-700 mb-4">
          Edustack is designed to operate without collecting any personal or
          sensitive user data. We do not collect, store, or process any
          information about users, including but not limited to:
        </p>
        <ul className="list-disc pl-6">
          <li>Personal identification information</li>
          <li>Contact information</li>
          <li>Academic records</li>
        </ul>

        <h2 className="text-xl font-bold mb-2 mt-4">
          Information Automatically Collected:
        </h2>
        <p className="text-gray-700 mb-4">
          Our app does not automatically collect any information from users.
        </p>

        <h2 className="text-xl font-bold mb-2 mt-4">Information Security:</h2>
        <p className="text-gray-700 mb-4">
          We take the security of your information seriously. While we do not
          collect any user data, we implement security measures to protect any
          non-personal data associated with the app functionality.
        </p>

        <h2 className="text-xl font-bold mb-2 mt-4">Third-Party Services:</h2>
        <p className="text-gray-700 mb-4">
          Edustack does not use any third-party services that collect user data.
          We do not integrate with external platforms that may compromise user
          privacy.
        </p>

        <h2 className="text-xl font-bold mb-2 mt-4">
          Changes to this Privacy Policy:
        </h2>
        <p className="text-gray-700 mb-4">
          We may update our Privacy Policy from time to time. Any changes to
          this policy will be reflected on this page.
        </p>

        <h2 className="text-xl font-bold mb-2 mt-4">Contact Us:</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions or concerns about our privacy practices,
          please contact us at rvitm@edu-stack.com.
        </p>

        <p className="text-gray-700 mt-4">
          By using Edustack, you consent to our privacy policy.
        </p>

        <p className="text-gray-700 mt-4">
          This privacy policy is compliant with applicable data protection laws
          and regulations.
        </p>
      </div>
    </div>
  );
};

export default EdustackPrivacyPolicy;
