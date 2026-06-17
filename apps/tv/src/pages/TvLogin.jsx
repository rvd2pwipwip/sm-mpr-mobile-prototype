import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STINGRAY_SIGNUP_EMAIL_URL } from "@sm-mpr/shared/constants/externalLinks.js";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import TvDrillScreenHeader from "../components/drill/TvDrillScreenHeader.jsx";
import TvButton from "../components/TvButton.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvScreenHeaderOffset } from "../hooks/useTvScreenHeaderOffset.js";
import "../components/drill/TvDrillScreen.css";
import "../components/info/TvInfoHubLayout.css";
import "./TvLogin.css";

const FOCUS_GROUP = {
  email: 0,
  password: 1,
  login: 2,
  signup: 3,
};

const ITEM_INDEX = 0;

/** Prototype TV login URL shown beside the QR code. */
const TV_EASY_LOGIN_URL = "login-test.stingray.com/music/tv";

/** Prototype pairing code for mobile / computer handoff. */
const TV_EASY_LOGIN_CODE = "R24W";

function TvLoginField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  inputRef,
  registerItemRef,
  groupIndex,
  fieldFocused,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  useEffect(() => {
    if (fieldFocused && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [fieldFocused, inputRef]);

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
      onMoveDown?.(event);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      onMoveUp?.(event);
      return;
    }
    if (event.key === "ArrowLeft" && inputRef.current?.selectionStart === 0) {
      event.preventDefault();
      event.stopPropagation();
      onMoveLeft?.(event);
      return;
    }
    if (
      event.key === "ArrowRight" &&
      inputRef.current?.selectionStart === value.length
    ) {
      event.preventDefault();
      event.stopPropagation();
      onMoveRight?.(event);
    }
  };

  return (
    <div className="tv-login__field">
      <label className="tv-login__field-label" htmlFor={id}>
        {label}
      </label>
      <div
        className={[
          "tv-login__field-wrap",
          fieldFocused ? "tv-login__field-wrap--focused" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          ref={(node) => {
            inputRef.current = node;
            registerItemRef(groupIndex, ITEM_INDEX, node);
          }}
          id={id}
          type={type}
          name={id}
          autoComplete={type === "password" ? "current-password" : "email"}
          className="tv-login__field-input"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>
    </div>
  );
}

/** Log in — TV fields or QR / mobile handoff (no browser required). */
export default function TvLogin() {
  const navigate = useNavigate();
  const { setUserType } = useUserType();
  const { shellRef, headerRef } = useTvScreenHeaderOffset();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
  } = useScreenContentFocus("tv-login", {
    groupCount: 4,
    itemCount: 1,
    defaultGroupIndex: FOCUS_GROUP.email,
    defaultItemIndex: ITEM_INDEX,
  });

  const completeLogin = () => {
    setUserType("freeStingray");
    navigate(-1);
  };

  const goSignUp = () => {
    setUserType("freeStingray");
    window.open(STINGRAY_SIGNUP_EMAIL_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={shellRef}
      className="tv-drill-screen tv-login tv-info-hub-shell tv-screen-overlay"
    >
      <TvDrillScreenHeader title="Log in" headerRef={headerRef} />

      <div className="tv-drill-screen__scroll tv-home__scroll tv-screen-overlay__scroll">
        <div className="tv-home__scroll-inner tv-login__inner">
          <div className="tv-login__panel" role="group" aria-label="Log in options">
            <section
              className="tv-login__column tv-login__column--form"
              aria-label="Email and password"
            >
              <div className="tv-login__brand" aria-hidden={true}>
                <img
                  className="tv-login__wordmark tv-login__wordmark--light"
                  src="/stingrayMusic.svg"
                  alt=""
                  width="210"
                  height="61"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="tv-login__wordmark tv-login__wordmark--dark"
                  src="/stingrayMusicDark.svg"
                  alt=""
                  width="210"
                  height="61"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <TvLoginField
                id="tv-login-email"
                label="Enter email address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter email address"
                inputRef={emailRef}
                registerItemRef={registerItemRef}
                groupIndex={FOCUS_GROUP.email}
                fieldFocused={isItemFocused(FOCUS_GROUP.email, ITEM_INDEX)}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
              />

              <TvLoginField
                id="tv-login-password"
                label="Enter password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter password"
                inputRef={passwordRef}
                registerItemRef={registerItemRef}
                groupIndex={FOCUS_GROUP.password}
                fieldFocused={isItemFocused(FOCUS_GROUP.password, ITEM_INDEX)}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
              />

              <KeyboardWrapper
                ref={(node) =>
                  registerItemRef(FOCUS_GROUP.login, ITEM_INDEX, node)
                }
                onSelect={completeLogin}
                onUp={handleMoveUp}
                onDown={handleMoveDown}
                onLeft={handleMoveLeft}
                onRight={handleMoveRight}
              >
                {(focusProps) => (
                  <TvButton
                    {...focusProps}
                    variant="subscribe"
                    label="Log in"
                    focused={isItemFocused(FOCUS_GROUP.login, ITEM_INDEX)}
                    className="tv-login__submit"
                  />
                )}
              </KeyboardWrapper>

              <p className="tv-login__signup-prompt">Don&apos;t have an account?</p>

              <KeyboardWrapper
                ref={(node) =>
                  registerItemRef(FOCUS_GROUP.signup, ITEM_INDEX, node)
                }
                onSelect={goSignUp}
                onUp={handleMoveUp}
                onDown={handleMoveDown}
                onLeft={handleMoveLeft}
                onRight={handleMoveRight}
              >
                {(focusProps) => (
                  <TvButton
                    {...focusProps}
                    variant="secondary"
                    label="Sign up"
                    focused={isItemFocused(FOCUS_GROUP.signup, ITEM_INDEX)}
                    className="tv-login__signup"
                  />
                )}
              </KeyboardWrapper>
            </section>

            <div className="tv-login__divider" aria-hidden={true}>
              <span className="tv-login__divider-line" />
              <span className="tv-login__divider-label">or</span>
              <span className="tv-login__divider-line" />
            </div>

            <section
              className="tv-login__column tv-login__column--easy"
              aria-label="Easy login with mobile device"
            >
              <h2 className="tv-login__easy-title">Easy Login!</h2>

              <div className="tv-login__qr-wrap">
                <img
                  className="tv-login__qr"
                  src="/SM_login_QR.png"
                  alt="QR code to log in on your mobile device or computer"
                  width={220}
                  height={220}
                  decoding="async"
                />
              </div>

              <p className="tv-login__easy-lead">
                Follow these steps on your computer or mobile:
              </p>

              <ol className="tv-login__steps">
                <li className="tv-login__step">
                  <span className="tv-login__step-label">Step 1:</span>
                  <span className="tv-login__step-text">
                    Scan the code with your mobile camera or go to:
                  </span>
                  <span className="tv-login__step-url">{TV_EASY_LOGIN_URL}</span>
                </li>
                <li className="tv-login__step">
                  <span className="tv-login__step-label">Step 2:</span>
                  <span className="tv-login__step-text">
                    Enter this code to log in:
                  </span>
                  <span className="tv-login__step-code">{TV_EASY_LOGIN_CODE}</span>
                </li>
                <li className="tv-login__step">
                  <span className="tv-login__step-label">Step 3:</span>
                  <span className="tv-login__step-text">
                    Log in to Stingray Music.
                  </span>
                </li>
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
