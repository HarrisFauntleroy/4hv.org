import type { PropsWithChildren } from "react";
import { IntlProvider } from "./I18n";
import Theme from "./Theme";
import ThemeOld from "./ThemeOld";

// TODO REMOVE THIS
export function AppContext({ children }: PropsWithChildren) {
  return (
    <Theme>
      <ThemeOld>
        <IntlProvider>{children}</IntlProvider>
      </ThemeOld>
    </Theme>
  );
}
