// ───────────────────────────────────────────────────────────────────────────
// Fare provider — the single seam between the app and the data source.
//
// Today it resolves fares from the mock dataset. To go live, implement a new
// provider that hits a real fare API and returns the same `FareSearchResult`
// shape; nothing in the engine or UI changes.
// ───────────────────────────────────────────────────────────────────────────

import type {
  FareProvider,
  FareQuery,
  FareSearchResult,
} from "./types";
import { AIRPORT_BY_CODE } from "./reference";
import { getRouteOptions } from "./mock-fares";

export class MockFareProvider implements FareProvider {
  async search(query: FareQuery): Promise<FareSearchResult> {
    const origin = AIRPORT_BY_CODE[query.origin];
    const destination = AIRPORT_BY_CODE[query.destination];

    let options = getRouteOptions(query.origin, query.destination);

    if (query.flightType === "direct") {
      options = options.filter((o) => o.isDirect);
    } else if (query.flightType === "transit") {
      options = options.filter((o) => !o.isDirect);
    }

    return {
      query,
      origin,
      destination,
      options,
      isSample: true,
    };
  }
}

/** Default provider instance used by the app. Swap here to go live. */
export const fareProvider: FareProvider = new MockFareProvider();
