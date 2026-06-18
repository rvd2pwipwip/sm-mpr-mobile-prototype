import { INFO_FAQ_PATH } from "@sm-mpr/shared/constants/infoHelpLinks.js";
import { MY_LIBRARY_FAQ_RETURN_FOCUS } from "../constants/myLibraryAppInfoFocus.js";
import {
  navigateBackFromEmbeddedDoc,
  navigateToEmbeddedDoc,
} from "./tvEmbeddedDocNavigation.js";

const MY_LIBRARY_PATH = "/my-library";

const FAQ_DEFAULT_RETURN = {
  returnTo: MY_LIBRARY_PATH,
  returnFocus: MY_LIBRARY_FAQ_RETURN_FOCUS,
};

/**
 * @param {import("../constants/myLibraryAppInfoFocus.js").TvFocusRestore} [returnFocus]
 * @returns {{ pathname: string, state: { returnTo: string, returnFocus: import("../constants/myLibraryAppInfoFocus.js").TvFocusRestore } }}
 */
export function tvFaqNavigateOptions(
  returnFocus = MY_LIBRARY_FAQ_RETURN_FOCUS,
) {
  return {
    pathname: INFO_FAQ_PATH,
    state: {
      returnTo: MY_LIBRARY_PATH,
      returnFocus,
    },
  };
}

/**
 * @param {import("react-router-dom").NavigateFunction} navigate
 * @param {import("../constants/myLibraryAppInfoFocus.js").TvFocusRestore} [returnFocus]
 */
export function navigateToTvFaq(
  navigate,
  returnFocus = MY_LIBRARY_FAQ_RETURN_FOCUS,
) {
  navigateToEmbeddedDoc(navigate, INFO_FAQ_PATH, {
    returnTo: MY_LIBRARY_PATH,
    returnFocus,
  });
}

/**
 * @param {import("react-router-dom").NavigateFunction} navigate
 * @param {import("react-router-dom").Location} location
 */
export function navigateBackFromTvFaqToMyLibrary(navigate, location) {
  navigateBackFromEmbeddedDoc(navigate, location, FAQ_DEFAULT_RETURN);
}
