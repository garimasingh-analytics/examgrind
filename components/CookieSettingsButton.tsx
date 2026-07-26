"use client";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="hover:text-cocoa-900"
      onClick={() => window.dispatchEvent(new Event("examgrind:open-cookie-settings"))}
    >
      Cookie settings
    </button>
  );
}
