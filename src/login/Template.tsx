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
        <div className="bg-img min-h-screen flex flex-col items-center justify-center pt-48">
            {/* 로고 섹션 */}
            <div className="absolute top-0 left-0 p-4">
                <img src="https://static.zeropage.org/logo_square.png" alt="Logo" className="h-14 w-14 mt-2 ml-32" />
            </div>

            <div className="text-center text-white mb-16">
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight">ZeroPage</h1>
            </div>

            <div className="max-w-3xl w-full bg-opacity-10 p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'rgba(12, 45, 78, 0.2)' }}>
                <header className={kcClsx("kcFormHeaderClass")}>
                    {headerNode}
                </header>
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
                                    {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                    {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                    {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                    {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                                </div>
                                <span
                                    className={kcClsx("kcAlertTitleClass")}
                                    dangerouslySetInnerHTML={{
                                        __html: message.summary
                                    }}
                                />
                            </div>
                        )}

                        {/* Input Fields */}
                        <div className="kc-input-wrapper rounded-lg overflow-hidden">
                            {children}
                        </div>


                        {/* Social Providers */}
                        {socialProvidersNode}

                        {/* Info Section */}
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

            <div className="flex space-x-1 md:space-x-4 pb-10 md:pb-20 pt-6 justify-center text-xs md:text-xl">
                <div className="block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">
                    #중앙대학교
                </div>
                <div className="block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">
                    #소프트웨어학부
                </div>
                <div className="block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">
                    #학술연구회
                </div>
                <div className="block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">
                    #since1991
                </div>
            </div>

            {/* 제로페이지 소개 섹션 */}
            <div data-aos="fade-up" className="max-w-6xl mx-auto text-3xl md:text-4xl text-white mb-10 tracking-tight font-extrabold px-6 text-left">
                What is ZeroPage?
            </div>
            <div data-aos="fade-up" className="max-w-6xl mx-auto pb-24 mb-4 text-lg font-normal text-white leading-loose text-justify break-all px-6" role="alert">
                <strong>제로페이지는 공부하고자하는 뜻이 있는 사람들이 모인 일종의 인력의 장입니다. </strong>그 안에서 뜻이 같은 사람들을 만날수 있기를, 또는 자신이 아는 것에 대해 다른 사람들에게 전달해줄수 있기를, 또는 자신의 부족한 점을 다른 사람들로부터 얻어갈 수 있었으면 합니다. 개인의 이익들이 모여서 집단의 이익을 만들어가며, 집단의 이익을 추구하는 것이 곧 개개인들에게 이익이 되는 경지가 되었으면 합니다.
            </div>

            {/* 연중행사 소개 섹션 */}
            <div data-aos="fade-up" className="max-w-6xl mx-auto text-3xl md:text-4xl tracking-tight text-white mb-10 md:mb-14 font-extrabold px-6 text-left">
                Events
            </div>
            <div data-aos="fade-up" className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 pb-16 md:pb-24 px-6">
                <div className="h-content">
                    <a href="/oms" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">정모 & OMS</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">함께하는 성장! 매주 수요일 정모에 참여하여 앎을 공유하고 다른 제로페이지 회원들을 만나보아요!</div>
                </div>
                <div className="h-content">
                    <a href="/sprouthon" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">새싹교실 & 새싹톤</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">선후배간의 친목을 도모하고 학술 교류의 장입니다. 관심분야별 클래스 속에서 혼자서는 알 수 없었던 내용을 배우고 이를 뽐내보아요.</div>
                </div>
                <div className="h-content">
                    <a href="/devilscamp" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">데블스캠프</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">제로페이지의 컨퍼런스 행사! 1기 선배님부터 여러분까지 다양한 사람의 경험과 현재 시장의 트렌드까지 배우고 공유할 수 있어요.</div>
                </div>
                <div className="h-content">
                    <a href="/angelscamp" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">엔젤스캠프</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">평소에 갖고 있던 기발한 아이디어를 결과물로 만들어볼 수 있는 시간이에요! 시도하지 못한 아이디어를 서로 도와 뽐내볼까요?</div>
                </div>
                <div className="h-content">
                    <a href="/jigeumgeuddae" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">지금그때</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">여러분의 지금이 우리의 그때보다 낫길 바라며 선후배들이 모여 이야기를 나누고 서로의 시선에서 경험을 나눕니다.</div>
                </div>
                <div className="h-content">
                    <a href="/year-end-party" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">기년회</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">저녁에 술 약속을 잡는 송년회나 망년회가 아닌 밝을 때 조용한 곳에 모여 한 해를 되돌아보며 앞으로의 내일을 계획합니다.</div>
                </div>
            </div>
        </div>
    );
}
