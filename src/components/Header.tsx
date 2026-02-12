import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="m-header with-picture js-header">
      <div className="m-mobile-topbar">
        <button className="m-icon-button in-mobile-topbar js-open-menu" aria-label="Abrir menú">
          <span className="icon-menu" aria-hidden="true"></span>
        </button>
        <Link href="/" className="m-logo in-mobile-topbar">
          <Image src="/content/images/2018/06/logo.png" alt="Café de por medio" width={100} height={50} />
        </Link>
        <button className="m-icon-button in-mobile-topbar js-open-search" aria-label="Abrir búsqueda">
          <span className="icon-search" aria-hidden="true"></span>
        </button>
      </div>

      <div className="m-menu js-menu">
        <button className="m-icon-button outlined as-close-menu js-close-menu" aria-label="Cerrar menú">
          <span className="icon-close"></span>
        </button>
        
        <div className="m-menu__main">
          <div className="l-wrapper">
            <div className="m-nav js-main-nav">
              <nav className="m-nav__left js-main-nav-left" role="navigation" aria-label="Menú principal">
                <ul>
                  <li className="only-desktop">
                    <Link href="/" className="m-logo">
                      <Image src="/content/images/2018/06/logo.png" alt="Café de por medio" width={100} height={50} />
                    </Link>
                  </li>
                  <li className="nav-inicio nav-current">
                    <Link href="/">Inicio</Link>
                  </li>
                  <li className="nav-contratanos">
                    <a href="https://coffeedevs.com">Contrátanos</a>
                  </li>
                  <li className="nav-proba-digitalocean">
                    <a href="https://m.do.co/c/172037f52ff4">Probá DigitalOcean</a>
                  </li>
                  <li className="nav-invitanos-un-cafecito">
                    <a href="https://cafecito.app/coffeedevs">Invitanos un cafecito!</a>
                  </li>
                  <li className="submenu-option js-submenu-option">
                    <button className="m-icon-button in-menu-main more js-toggle-submenu" aria-label="Abrir submenú">
                      <span className="icon-more" aria-hidden="true"></span>
                    </button>
                    <div className="m-submenu js-submenu">
                      <div className="l-wrapper in-submenu">
                        <section className="m-recent-articles">
                          <h3 className="m-submenu-title in-recent-articles">Artículos recientes</h3>
                        </section>
                        <section className="m-tags">
                          <h3 className="m-submenu-title">Etiquetas</h3>
                          <ul>
                            <li><Link href="/tag/laravel/">laravel</Link></li>
                            <li><Link href="/tag/api/">api</Link></li>
                            <li><Link href="/tag/blade/">blade</Link></li>
                          </ul>
                        </section>
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
              
              <div className="m-nav__right">
                <button className="m-icon-button in-menu-main js-open-search" aria-label="Abrir búsqueda">
                  <span className="icon-search" aria-hidden="true"></span>
                </button>
                <div className="m-toggle-darkmode js-tooltip" data-tippy-content="Alternar modo oscuro" tabIndex={0}>
                  <label htmlFor="toggle-darkmode" className="sr-only">
                    Alternar modo oscuro
                  </label>
                  <input id="toggle-darkmode" type="checkbox" className="js-toggle-darkmode" />
                  <div>
                    <span className="icon-moon moon" aria-hidden="true"></span>
                    <span className="icon-sunny sun" aria-hidden="true"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}