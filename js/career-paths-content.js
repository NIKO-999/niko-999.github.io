'use strict';

/**
 * Destiny Matrix — Career Paths by Arcana
 * ─────────────────────────────────────────
 * Source: research/01-Foundation/DestinyMatrix-Sheet.extracted.md,
 * Page 12, "Best Career Paths For Each Arcana (Money Channel)" — a
 * 22-row table (Arcana → "Money through..." theme → career suggestions),
 * re-extracted via page rasterization. Rewritten here into continuous
 * Golden Standard prose per NON_NEGOTIABLE_RULES (no bullet points, no
 * keyword lists in user-facing text) — the underlying career-type
 * content is the source's, not invented, only the sentence-level voice
 * is original.
 *
 * Arcana-keyed only (not position-specific) — same shape as
 * DUniversalLawContent.getMatch(). Currently surfaced on the Money
 * Entry Point star only, since the source page's own header ties this
 * table to the Money Channel; not a standalone position.
 *
 * API:
 *   DCareerPathsContent.get(arcanaNum) → { heading, text } or null
 */

window.DCareerPathsContent = (function () {

  const paths = {

    1: {
      heading: `Money Moves Through Initiative and Leadership`,
      text: `Your income tends to open up wherever you're the one setting things in motion — starting the venture, pitching the idea, stepping forward when a room is waiting for someone to lead. Entrepreneurship, project management, sales and marketing strategy, public speaking, and business coaching are the shapes this most often takes for you. You are allowed to be paid simply for beginning things well. What venture is waiting on you to make the first move?`,
    },
    2: {
      heading: `Money Moves Through Depth and Quiet Perception`,
      text: `Your income tends to open up wherever your gift for reading beneath the surface actually gets used — psychology and therapy, numerology or astrology, research and analysis, consulting, writing and editing. These are all places where depth itself is the product, not a side effect of it. You are allowed to be paid for perception, not just production. Where does your unproven sense keep being right at work — and who needs to know that?`,
    },
    3: {
      heading: `Money Moves Through Creation and Nurturing Beauty`,
      text: `Your income tends to open up wherever you're making something beautiful or tending something that grows — design work across graphic, interior, or fashion disciplines, the beauty and cosmetics industry, content creation, art direction, or ventures built around and for women. You are allowed to grow something at its own pace and call that productivity. What have you been cultivating professionally that's closer to harvest than it looks?`,
    },
    4: {
      heading: `Money Moves Through Structure and Authority`,
      text: `Your income tends to open up wherever you're the one holding the structure together — business ownership, executive leadership, administration and management, government or corporate leadership, real estate development. You are allowed to design the system instead of surviving inside one. What structure would you build if someone finally handed you the blueprint pen?`,
    },
    5: {
      heading: `Money Moves Through Teaching and Guidance`,
      text: `Your income tends to open up wherever you're passing on what you know — teaching and mentoring, spiritual guidance or coaching, HR and consulting work, training and lecturing, or building an education-centered business of your own. You are allowed to teach while you're still learning. What knowledge of yours is ready to be passed on exactly as it is?`,
    },
    6: {
      heading: `Money Moves Through People and Genuine Connection`,
      text: `Your income tends to open up wherever the work runs through real relationship — relationship coaching, HR and recruiting, sales management, brand partnerships, PR and communications. You are allowed to make people the work, not the interruption of it. Where does your gift for connection already produce what no process could?`,
    },
    7: {
      heading: `Money Moves Through Momentum and Results`,
      text: `Your income tends to open up wherever forward motion is rewarded directly — logistics and transportation, the sports industry, event management, travel, operations. You are allowed to drive hard toward what's actually yours. What professional destination would justify the full force of your momentum?`,
    },
    8: {
      heading: `Money Moves Through Fairness and Responsibility`,
      text: `Your income tends to open up wherever precision and integrity are the actual job — law and legal consulting, accounting and auditing, financial analysis, compliance work, contract management. You are allowed to profit from your honesty rather than despite it. Where has being the truthful one already become your quiet competitive edge?`,
    },
    9: {
      heading: `Money Moves Through Mastery Earned Alone`,
      text: `Your income tends to open up wherever deep, singular expertise is the product — niche consulting, analysis and strategy, therapeutic or healing work, research, or building something as a solo entrepreneur. You are allowed to go deep alone and surface with something valuable. What mastery are you building in private that the world hasn't priced yet?`,
    },
    10: {
      heading: `Money Moves Through Trends and Adaptability`,
      text: `Your income tends to open up wherever timing and flexibility are the real skill — marketing, trading and investment, business development, tourism, or freelance work spread across multiple projects at once. You are allowed to work with your seasons instead of against your calendar. What would your career look like if timing became a tool instead of an obstacle?`,
    },
    11: {
      heading: `Money Moves Through Charisma and Presence`,
      text: `Your income tends to open up wherever your energy in a room is the actual value — coaching and motivational work, personal branding, fitness and wellness, performing or public life, leadership roles built on presence rather than title. You are allowed to count your presence as labor. What rooms change when you enter them — and are you being valued for that yet?`,
    },
    12: {
      heading: `Money Moves Through Patient, Devoted Service`,
      text: `Your income tends to open up wherever staying with someone through something slow and real is the job itself — psychology and counseling, medical or caregiving professions, social work, spiritual service, long-term transformational work. You are allowed to do the staying work and let it sustain you too. Whose pain have you stayed with lately — and who stays with yours?`,
    },
    13: {
      heading: `Money Moves Through Genuine Transformation`,
      text: `Your income tends to open up wherever real endings and real renewal are the work — crisis management, psychotherapy, transformation coaching, medicine focused on surgery or rehabilitation, change management. You are allowed to bury the old career with honors and walk on. What professional identity has already served its full term?`,
    },
    14: {
      heading: `Money Moves Through Harmony and Integration`,
      text: `Your income tends to open up wherever separate things get blended into something that actually works together — holistic healing, nutrition and wellness coaching, mediation, integrative specialties, lifestyle consulting. You are allowed to be the blend the industry didn't have a title for. Which of your combined skills is actually the product?`,
    },
    15: {
      heading: `Money Moves Through an Honest Relationship With Power`,
      text: `Your income tends to open up wherever material reality and real influence meet directly — business and finance, sales and negotiation, entertainment, the luxury market, or work that requires genuinely understanding the psychology of money and persuasion. You are allowed to understand power without being owned by it. What could your honest read of money and influence build if you aimed it somewhere clean?`,
    },
    16: {
      heading: `Money Moves Through Rebuilding and Reform`,
      text: `Your income tends to open up wherever something needs to be reconstructed stronger than it was — engineering and architecture, IT and cybersecurity, crisis and risk management, construction, systems transformation. You are allowed to say the structure is failing before it's polite. What collapse do you currently see coming that your integrity wants named?`,
    },
    17: {
      heading: `Money Moves Through Visibility and Inspiration`,
      text: `Your income tends to open up wherever hope and visibility are the product — blogging and influence work, art and creative fields, media and online projects, social initiatives, monetizing your own personal brand. You are allowed to be seen at the scale of your actual gift. What work would you show publicly this month if visibility paid what it actually pays?`,
    },
    18: {
      heading: `Money Moves Through Emotion and the Subconscious`,
      text: `Your income tends to open up wherever feeling and the unseen are given real form — psychology and therapy, filmmaking, photography, esoteric practice, creative work built around emotional healing. You are allowed to follow the professional hunch past the explainable. What direction keeps tugging that your resume can't justify yet?`,
    },
    19: {
      heading: `Money Moves Through Joy and Open Success`,
      text: `Your income tends to open up wherever genuine warmth and visible success are welcome — public speaking, teaching children, the entertainment industry, creative leadership, building a personal brand around openness itself. You are allowed to earn from work that feels like being yourself. Where does your labor still require a costume?`,
    },
    20: {
      heading: `Money Moves Through Calling and Awakening`,
      text: `Your income tends to open up wherever a genuine sense of mission is allowed to lead — coaching and mentorship, public service, social projects, speaking on subjects that actually matter, transformational education. You are allowed to answer the calling that keeps calling. What work do you keep returning to in your mind — and what is one real step toward it?`,
    },
    21: {
      heading: `Money Moves Through Global Reach and Integration`,
      text: `Your income tends to open up wherever the scale is genuinely large — international business and trade, digital platforms and online ecosystems, cross-border projects, travel and relocation services, large networks and communities. You are allowed to work at the size of the whole map. What border — literal or invented — is your work ready to cross?`,
    },
    22: {
      heading: `Money Moves Through Freedom and Original Work`,
      text: `Your income tends to open up wherever the work refuses a fixed shape — freelancing, creative entrepreneurship, a digital-nomad life, startups and experimental ventures, work that doesn't fit a standard job title at all. You are allowed to begin before the guarantee arrives. What venture would you open this year if faith counted as capital?`,
    },

  };

  function get(arcanaNum) {
    return paths[arcanaNum] || null;
  }

  return { get };

})();
