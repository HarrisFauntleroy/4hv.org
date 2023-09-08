import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { IntlProvider as Provider } from "react-intl";
import enAUMessages from "../../lang/en-AU.json";
import enUSMessages from "../../lang/en-US.json";
import zhCNMessages from "../../lang/zh-CN.json";

export enum LOCALE {
  AUSTRALIAN = "en-AU",
  AMERICAN = "en-US",
  CHINESE = "zh-CN",
}

export type LocaleType = {
  label: string;
  value: LOCALE;
};

type IntlContextType = {
  locale: LocaleType;
  setLocale: Dispatch<SetStateAction<LocaleType>>;
};

const defaultValues = {
  locale: { label: "Australian", value: LOCALE.AUSTRALIAN },
  setLocale: () => null,
};

export const IntlContext = createContext<IntlContextType>(defaultValues);

export function IntlProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<LocaleType>(defaultValues.locale);

  const messages = {
    [LOCALE.AUSTRALIAN]: enAUMessages,
    [LOCALE.AMERICAN]: enUSMessages,
    [LOCALE.CHINESE]: zhCNMessages,
  };

  return (
    <Provider
      locale={locale.value}
      messages={messages[locale.value]}
      defaultLocale={LOCALE.AUSTRALIAN}
    >
      <IntlContext.Provider value={{ locale, setLocale }}>
        {children}
      </IntlContext.Provider>
    </Provider>
  );
}
