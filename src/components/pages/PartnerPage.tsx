'use client'

import React, { useState } from 'react';

const PartnerPage: React.FC = () => {
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <div className="bg-white">
            <section className="bg-[#071936] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl rounded-[28px] bg-[#081a39] px-6 py-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-10 sm:py-10 lg:px-16 lg:py-14">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                        <div className="max-w-xl pt-2">
                            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#9eaac2]">Partner With Us</p>
                            <h2 className="max-w-md text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                                An open reporting space for citizens.
                            </h2>
                            <div className="mt-8 space-y-6 text-base leading-8 text-[#aeb9cc] sm:text-lg">
                                <p>
                                    The Citizens&apos; Atlas is a collaborative, public effort. We invite citizens, community groups, and waste-worker collectives to share on-ground information about waste-to-energy projects, impacts on livelihoods, or gaps in official reporting.
                                </p>
                                <p>
                                    Submissions are vetted by the Atlas team and GAIA partners before being included. By partnering with us, you help strengthen transparency and amplify community voices in the fight against false waste solutions.
                                </p>
                                <p className="text-sm leading-7 text-[#95a5bf] sm:text-base">
                                    Evidence we accept: photos, text accounts, documented experiences, links to existing coverage.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#22385d] bg-[#0d2348] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="h-11 w-full rounded-md border border-[#244068] bg-[#071936] px-4 text-sm text-white outline-none transition focus:border-[#f3b23c]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="date" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                        Date
                                    </label>
                                    <input
                                        id="date"
                                        type="date"
                                        className="h-11 w-full rounded-md border border-[#244068] bg-[#071936] px-4 text-sm text-white outline-none transition focus:border-[#f3b23c]"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="contact" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                        Contact (Email or Phone)
                                    </label>
                                    <input
                                        id="contact"
                                        type="text"
                                        className="h-11 w-full rounded-md border border-[#244068] bg-[#071936] px-4 text-sm text-white outline-none transition focus:border-[#f3b23c]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="region" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                        Region
                                    </label>
                                    <input
                                        id="region"
                                        type="text"
                                        placeholder="City, Country"
                                        className="h-11 w-full rounded-md border border-[#244068] bg-[#071936] px-4 text-sm text-white placeholder:text-[#7e8fae] outline-none transition focus:border-[#f3b23c]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="photos" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                    Photos
                                </label>
                                <input
                                    id="photos"
                                    type="file"
                                    multiple
                                    className="block w-full text-sm text-[#aeb9cc] file:mr-4 file:rounded-md file:border-0 file:bg-[#284a79] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#32568b]"
                                />
                            </div>

                            <div>
                                <label htmlFor="issue" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                    Describe the Issue (Foul Odor, Loud Sounds, Pollution, Etc.)
                                </label>
                                <textarea
                                    id="issue"
                                    rows={3}
                                    className="w-full rounded-md border border-[#244068] bg-[#071936] px-4 py-3 text-sm text-white outline-none transition focus:border-[#f3b23c]"
                                />
                            </div>

                            <div>
                                <label htmlFor="consulted" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                    Have You Been Consulted by the Project Proponent or Local Government?
                                </label>
                                <select
                                    id="consulted"
                                    defaultValue="No"
                                    className="h-11 w-full rounded-md border border-[#244068] bg-[#071936] px-4 text-sm text-white outline-none transition focus:border-[#f3b23c]"
                                >
                                    <option>Yes</option>
                                    <option>No</option>
                                    <option>Not sure</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="operator" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                    Operating Company (If Known)
                                </label>
                                <input
                                    id="operator"
                                    type="text"
                                    className="h-11 w-full rounded-md border border-[#244068] bg-[#071936] px-4 text-sm text-white outline-none transition focus:border-[#f3b23c]"
                                />
                            </div>

                            <div>
                                <label htmlFor="observations" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                    What Is Happening — Observations and Impact at the Individual or Community Level
                                </label>
                                <textarea
                                    id="observations"
                                    rows={5}
                                    className="w-full rounded-md border border-[#244068] bg-[#071936] px-4 py-3 text-sm text-white outline-none transition focus:border-[#f3b23c]"
                                />
                            </div>

                            <div>
                                <label htmlFor="links" className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[#9cabc2]">
                                    Relevant Links (Articles Covering the Project)
                                </label>
                                <textarea
                                    id="links"
                                    rows={3}
                                    placeholder="One URL per line"
                                    className="w-full rounded-md border border-[#244068] bg-[#071936] px-4 py-3 text-sm text-white placeholder:text-[#7e8fae] outline-none transition focus:border-[#f3b23c]"
                                />
                            </div>

                            <div className="border-t border-[#22385d] pt-5">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={privacyAccepted}
                                        onChange={(e) => {
                                            setPrivacyAccepted(e.target.checked);
                                            if (e.target.checked) {
                                                setShowPrivacyModal(true);
                                            }
                                        }}
                                        className="mt-1 h-5 w-5 rounded border-[#244068] bg-[#071936] text-[#f3b23c] cursor-pointer accent-[#f3b23c]"
                                    />
                                    <div>
                                        <p className="text-sm text-white font-medium">
                                            I accept the Privacy Policy and Data Use Statement
                                        </p>
                                        <p className="text-xs text-[#9cabc2] mt-1">
                                            Please review our privacy policy before submitting your report
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-1">
                                <button
                                    type="reset"
                                    className="text-sm text-[#c2cbdb] transition hover:text-white"
                                >
                                    ← Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!privacyAccepted}
                                    className={`rounded-md px-6 py-3 text-sm font-semibold transition ${
                                        privacyAccepted
                                            ? 'bg-[#f3b23c] text-[#13284a] hover:bg-[#f7bf57]'
                                            : 'bg-[#6b7d9a] text-[#4a5568] cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    Submit report
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Modal */}
            {showPrivacyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-lg">
                        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-900">Privacy Policy and Data Use Statement</h2>
                            <button
                                onClick={() => setShowPrivacyModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6 px-6 py-6 text-gray-700">
                            <p>
                                The Citizen's Atlas collects, validates, and shares community experiences on false solutions projects across Asia and the Pacific. We value your privacy and are committed to handling the information you provide responsibly.
                            </p>

                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">How will we use your information?</h3>
                                <div className="space-y-3">
                                    <p>
                                        We may use the contact information you provide to <strong>get in touch with you about your submission</strong>, clarify information, or request additional details.
                                    </p>
                                    <p>
                                        Your personal information will <strong>not be sold to or shared with any third parties</strong>. We store your personal data securely and use it only to add primarily to the Citizen's Atlas. Where information from submissions is used for research, analysis, or other public-facing outputs, we will <strong>remove or anonymise personally identifying information</strong>, unless you have explicitly agreed to its publication.
                                    </p>
                                    <p>
                                        The access to this information is limited to only a few members of the Citizen's Atlas team invited to work directly on the website.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Language and accessibility</h3>
                                <div className="space-y-3">
                                    <p>
                                        <strong>English is currently the primary language used by the Citizen's Atlas team, and our capacity to translate submissions is currently limited.</strong> However, we welcome submissions in local and regional languages. Please share information in the language you are most comfortable using.
                                    </p>
                                    <p>
                                        If you provide your contact details, you may also ask us not to contact you further.
                                    </p>
                                    <p>
                                        In case of further questions or to request that your personal information be removed from our records, please contact us at <strong>[email address]</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <button
                                onClick={() => setShowPrivacyModal(false)}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerPage;