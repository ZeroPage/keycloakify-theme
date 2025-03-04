import type { DeepPartial } from "keycloakify/tools/DeepPartial";
import type { KcContext } from "./KcContext";
import KcPage from "./KcPage";
import { createGetKcContextMock } from "keycloakify/login/KcContext";
import type { KcContextExtension, KcContextExtensionPerPage } from "./KcContext";
import { themeNames, kcEnvDefaults } from "../kc.gen";

const kcContextExtension: KcContextExtension = {
    themeName: themeNames[0],
    properties: {
        ...kcEnvDefaults
    }
};
const kcContextExtensionPerPage: KcContextExtensionPerPage = {};

export const { getKcContextMock } = createGetKcContextMock({
    kcContextExtension,
    kcContextExtensionPerPage,
    overrides: {
        locale: {
            supported: [
                /* spell-checker: disable */
                ["de", "Deutsch"],
                ["no", "Norsk"],
                ["ru", "Русский"],
                ["sv", "Svenska"],
                ["pt-BR", "Português (Brasil)"],
                ["lt", "한국어"],
                ["en", "English"],
                ["it", "Italiano"],
                ["fr", "Français"],
                ["zh-CN", "中文简体"],
                ["es", "Español"],
                ["cs", "Čeština"],
                ["ja", "日本語"],
                ["sk", "Slovenčina"],
                ["pl", "Polski"],
                ["ca", "Català"],
                ["nl", "Nederlands"],
                ["tr", "Türkçe"]
                /* spell-checker: enable */
            ].map(
                ([languageTag, label]) =>
                    ({
                        languageTag,
                        label,
                        url: "https://cdn.jsdelivr.net/npm/keycloakify@latest/src/i18n/ko.json"
                    }) as const
            ),
        }
    },
    overridesPerPage: {}
});

export function createKcPageStory<PageId extends KcContext["pageId"]>(params: {
    pageId: PageId;
}) {
    const { pageId } = params;

    function KcPageStory(props: {
        kcContext?: DeepPartial<Extract<KcContext, { pageId: PageId }>>;
    }) {
        const { kcContext: overrides } = props;

        const kcContextMock = getKcContextMock({
            pageId,
            overrides
        });

        return <KcPage kcContext={kcContextMock} />;
    }

    return { KcPageStory };
}
