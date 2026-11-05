"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { IconButton } from "../../atoms/icon-button";

type HeaderMenuProps = {
  navigationLabel: string;
  children: ReactNode;
};

/**
 * A modal dialog, because the full-screen menu blocks the page. The browser provides the
 * focus containment, Esc and back-gesture dismissal, and focus return to the trigger.
 */
export function HeaderMenu({ navigationLabel, children }: HeaderMenuProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const closeOnLinkChoice = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) dialog.current?.close();
  };

  return (
    <>
      <IconButton
        className="mk-header-menu-trigger"
        label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M1 4.5h14" />
          <path d="M1 11.5h14" />
        </svg>
      </IconButton>
      <dialog
        ref={dialog}
        className="mk-header-menu"
        aria-label="Menu"
        onClick={closeOnLinkChoice}
        onClose={() => setOpen(false)}
      >
        {/* First in the dialog, so it takes focus on opening. */}
        <IconButton className="mk-header-menu-close" label="Close menu" onClick={() => dialog.current?.close()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M2 2l12 12" />
            <path d="M14 2L2 14" />
          </svg>
        </IconButton>
        <nav aria-label={navigationLabel}>
          <ul className="mk-header-menu-links">{children}</ul>
        </nav>
      </dialog>
    </>
  );
}
