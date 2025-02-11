import { Link } from "wouter";
import { Scale } from "lucide-react";

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
        </div>
      </div>
    </header>
  );
}