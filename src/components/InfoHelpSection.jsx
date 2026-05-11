import { Link } from "react-router-dom";
import { INFO_FAQ_HREF } from "../constants/infoHelpLinks";
import OpenInNewIcon from "./OpenInNewIcon";
import "./InfoHelpSection.css";

export default function InfoHelpSection() {
  const faqIsHttp = /^https?:\/\//i.test(INFO_FAQ_HREF);

  return (
    <div className="info-help">
      <a
        href={INFO_FAQ_HREF}
        className="info-help__row info-help__row--external"
        {...(faqIsHttp
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        <span className="info-help__label">FAQ</span>
        <span className="info-help__end" aria-hidden={true}>
          <OpenInNewIcon />
        </span>
      </a>

      <Link to="/info/contact" className="info-help__row info-help__row--internal">
        <span className="info-help__label">Contact us</span>
        <span className="info-help__chevron" aria-hidden={true} />
      </Link>

      <Link to="/info/about" className="info-help__row info-help__row--internal">
        <span className="info-help__label">About</span>
        <span className="info-help__chevron" aria-hidden={true} />
      </Link>
    </div>
  );
}
