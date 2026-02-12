import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="m-footer">
      <div className="m-footer__content">
        <nav className="m-footer-social">
          <a href="https://www.facebook.com/coffeedevs" target="_blank" rel="noopener" aria-label="Facebook">
            <span className="icon-facebook" aria-hidden="true"></span>
          </a>
          <a href="https://twitter.com/coffeedevs" target="_blank" rel="noopener" aria-label="Twitter">
            <span className="icon-twitter" aria-hidden="true"></span>
          </a>
          <Link href="/rss" aria-label="RSS">
            <span className="icon-rss" aria-hidden="true"></span>
          </Link>
        </nav>
        
        <p className="m-footer-copyright">
          <span>Café de por medio &copy; 2022</span>
        </p>
      </div>
    </footer>
  );
}