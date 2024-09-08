import { useEffect } from "react";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useInsertScriptTags } from "keycloakify/tools/useInsertScriptTags";
import { useInsertLinkTags } from "keycloakify/tools/useInsertLinkTags";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msgStr } = i18n;

    const { locale, url, message, isAppInitiatedAction, authenticationSession, scripts } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, msgStr, kcContext.realm.displayName]);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    useEffect(() => {
        if (locale?.currentLanguageTag) {
            const html = document.querySelector("html");
            assert(html !== null);
            html.lang = locale.currentLanguageTag;
        }
    }, [locale?.currentLanguageTag]);

    const { areAllStyleSheetsLoaded } = useInsertLinkTags({
        componentOrHookName: "Template",
        hrefs: !doUseDefaultCss
            ? []
            : [
                `${url.resourcesCommonPath}/node_modules/@patternfly/patternfly/patternfly.min.css`,
                `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
                `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
                `${url.resourcesCommonPath}/lib/pficon/pficon.css`,
                `${url.resourcesPath}/css/login.css`
            ]
    });

    const { insertScriptTags } = useInsertScriptTags({
        componentOrHookName: "Template",
        scriptTags: [
            {
                type: "module",
                src: `${url.resourcesPath}/js/menu-button-links.js`
            },
            ...(authenticationSession === undefined
                ? []
                : [
                    {
                        type: "module",
                        textContent: [
                            `import { checkCookiesAndSetTimer } from "${url.resourcesPath}/js/authChecker.js";`,
                            ``,
                            `checkCookiesAndSetTimer(`,
                            `  "${authenticationSession.authSessionId}",`,
                            `  "${authenticationSession.tabId}",`,
                            `  "${url.ssoLoginInOtherTabsUrl}"`,
                            `);`
                        ].join("\n")
                    } as const
                ]),
            ...scripts.map(
                script =>
                    ({
                        type: "text/javascript",
                        src: script
                    }) as const
            )
        ]
    });

    useEffect(() => {
        if (areAllStyleSheetsLoaded) {
            insertScriptTags();
        }
    }, [areAllStyleSheetsLoaded, insertScriptTags]);

    if (!areAllStyleSheetsLoaded) {
        return null;
    }

    return (
        <>
            <style>
                {`
                @media (max-width: 640px) {
                    .hashtag-tex {
                        font-size: 0.75rem;
                        padding: 0.5rem 0.7rem;
                    }
                    .reduce-top-space {
                        padding-top: 40px; /* 상단 여백을 더 줄임 */
                    }
                    .mobile-text-sm {
                        font-size: 0.8rem;
                    }
                    .mobile-text-lg {
                        font-size: 1rem;
                    }
                    .mobile-text-xl {
                        font-size: 2rem;
                    }
                    .mobile-reduce-margin {
                        margin-bottom: 0rem !important;
                    }
                    .mobile-reduce-gap {
                        gap-y: 4px !important;
                    }
                    .mobile-reduce-top-margin {
                        margin-top: 0rem !important;
                    }
                    .mobile-event-gap {
                        gap-y: 4px !important;
                    }
                    .pb-10, .pb-16, .pb-24 {
                        padding-bottom: 3rem !important;
                    }
                    .mb-10, .mb-14 {
                        margin-bottom: 1.5rem !important;
                    }
                    .mb-2, .mb-3 {
                        margin-bottom: 0rem !important;
                    }
                    .mobile-reduce-margin-sm {
                        margin-bottom: 0rem !important;
                    }

                    /* 모바일에서 로고 크기 줄이기 */
                    .mobile-logo {
                        height: 128px; /* 모바일에서 로고 크기를 줄임 */
                    }

                    /* 좌우에 여백 추가 */
                    .mobile-padding {
                        padding-left: 16px;
                        padding-right: 16px;
                    }
                }
            `}
            </style>

            <div
                className="bg-img min-h-screen flex flex-col items-center justify-center pt-10 md:pt-8 reduce-top-space mobile-padding">
                {/* ZeroPage 로고 섹션 */}
                <div className="text-center text-white mb-2 md:mb-8">
                    <img
                        src="https://static.zeropage.org/logo_wide.png"
                        alt="ZeroPage Logo"
                        className="h-48 w-auto mobile-logo"
                    />
                </div>

                <div className="max-w-3xl w-full bg-opacity-10 p-8 rounded-lg shadow-lg"
                     style={{ backgroundColor: "rgba(12, 45, 78, 0.2)" }}>
                    <header className={kcClsx("kcFormHeaderClass")}>{headerNode}</header>
                    <div id="kc-content">
                        <div id="kc-content-wrapper">
                            {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                                <div
                                    className={clsx(
                                        `alert-${message.type}`,
                                        kcClsx("kcAlertClass"),
                                        `pf-m-${message?.type === "error" ? "danger" : message.type}`
                                    )}
                                >
                                    <div className="pf-c-alert__icon">
                                        {message.type === "success" &&
                                            <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                        {message.type === "warning" &&
                                            <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                        {message.type === "error" &&
                                            <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                        {message.type === "info" &&
                                            <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                                    </div>
                                    <span
                                        className={kcClsx("kcAlertTitleClass")}
                                        dangerouslySetInnerHTML={{
                                            __html: message.summary
                                        }}
                                    />
                                </div>
                            )}

                            <div className="kc-input-wrapper rounded-lg overflow-hidden">{children}</div>
                            {socialProvidersNode}

                            {displayInfo && (
                                <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                    <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                                        {infoNode}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 아래 마진 추가 */}
                <div className="mb-10"></div>
            </div>
        </>
    );
}
