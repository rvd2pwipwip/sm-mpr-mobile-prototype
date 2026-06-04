import { useNavigate } from "react-router-dom";
import { USER_TYPES } from "@sm-mpr/shared/constants/userTypes.js";
import { useUserType } from "../context/UserTypeContext.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import "./TvUserTypePreview.css";

const LABELS = {
  guest: "Guest",
  freeStingray: "Free Stingray",
  freeProvided: "Free provider",
  subscribed: "Subscribed",
};

/** Prototype tier toggles — mirror mobile `Subscription` preview block. */
export default function TvUserTypePreview() {
  const navigate = useNavigate();
  const { userType, setUserType } = useUserType();

  return (
    <main className="tv-user-type-preview">
      <header className="tv-user-type-preview__header">
        <FocusableButton type="button" onClick={() => navigate(-1)}>
          Back
        </FocusableButton>
        <h1 className="tv-user-type-preview__title">Preview user type</h1>
      </header>
      <p className="tv-user-type-preview__lead">
        Same tiers as mobile. The Home in-feed banner hides when Subscribed is selected.
      </p>
      <ul className="tv-user-type-preview__list">
        {USER_TYPES.map((value) => (
          <li key={value}>
            <FocusableButton
              type="button"
              className={
                userType === value
                  ? "tv-user-type-preview__option tv-user-type-preview__option--active"
                  : "tv-user-type-preview__option"
              }
              onClick={() => {
                setUserType(value);
                navigate("/");
              }}
            >
              {LABELS[value] ?? value}
            </FocusableButton>
          </li>
        ))}
      </ul>
    </main>
  );
}
