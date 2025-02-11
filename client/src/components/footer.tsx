import { Link } from "wouter";
import { SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-4">
          <div className="text-xs text-gray-600 max-w-4xl mx-auto text-center leading-relaxed">
            The content on ReasonToSue is for general informational purposes only and does not constitute legal advice. 
            No attorney-client relationship is created by your use of this website. Always consult a licensed attorney 
            for advice regarding your specific legal situation. By using this website, you agree that any reliance on 
            the information provided is at your own risk, and ReasonToSue, its owners, and affiliates shall not be 
            held liable for any errors or omissions.
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div>
              © {new Date().getFullYear()} Reason To Sue. All rights reserved.
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-2">
              Built by{" "}
              <a
                href="https://x.com/kianerfaan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#003366] hover:text-[#4A90E2] flex items-center gap-1"
              >
                Kian Erfaan <SiX className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}