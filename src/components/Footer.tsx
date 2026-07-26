export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-white">Digital Humans</p>
            <p className="mt-1 text-sm text-gray-400">
              The marketplace for AI representations of professional expertise.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href="https://cto.new"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Built with cto.new
            </a>
            <a
              href="mailto:hello@digitalhumans.example.com"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Digital Humans. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
