import { useState, useEffect, useReducer } from "react";
import { assert } from "keycloakify/tools/assert";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { social, realm, url, usernameHidden, login, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <div className="bg-img min-h-screen flex flex-col items-center justify-center pt-48">
            {/* 로고 섹션 */}
            <div className="absolute top-0 left-0 p-4">
                <img src="/src/login/assets/img/logo.png" alt="Logo" className="h-14 w-14 ml-32" />
            </div>

            <div className="text-center text-white mb-16">
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight">ZeroPage</h1>
            </div>

            <div className="max-w-3xl w-full">
                <div className="bg-opacity-10 p-8 rounded-lg shadow-lg" style={{ backgroundColor: 'rgba(12, 45, 78, 0.2)'}}>
                    <form
                        id="kc-form-login"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                    >
                        {!usernameHidden && (
                            <div className="mb-4">
                                <label htmlFor="username" className="kcLabelClass text-white">
                                    {!realm.loginWithEmailAllowed
                                        ? msg("username")
                                        : !realm.registrationEmailAsUsername
                                            ? msg("usernameOrEmail")
                                            : msg("email")}
                                </label>
                                <input
                                    tabIndex={2}
                                    id="username"
                                    className="w-full px-4 py-2 rounded-lg border"
                                    name="username"
                                    defaultValue={login.username ?? ""}
                                    type="text"
                                    autoFocus
                                    autoComplete="username"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                />
                                {messagesPerField.existsError("username", "password") && (
                                    <span id="input-error" className="text-red-500 mt-2 text-sm" aria-live="polite">
                                        {messagesPerField.getFirstError("username", "password")}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="password" className="kcLabelClass text-white">
                                {msg("password")}
                            </label>
                            <PasswordWrapper i18n={i18n} passwordInputId="password">
                                <input
                                    tabIndex={3}
                                    id="password"
                                    className="w-full px-4 py-2 rounded-lg border"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    aria-invalid={messagesPerField.existsError("username", "password")}
                                />
                            </PasswordWrapper>
                            {usernameHidden && messagesPerField.existsError("username", "password") && (
                                <span id="input-error" className="text-red-500 mt-2 text-sm" aria-live="polite">
                                    {messagesPerField.getFirstError("username", "password")}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            {realm.rememberMe && !usernameHidden && (
                                <div className="flex items-center">
                                    <input
                                        tabIndex={5}
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        defaultChecked={!!login.rememberMe}
                                        className="mr-2"
                                    />
                                    <label htmlFor="rememberMe" className="text-white">{msg("rememberMe")}</label>
                                </div>
                            )}
                            {realm.resetPasswordAllowed && (
                                <a tabIndex={6} href={url.loginResetCredentialsUrl}
                                   className="text-sm text-gray-300 hover:text-white hover:underline">
                                    {msg("doForgotPassword")}
                                </a>
                            )}
                        </div>

                        <div>
                            <input
                                tabIndex={7}
                                disabled={isLoginButtonDisabled}
                                className="w-full bg-opacity-70 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
                                name="login"
                                id="kc-login"
                                type="submit"
                                value={msgStr("doLogIn")}
                            />
                        </div>
                    </form>

                    {realm.password && social.providers?.length && (
                        <div className="mt-6">
                            <hr />
                            <h2 className="text-center text-gray-400 text-lg mb-4">{msg("identity-provider-login-label")}</h2>
                            <ul className="flex justify-around">
                                {social.providers.map((p) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-700"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses &&
                                                <i className={`${p.iconClasses} mr-2`} aria-hidden="true"></i>}
                                            <span className="text-gray-300 hover:text-white">{p.displayName}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex space-x-1 md:space-x-4 pb-10 md:pb-20 md:pt-6 justify-center text-xs md:text-xl">
                <div
                    className="hidden md:block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">#중앙대학교
                </div>
                <div
                    className="hidden md:block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">#소프트웨어학부
                </div>
                <div
                    className="hidden md:block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">#학술연구회
                </div>
                <div
                    className="hidden md:block px-6 py-2.5 bg-gray-800 text-white font-medium leading-tight uppercase rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">#since1991
                </div>
            </div>

            {/* What is ZeroPage Section */}
            <div data-aos="fade-up"
                 className="max-w-6xl mx-auto text-3xl md:text-4xl pt-1 mt-12 text-white mb-10 tracking-tight font-extrabold px-6 text-left">
                What is ZeroPage?
            </div>
            <div data-aos="fade-up"
                 className="max-w-6xl mx-auto pb-24 mb-4 text-lg font-normal text-white leading-loose text-justify break-all px-6"
                 role="alert">
                <strong>제로페이지는 공부하고자하는 뜻이 있는 사람들이 모인 일종의 인력의 장입니다. </strong>그 안에서 뜻이 같은 사람들을 만날수 있기를, 또는 자신이 아는 것에 대해 다른
                사람들에게 전달해줄수 있기를, 또는 자신의 부족한 점을 다른 사람들로부터 얻어갈 수 있었으면 합니다. 개인의 이익들이 모여서 집단의 이익을 만들어가며, 집단의 이익을 추구하는 것이 곧
                개개인들에게 이익이 되는 경지가 되었으면 합니다.
            </div>

            {/* Events Section */}
            <div data-aos="fade-up"
                 className="max-w-6xl mx-auto text-3xl md:text-4xl pt-1 mt-12 tracking-tight text-white mb-10 md:mb-14 font-extrabold px-6 text-left">
                Events
            </div>
            <div data-aos="fade-up"
                 className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 pb-16 md:pb-24 px-6">
                <div className="h-content">
                    <a href="/oms"
                       className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">정모 &
                        OMS</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">함께하는 성장! 매주 수요일 정모에 참여하여 앎을 공유하고 다른
                        제로페이지 회원들을 만나보아요!
                    </div>
                </div>
                <div className="h-content">
                    <a href="/sprouthon"
                       className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">새싹교실 &
                        새싹톤</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">선후배간의 친목을 도모하고 학술 교류의 장입니다. 관심분야별 클래스
                        속에서 혼자서는 알 수 없었던 내용을 배우고 이를 뽐내보아요.
                    </div>
                </div>
                <div className="h-content">
                    <a href="/devilscamp"
                       className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">데블스캠프</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">제로페이지의 컨퍼런스 행사! 1기 선배님부터 여러분까지 다양한 사람의
                        경험과 현재 시장의 트렌드까지 배우고 공유할 수 있어요.
                    </div>
                </div>
                <div className="h-content">
                    <a href="/angelscamp"
                       className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">엔젤스캠프</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">평소에 갖고 있던 기발한 아이디어를 결과물로 만들어볼 수 있는
                        시간이에요! 시도하지 못한 아이디어를 서로 도와 뽐내볼까요?
                    </div>
                </div>
                <div className="h-content">
                    <a href="/jigeumgeuddae"
                       className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">지금그때</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">여러분의 지금이 우리의 그때보다 낫길 바라며 선후배들이 모여 이야기를
                        나누고 서로의 시선에서 경험을 나눕니다.
                    </div>
                </div>
                <div className="h-content">
                    <a href="/year-end-party"
                       className="text-xl md:text-2xl text-white font-semibold mb-2 md:mb-3 hover:underline">기년회</a>
                    <div className="text-base md:text-lg text-slate-400 keep-all">저녁에 술 약속을 잡는 송년회나 망년회가 아닌 밝을 때 조용한 곳에
                        모여 한 해를 되돌아보며 앞으로의 내일을 계획합니다.
                    </div>
                </div>
            </div>
        </div>
    );
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer(
        (isPasswordRevealed: boolean) => !isPasswordRevealed,
        false
    );

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);

        assert(passwordInputElement instanceof HTMLInputElement);

        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <div className="relative">
            {children}
            <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-black z-10"
                style={{ height: '100%' }} // 배경색을 제거하고 아이콘만 표시
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10c0 1.47-.296 2.868-.825 4.125M19.875 5.875L12 13.75m7.875-7.875L10.125 19.875m-.25-.25L3.375 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10c0 1.47-.296 2.868-.825 4.125M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.875-7.875L12 13.75m0 0L7.875 9.875m0 0L4.125 6.125"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}

