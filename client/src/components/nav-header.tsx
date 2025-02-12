import { Link } from "wouter";
import { Scale } from "lucide-react";
import { SiGithub } from "react-icons/si";

export default function NavHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-2 text-[#003366] hover:text-[#4A90E2]">
              <Scale className="h-6 w-6" />
              <span className="font-serif text-xl">Reason To Sue</span>
            </a>
          </Link>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/kianerfaan/ReasonToSue.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#003366] hover:text-[#4A90E2]"
            >
              <SiGithub className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}