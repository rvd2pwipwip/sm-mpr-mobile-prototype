import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { HOME_HEADER_LAYOUT } from "../constants/homeHeaderLayout.js";
import BroadHome from "./BroadHome.jsx";
import LimitedHome from "./LimitedHome.jsx";

/** Territory-driven Home: broad rails vs limited filter + channel rail. */
export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { catalogScope } = useTerritory();

  useEffect(() => {
    if (searchParams.get("homeHeader")) return;
    navigate(`/?homeHeader=${HOME_HEADER_LAYOUT.SCROLL}`, { replace: true });
  }, [navigate, searchParams]);

  if (catalogScope === CATALOG_SCOPE.limited) {
    return <LimitedHome />;
  }

  return <BroadHome />;
}
