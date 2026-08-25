/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(onboarding)/language` | `/(onboarding)/login` | `/(tabs)` | `/(tabs)/alerts` | `/(tabs)/awareness` | `/(tabs)/home` | `/(tabs)/map` | `/(tabs)/profile` | `/(tabs)/sync` | `/_sitemap` | `/alerts` | `/awareness` | `/health-report` | `/health-report/select-source` | `/home` | `/language` | `/login` | `/map` | `/profile` | `/splash` | `/sync` | `/water-test`;
      DynamicRoutes: `/(tabs)/alerts/${Router.SingleRoutePart<T>}` | `/alerts/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(tabs)/alerts/[alertId]` | `/alerts/[alertId]`;
    }
  }
}
