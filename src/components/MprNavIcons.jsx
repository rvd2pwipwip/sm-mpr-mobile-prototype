/**
 * Bottom-nav icons: inline SVG, `currentColor` for theme tokens.
 * Replace paths when final assets land in `public/icons/` (see docs/design-tokens).
 */

export function MprNavIconHome({ className, ...rest }) {
  return (
    <svg
      className={className}
      viewBox="0 0 31 31.1683"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.0223 1.02798C14.3898 -0.342661 16.6102 -0.342656 17.9777 1.02798L29.9777 13.0556C30.6324 13.7118 31 14.6008 31 15.5276V27.6683C31 29.6013 29.433 31.1683 27.5 31.1683H17.8V22.2167H13.2V31.1683H3.5C1.567 31.1683 0 29.6013 0 27.6683V15.5276C0 14.6008 0.367644 13.7118 1.02228 13.0556L13.0223 1.02798ZM15.854 3.14685C15.6586 2.95105 15.3414 2.95105 15.146 3.14685L3.14604 15.1745C3.05252 15.2682 3 15.3952 3 15.5276V27.6683C3 27.9445 3.22386 28.1683 3.5 28.1683H10.2V19.2167H20.8V28.1683H27.5C27.7761 28.1683 28 27.9445 28 27.6683V15.5276C28 15.3952 27.9475 15.2682 27.854 15.1745L15.854 3.14685Z"
      />
    </svg>
  );
}

export function MprNavIconSearch({ className, ...rest }) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.1868 3C7.55835 3 3 7.55421 3 13.1667C3 18.7791 7.55835 23.3333 13.1868 23.3333C18.8153 23.3333 23.3736 18.7791 23.3736 13.1667C23.3736 7.55421 18.8153 3 13.1868 3ZM0 13.1667C0 5.89248 5.90638 0 13.1868 0C20.4673 0 26.3736 5.89248 26.3736 13.1667C26.3736 16.5297 25.1112 19.5974 23.0341 21.9241L29.5597 28.4384C30.146 29.0237 30.1469 29.9735 29.5616 30.5597C28.9763 31.146 28.0265 31.1469 27.4403 30.5616L20.8292 23.9619C20.8167 23.9494 20.8044 23.9368 20.7925 23.9239C18.643 25.4417 16.0189 26.3333 13.1868 26.3333C5.90638 26.3333 0 20.4409 0 13.1667Z"
      />
    </svg>
  );
}

/** “Info” tab — Heroicons 20 solid “information circle” (replace with Figma if needed). */
export function MprNavIconInfo({ className, ...rest }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
