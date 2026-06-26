'use client'

import React from 'react';

const PartnerPage: React.FC = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <section className="bg-[#071936] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl rounded-[28px] bg-[#081a39] px-6 py-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-10 sm:py-10 lg:px-16 lg:py-14">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                    <div className="max-w-xl pt-2">
                        <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#9eaac2]">Partner With Us</p>
                        <h1 className="max-w-md font-serif text-4xl leading-none text-white sm:text-5xl lg:text-[4rem]">
                            An open reporting space for citizens.
                        </h1>
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
                        <div className="mb-6 flex justify-center rounded-2xl bg-white/95 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
                            <img
                                src="/fallback.jpg"
                                alt="GAIA"
                                className="w-full max-w-[220px] object-contain"
                            />
                        </div>
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

                            <div className="flex items-center justify-between gap-4 pt-1">
                                <button
                                    type="reset"
                                    className="text-sm text-[#c2cbdb] transition hover:text-white"
                                >
                                    ← Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-[#f3b23c] px-6 py-3 text-sm font-semibold text-[#13284a] transition hover:bg-[#f7bf57]"
                                >
                                    Submit report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerPage;