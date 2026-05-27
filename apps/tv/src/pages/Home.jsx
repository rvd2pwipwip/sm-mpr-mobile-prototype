import { USER_TYPES, useUserType } from "../context/UserTypeContext.jsx";

export default function Home() {
  const { userType, setUserType } = useUserType();

  return (
    <div className="tv-page">
      <h1 className="tv-page__title">Home</h1>
      <p className="tv-page__lede">
        TV prototype shell. Use arrow keys or Tab to move focus between the
        primary nav and controls below. Screen content and swimlanes come next.
      </p>
      <div className="tv-prototype-controls">
        <label htmlFor="tv-user-type">
          Preview user type
          <select
            id="tv-user-type"
            value={userType}
            onChange={(event) => setUserType(event.target.value)}
          >
            {USER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <span aria-live="polite">Current: {userType}</span>
      </div>
    </div>
  );
}
