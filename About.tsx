import { Link } from 'react-router-dom';
import ChatWidget from './ChatWidget';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
              Aura.
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-sm font-medium hover:text-stone-600 transition-colors">Home</Link>
              <Link to="/services" className="text-sm font-medium hover:text-stone-600 transition-colors">Services</Link>
              <Link to="/about" className="text-sm font-medium hover:text-stone-600 transition-colors">About</Link>
              <Link to="/admin" className="text-sm font-medium hover:text-stone-600 transition-colors">Admin</Link>
            </nav>
            <button className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-serif font-bold mb-4">Aura.</h3>
            <p className="text-sm">Premium AI-powered digital agency crafting elegant experiences.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Web Design</li>
              <li>AI Automation</li>
              <li>Brand Strategy</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy (GDPR)</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
      </footer>
      
      <ChatWidget />
    </div>
  );
}
