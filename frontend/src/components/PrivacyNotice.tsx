import React from "react";
import { Shield, AlertCircle } from "lucide-react";

export const PrivacyNotice: React.FC = () => {
  return (
    <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Privacy Notice
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              <strong>Your privacy is our priority.</strong> JobFitAI operates
              with a strict no-data-retention policy:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                We do not store, save, or retain any of your personal
                information or CV data
              </li>
              <li>
                All uploaded documents are processed in real-time and
                immediately deleted after analysis
              </li>
              <li>No user accounts, profiles, or databases are maintained</li>
              <li>
                Your CV data exists only temporarily in your browser session
              </li>
              <li>
                All information is permanently removed when you close your
                browser or navigate away
              </li>
              <li>We do not use cookies to track or store personal data</li>
              <li>No third parties have access to your information</li>
            </ul>
            <div className="flex items-start gap-2 mt-3 p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-700 dark:text-blue-300 flex-shrink-0 mt-0.5" />
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Important:</strong> This is a demonstration application.
                All processing occurs client-side in your browser. Once you
                leave this page or close your browser, all data is permanently
                erased and cannot be recovered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
