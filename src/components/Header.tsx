"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface HeaderProps {
  searchQuery?: string;
}

export default function Header({ searchQuery = "" }: HeaderProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const body = document.body;
    const shouldDisableScroll = isMenuOpen || isSearchOpen;
    body.classList.toggle("no-scroll-y", shouldDisableScroll);

    return () => {
      body.classList.remove("no-scroll-y");
    };
  }, [isMenuOpen, isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const timerId = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 150);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsSearchOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header className={`m-header with-picture js-header ${isMenuOpen ? "mobile-menu-opened" : ""}`}>
        <div className="m-mobile-topbar">
          <button
            type="button"
            className="m-icon-button in-mobile-topbar js-open-menu"
            aria-label="Abrir menú"
            onClick={() => setIsMenuOpen(true)}
          >
            <span className="icon-menu" aria-hidden="true"></span>
          </button>
          <Link href="/" className="m-logo in-mobile-topbar">
            <Image src="/content/images/2018/06/logo.png" alt="Café de por medio" width={100} height={50} />
          </Link>
          <button
            type="button"
            className="m-icon-button in-mobile-topbar js-open-search"
            aria-label="Abrir búsqueda"
            onClick={() => setIsSearchOpen(true)}
          >
            <span className="icon-search" aria-hidden="true"></span>
          </button>
        </div>

        <div className={`m-menu js-menu ${isMenuOpen ? "opened" : ""}`}>
          <button
            type="button"
            className="m-icon-button outlined as-close-menu js-close-menu"
            aria-label="Cerrar menú"
            onClick={() => setIsMenuOpen(false)}
          >
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
                  </ul>
                </nav>

                <div className="m-nav__right">
                  <button
                    type="button"
                    className="m-icon-button in-menu-main js-open-search"
                    aria-label="Abrir búsqueda"
                    onClick={() => setIsSearchOpen(true)}
                  >
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

      {mounted && (
        <div className={`m-search js-search ${isSearchOpen ? "opened" : ""}`} aria-hidden={!isSearchOpen}>
          <button
            type="button"
            className="m-icon-button outlined as-close-search js-close-search"
            aria-label="Cerrar búsqueda"
            onClick={() => setIsSearchOpen(false)}
          >
            <span className="icon-close" aria-hidden="true"></span>
          </button>
          <div className="m-search__content">
            <form className="m-search__form" action="/search" method="get" onSubmit={() => setIsSearchOpen(false)}>
              <fieldset>
                <span className="m-search-icon icon-search" aria-hidden="true"></span>
                <input
                  ref={searchInputRef}
                  className="m-input in-search js-input-search"
                  type="search"
                  name="q"
                  placeholder="Buscar artículos"
                  defaultValue={searchQuery}
                  autoComplete="off"
                />
              </fieldset>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
