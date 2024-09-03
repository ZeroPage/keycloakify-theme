import { useEffect } from "react";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import { getKcClsx } from "keycloakify/account/lib/kcClsx";
import { useInsertLinkTags } from "keycloakify/tools/useInsertLinkTags";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import type { TemplateProps } from "keycloakify/account/TemplateProps";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, active, classes, children } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr } = i18n;

    const { locale, url, features, realm, message, referrer } = kcContext;

    useEffect(() => {
        document.title = msgStr("accountManagementTitle");
    }, [msgStr]);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: clsx("admin-console", "user", kcClsx("kcBodyClass"))
    });

    useEffect(() => {
        const { currentLanguageTag } = locale ?? {};

        if (currentLanguageTag === undefined) {
            return;
        }

        const html = document.querySelector("html");
        assert(html !== null);
        html.lang = currentLanguageTag;
    }, [locale]);

    const { areAllStyleSheetsLoaded } = useInsertLinkTags({
        componentOrHookName: "Template",
        hrefs: !doUseDefaultCss
            ? []
            : [
                `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
                `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
                `${url.resourcesPath}/css/account.css`
            ]
    });

    useEffect(() => {
        const sidebar = document.querySelector(".bs-sidebar") as HTMLElement | null;
        const contentArea = document.querySelector(".content-area") as HTMLElement | null;

        if (sidebar && contentArea) {
            const adjustHeight = () => {
                const sidebarHeight = sidebar.offsetHeight;
                if (contentArea.offsetHeight < sidebarHeight) {
                    contentArea.style.minHeight = `${sidebarHeight}px`;
                }
            };

            adjustHeight();

            window.addEventListener("resize", adjustHeight);

            const observer = new MutationObserver(() => {
                adjustHeight();
            });

            observer.observe(contentArea, {
                childList: true,
                subtree: true,
                characterData: true,
            });

            return () => {
                window.removeEventListener("resize", adjustHeight);
                observer.disconnect();
            };
        }
    }, []);

    if (!areAllStyleSheetsLoaded) {
        return null;
    }

    return (
        <>
            <style>
                {`
                    @media (max-width: 640px) { /* 모바일 해상도 기준 */
                        .hashtag-tex {
                            font-size: 0.75rem; 
                            padding: 0.5rem 0.7rem; 
                        }
                        .reduce-top-space {
                            padding-top: 140px; 
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
                            margin-bottom: 0rem !important; /* 더 작은 마진을 설정 */
                        }
                    }
                `}
            </style>

            <div className="bg-img min-h-screen flex flex-col items-center justify-center pt-4 px-2">
                <div className="flex justify-between items-center w-full max-w-7xl h-16 bg-transparent text-white p-4 mx-auto">
                    <div className="flex items-center">
                        <img src="https://static.zeropage.org/logo_square.png" alt="Logo" className="h-14 w-14" />
                    </div>
                    <ul className="flex space-x-4">
                        {referrer?.url && (
                            <li>
                                <a href={referrer.url} id="referrer" className="text-white hover:underline">
                                    {msg("backTo", referrer.name)}
                                </a>
                            </li>
                        )}
                        <li>
                            <a href={url.getLogoutUrl()} className="text-white hover:underline">
                                {msg("doSignOut")}
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="text-center text-white mb-16 pt-8">
                    <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight">ZeroPage</h1>
                </div>

                <div className="max-w-7xl container flex flex-1 mt-4 mx-auto">
                    <div className="bs-sidebar col-sm-3 bg-gray-700 text-white p-6 rounded-l-lg">
                        <ul>
                            <li className={clsx(active === "account" && "active")}>
                                <a href={url.accountUrl} className="hover:underline">
                                    {msg("account")}
                                </a>
                            </li>
                            {features.passwordUpdateSupported && (
                                <li className={clsx(active === "password" && "active")}>
                                    <a href={url.passwordUrl} className="hover:underline">
                                        {msg("password")}
                                    </a>
                                </li>
                            )}
                            <li className={clsx(active === "totp" && "active")}>
                                <a href={url.totpUrl} className="hover:underline">
                                    {msg("authenticator")}
                                </a>
                            </li>
                            {features.identityFederation && (
                                <li className={clsx(active === "social" && "active")}>
                                    <a href={url.socialUrl} className="hover:underline">
                                        {msg("federatedIdentity")}
                                    </a>
                                </li>
                            )}
                            <li className={clsx(active === "sessions" && "active")}>
                                <a href={url.sessionsUrl} className="hover:underline">
                                    {msg("sessions")}
                                </a>
                            </li>
                            <li className={clsx(active === "applications" && "active")}>
                                <a href={url.applicationsUrl} className="hover:underline">
                                    {msg("applications")}
                                </a>
                            </li>
                            {features.log && (
                                <li className={clsx(active === "log" && "active")}>
                                    <a href={url.logUrl} className="hover:underline">
                                        {msg("log")}
                                    </a>
                                </li>
                            )}
                            {false && realm.userManagedAccessAllowed && features.authorization && (
                                <li className={clsx(active === "authorization" && "active")}>
                                    <a href={url.resourceUrl} className="hover:underline">
                                        {msg("myResources")}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="col-sm-9 content-area p-8 rounded-r-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                        {message !== undefined && (
                            <div className={clsx("alert", `alert-${message.type}`)}>
                                {message.type === "success" && <span className="pficon pficon-ok"></span>}
                                {message.type === "error" && <span className="pficon pficon-error-circle-o"></span>}
                                <span
                                    className="kc-feedback-text"
                                    dangerouslySetInnerHTML={{
                                        __html: message.summary
                                    }}
                                />
                            </div>
                        )}

                        {children}
                    </div>
                </div>

                <div className="flex space-x-1 md:space-x-4 pb-10 md:pb-20 pt-6 justify-center text-xs md:text-xl">
                    <div className="block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out hashtag-tex">
                        #중앙대학교
                    </div>
                    <div className="block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out hashtag-tex">
                        #소프트웨어학부
                    </div>
                    <div className="block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out hashtag-tex">
                        #학술연구회
                    </div>
                    <div className="block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out hashtag-tex">
                        #since1991
                    </div>
                </div>

                <div data-aos="fade-up" className="max-w-7xl mx-auto text-3xl md:text-4xl text-white mb-10 tracking-tight font-extrabold px-6 text-left mobile-text-xl">
                    What is ZeroPage?
                </div>
                <div data-aos="fade-up" className="max-w-7xl mx-auto pb-24 mb-4 text-lg font-normal text-white leading-loose text-justify break-all px-6 mobile-text-sm mobile-reduce-margin" role="alert">
                    <strong>제로페이지는 공부하고자하는 뜻이 있는 사람들이 모인 일종의 인력의 장입니다. </strong>그 안에서 뜻이 같은 사람들을 만날수 있기를, 또는 자신이 아는 것에 대해 다른 사람들에게 전달해줄수 있기를, 또는 자신의 부족한 점을 다른 사람들로부터 얻어갈 수 있었으면 합니다. 개인의 이익들이 모여서 집단의 이익을 만들어가며, 집단의 이익을 추구하는 것이 곧 개개인들에게 이익이 되는 경지가 되었으면 합니다.
                </div>

                <div data-aos="fade-up" className="max-w-7xl mx-auto text-3xl md:text-4xl tracking-tight text-white mb-10 md:mb-14 font-extrabold px-6 text-left mobile-text-xl mobile-reduce-top-margin mobile-event-gap">
                    Events
                </div>
                <div data-aos="fade-up" className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 pb-16 md:pb-24 px-6 mobile-reduce-gap mobile-event-gap">
                    <div className="h-content mb-2">
                        <a href="/oms" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline mobile-text-lg mobile-reduce-margin">정모 & OMS</a>
                        <div className="text-base md:text-lg text-slate-400 keep-all mobile-text-sm mobile-reduce-margin-sm">함께하는 성장! 매주 수요일 정모에 참여하여 앎을 공유하고 다른 제로페이지 회원들을 만나보아요!</div>
                    </div>
                    <div className="h-content mb-2">
                        <a href="/sprouthon" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline mobile-text-lg mobile-reduce-margin">새싹교실 & 새싹톤</a>
                        <div className="text-base md:text-lg text-slate-400 keep-all mobile-text-sm mobile-reduce-margin-sm">선후배간의 친목을 도모하고 학술 교류의 장입니다. 관심분야별 클래스 속에서 혼자서는 알 수 없었던 내용을 배우고 이를 뽐내보아요.</div>
                    </div>
                    <div className="h-content mb-2">
                        <a href="/devilscamp" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline mobile-text-lg mobile-reduce-margin">데블스캠프</a>
                        <div className="text-base md:text-lg text-slate-400 keep-all mobile-text-sm mobile-reduce-margin-sm">제로페이지의 컨퍼런스 행사! 1기 선배님부터 여러분까지 다양한 사람의 경험과 현재 시장의 트렌드까지 배우고 공유할 수 있어요.</div>
                    </div>
                    <div className="h-content mb-2">
                        <a href="/angelscamp" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline mobile-text-lg mobile-reduce-margin">엔젤스캠프</a>
                        <div className="text-base md:text-lg text-slate-400 keep-all mobile-text-sm mobile-reduce-margin-sm">평소에 갖고 있던 기발한 아이디어를 결과물로 만들어볼 수 있는 시간이에요! 시도하지 못한 아이디어를 서로 도와 뽐내볼까요?</div>
                    </div>
                    <div className="h-content mb-2">
                        <a href="/jigeumgeuddae" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline mobile-text-lg mobile-reduce-margin">지금그때</a>
                        <div className="text-base md:text-lg text-slate-400 keep-all mobile-text-sm mobile-reduce-margin-sm">여러분의 지금이 우리의 그때보다 낫길 바라며 선후배들이 모여 이야기를 나누고 서로의 시선에서 경험을 나눕니다.</div>
                    </div>
                    <div className="h-content mb-2">
                        <a href="/year-end-party" className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline mobile-text-lg mobile-reduce-margin">기년회</a>
                        <div className="text-base md:text-lg text-slate-400 keep-all mobile-text-sm mobile-reduce-margin-sm">저녁에 술 약속을 잡는 송년회나 망년회가 아닌 밝을 때 조용한 곳에 모여 한 해를 되돌아보며 앞으로의 내일을 계획합니다.</div>
                    </div>
                </div>
            </div>
        </>
    );
}
