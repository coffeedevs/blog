import Link from 'next/link';
import { Facebook, Twitter, Rss } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="m-footer">
      <div className="m-footer__content">
        <nav className="m-footer-social">
          <a href="https://www.facebook.com/coffeedevs" target="_blank" rel="noopener" aria-label="Facebook">
            <Facebook size={18} aria-hidden="true" />
          </a>
          <a href="https://twitter.com/coffeedevs" target="_blank" rel="noopener" aria-label="Twitter">
            <Twitter size={18} aria-hidden="true" />
          </a>
          <Link href="/rss.xml" aria-label="RSS">
            <Rss size={18} aria-hidden="true" />
          </Link>
        </nav>
        
        <p className="m-footer-copyright">
          <span>Café de por medio &copy; {new Date().getFullYear()}</span>
          <span> &mdash; Un blog de <a href="https://coffeedevs.com" rel="noopener">CoffeeDevs</a></span>
        </p>
      </div>
    </footer>
  );
}
