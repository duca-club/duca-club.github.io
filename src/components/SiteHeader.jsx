import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import '../styles/navigation.css';

function MenuMark({ open = false }) {
  return <span className="menu-mark" data-open={open} aria-hidden="true">
    <Menu className="ui-icon menu-mark-open" aria-hidden="true" />
    <X className="ui-icon menu-mark-close" aria-hidden="true" />
  </span>;
}

export default function SiteHeader({ items, themeIcon, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const closeTimer = useRef(null);
  const openFrame = useRef(null);
  const scrollLock = useRef(null);
  const dialogId = useId();
  const titleId = useId();

  const unlockScroll = useCallback(() => {
    const locked = scrollLock.current;
    if (!locked) return;
    scrollLock.current = null;
    Object.assign(document.body.style, locked.body);
    document.documentElement.style.overflow = locked.htmlOverflow;
    window.scrollTo(locked.x, locked.y);
  }, []);

  const finishClose = useCallback((restoreFocus = true) => {
    clearTimeout(closeTimer.current);
    cancelAnimationFrame(openFrame.current);
    setIsOpen(false);
    dialogRef.current?.close();
    unlockScroll();
    if (restoreFocus && triggerRef.current?.offsetParent !== null) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [unlockScroll]);

  const closeMenu = useCallback(() => {
    cancelAnimationFrame(openFrame.current);
    clearTimeout(closeTimer.current);
    setIsOpen(false);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) finishClose();
    else closeTimer.current = setTimeout(() => finishClose(), 320);
  }, [finishClose]);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    clearTimeout(closeTimer.current);
    const body = document.body.style;
    scrollLock.current = {
      x: window.scrollX,
      y: window.scrollY,
      htmlOverflow: document.documentElement.style.overflow,
      body: {
        position: body.position, top: body.top, left: body.left,
        right: body.right, width: body.width, overflow: body.overflow,
      },
    };
    Object.assign(body, {
      position: 'fixed', top: `-${window.scrollY}px`, left: '0',
      right: '0', width: '100%', overflow: 'hidden',
    });
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    closeButtonRef.current?.focus({ preventScroll: true });
    // Let the closed position paint before starting the drawer and link motion.
    openFrame.current = requestAnimationFrame(() => {
      openFrame.current = requestAnimationFrame(() => setIsOpen(true));
    });
  };

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1051px)');
    const onResize = () => { if (desktop.matches) finishClose(false); };
    desktop.addEventListener('change', onResize);
    return () => {
      desktop.removeEventListener('change', onResize);
      clearTimeout(closeTimer.current);
      cancelAnimationFrame(openFrame.current);
      dialogRef.current?.close();
      unlockScroll();
    };
  }, [finishClose, unlockScroll]);

  const onBackdropClick = event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
  };

  return <>
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="site-brand" aria-label="DUCA home">
          <img src="/duca.png" alt="" width="36" height="36" />
          <span>DUCA</span>
        </a>
        <nav className="site-desktop-nav" aria-label="Main navigation">
          {items.map(item => <a
            key={item.href} href={item.href} target={item.target} rel="noopener"
            aria-current={item.bg === 'var(--ink)' ? 'page' : undefined}
            className="site-nav-link design-hover-0"
            style={{ color: item.color, background: item.bg }}
          >{item.label}{item.target === '_blank' && <>
            <ArrowUpRight className="ui-icon" aria-hidden="true" />
            <span className="navigation-sr-only"> (opens in a new tab)</span>
          </>}</a>)}
        </nav>
        <div className="site-header-actions">
          <button
            type="button" onClick={onToggleTheme} aria-label="Toggle dark mode"
            data-theme-toggle="" className="site-theme-toggle design-hover-1"
          >
            <span data-theme-sparks="" className="site-theme-sparks" />
            <span data-theme-knob="" className="site-theme-knob design-hover-2">{themeIcon}</span>
          </button>
          <a href="/join/" className="site-header-join design-hover-0">Join us</a>
          <button
            ref={triggerRef} type="button" className="site-menu-toggle"
            aria-label="Open navigation menu" aria-expanded={isOpen}
            aria-controls={dialogId} aria-haspopup="dialog" onClick={openMenu}
          ><MenuMark open={isOpen} /></button>
        </div>
      </div>
    </header>

    <dialog
      ref={dialogRef} id={dialogId} className="mobile-navigation"
      aria-labelledby={titleId} data-visible={isOpen ? 'true' : 'false'}
      onCancel={event => { event.preventDefault(); closeMenu(); }}
      onClick={onBackdropClick}
      onClose={() => {
        if (dialogRef.current?.open) return;
        setIsOpen(false);
        unlockScroll();
      }}
    >
      <div className="mobile-navigation-content">
        <div className="mobile-navigation-top">
          <a href="/" className="site-brand" aria-label="DUCA home" onClick={() => finishClose(false)}>
            <img src="/duca.png" alt="" width="36" height="36" /><span>DUCA</span>
          </a>
          <button ref={closeButtonRef} type="button" className="mobile-menu-close" aria-label="Close navigation menu" onClick={closeMenu}>
            <MenuMark open={isOpen} />
          </button>
        </div>

        <div className="mobile-navigation-intro">
          <h2 id={titleId}>Explore DUCA<span aria-hidden="true">.</span></h2>
        </div>

        <nav className="mobile-navigation-links" aria-label="Mobile navigation">
          {items.map((item, index) => {
            const active = item.bg === 'var(--ink)';
            return <a
              key={item.href} href={item.href} target={item.target} rel="noopener"
              aria-current={active ? 'page' : undefined}
              className="mobile-navigation-link"
              style={{ '--nav-order': index }} onClick={() => finishClose(false)}
            >
              <span className="mobile-navigation-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="mobile-navigation-label">{item.label}</span>
              {item.target === '_blank'
                ? <ArrowUpRight className="ui-icon mobile-navigation-arrow" aria-hidden="true" />
                : <ArrowRight className="ui-icon mobile-navigation-arrow" aria-hidden="true" />}
              {item.target === '_blank' && <span className="navigation-sr-only"> (opens in a new tab)</span>}
            </a>;
          })}
        </nav>

        <div className="mobile-navigation-footer">
          <a href="https://discord.com/invite/duca" target="_blank" rel="noopener noreferrer" className="mobile-discord-link" onClick={() => finishClose(false)}>
            Join the Discord <ArrowUpRight className="ui-icon" aria-hidden="true" />
            <span className="navigation-sr-only"> (opens in a new tab)</span>
          </a>
          <span className="mobile-navigation-note">LEARN. BUILD. BREAK. REPEAT.</span>
        </div>
      </div>
    </dialog>
  </>;
}
