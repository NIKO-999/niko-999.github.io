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
 * Arcana-keyed only (not position-specific). Currently surfaced on the
 * Money Entry Point star only, since the source page's own header ties
 * this table to the Money Channel; not a standalone position.
 *
 * API:
 *   DCareerPathsContent.get(arcanaNum) → { heading, text } or null
 */

window.DCareerPathsContent = (function () {

  const paths = {

    1: {
      heading: `Money Moves Through Initiative and Leadership`,
      text: `You get paid for going first. Not for having the safest idea — for actually starting it while everyone else is still deciding. Entrepreneurship, project management, sales and marketing strategy, public speaking, business coaching: anywhere the room is waiting for someone to move, that's where your income opens up.`,
    },
    2: {
      heading: `Money Moves Through Depth and Quiet Perception`,
      text: `You get paid for seeing what's underneath. Psychology and therapy, numerology or astrology, research and analysis, consulting, writing and editing — anywhere depth itself is the product, not a byproduct of it, your read on things is worth real money.`,
    },
    3: {
      heading: `Money Moves Through Creation and Nurturing Beauty`,
      text: `You get paid for making things grow. Design across graphic, interior, or fashion work, beauty and cosmetics, content creation, art direction, ventures built for women — anywhere something needs to be made beautiful or tended, that's your income.`,
    },
    4: {
      heading: `Money Moves Through Structure and Authority`,
      text: `You get paid for holding the whole thing together. Business ownership, executive leadership, administration and management, government or corporate leadership, real estate development — you build the system instead of just surviving inside someone else's.`,
    },
    5: {
      heading: `Money Moves Through Teaching and Guidance`,
      text: `You get paid for what you already know. Teaching and mentoring, spiritual guidance or coaching, HR and consulting, training and lecturing, or building your own education-centered business — you don't need to finish learning first to start teaching.`,
    },
    6: {
      heading: `Money Moves Through People and Genuine Connection`,
      text: `You get paid because people trust you. Relationship coaching, HR and recruiting, sales management, brand partnerships, PR and communications — anywhere the work runs through real connection instead of process, that's where you earn.`,
    },
    7: {
      heading: `Money Moves Through Momentum and Results`,
      text: `You get paid for finishing. Logistics and transportation, the sports industry, event management, travel, operations — anywhere forward motion gets rewarded directly, your drive is the asset.`,
    },
    8: {
      heading: `Money Moves Through Fairness and Responsibility`,
      text: `You get paid for being straight. Law and legal consulting, accounting and auditing, financial analysis, compliance, contract management — precision and honesty aren't a limitation here, they're the entire job.`,
    },
    9: {
      heading: `Money Moves Through Mastery Earned Alone`,
      text: `You get paid for what you figured out by yourself. Niche consulting, analysis and strategy, therapeutic or healing work, research, solo entrepreneurship — deep expertise built in private is still the product, even if nobody watched you build it.`,
    },
    10: {
      heading: `Money Moves Through Trends and Adaptability`,
      text: `You get paid for reading the room before it changes. Marketing, trading and investment, business development, tourism, freelance work spread across multiple projects — timing is the actual skill here, not a bonus.`,
    },
    11: {
      heading: `Money Moves Through Charisma and Presence`,
      text: `You get paid for the energy you bring into a room. Coaching and motivational work, personal branding, fitness and wellness, performing, leadership built on presence instead of title — your presence is labor, and it's billable.`,
    },
    12: {
      heading: `Money Moves Through Patient, Devoted Service`,
      text: `You get paid for staying. Psychology and counseling, medical or caregiving professions, social work, spiritual service, long-term transformational work — anywhere the job is to stay with someone through something slow and real, that's yours.`,
    },
    13: {
      heading: `Money Moves Through Genuine Transformation`,
      text: `You get paid for real endings and real rebuilds. Crisis management, psychotherapy, transformation coaching, surgical or rehabilitative medicine, change management — you're built for the work other people avoid because it means something has to actually end first.`,
    },
    14: {
      heading: `Money Moves Through Harmony and Integration`,
      text: `You get paid for blending what other people keep separate. Holistic healing, nutrition and wellness coaching, mediation, integrative specialties, lifestyle consulting — the combination itself is the product.`,
    },
    15: {
      heading: `Money Moves Through an Honest Relationship With Power`,
      text: `You get paid for understanding money and influence without needing to be owned by either. Business and finance, sales and negotiation, entertainment, the luxury market, work built on the psychology of persuasion — that clarity is worth more than most people's ambition.`,
    },
    16: {
      heading: `Money Moves Through Rebuilding and Reform`,
      text: `You get paid for saying the structure is failing before anyone else will admit it. Engineering and architecture, IT and cybersecurity, crisis and risk management, construction, systems transformation — you rebuild it stronger, not just patch it.`,
    },
    17: {
      heading: `Money Moves Through Visibility and Inspiration`,
      text: `You get paid for being seen. Blogging and influence work, art and creative fields, media and online projects, social initiatives, monetizing your own personal brand — visibility isn't vanity here, it's the actual mechanism of your income.`,
    },
    18: {
      heading: `Money Moves Through Emotion and the Subconscious`,
      text: `You get paid for giving shape to what most people can't explain. Psychology and therapy, filmmaking, photography, esoteric practice, creative work built around emotional healing — follow the hunch your resume can't justify yet.`,
    },
    19: {
      heading: `Money Moves Through Joy and Open Success`,
      text: `You get paid for being genuinely yourself in public. Public speaking, teaching children, the entertainment industry, creative leadership, building a personal brand around openness itself — the work that doesn't require a costume is the work that pays.`,
    },
    20: {
      heading: `Money Moves Through Calling and Awakening`,
      text: `You get paid for answering the thing you keep coming back to. Coaching and mentorship, public service, social projects, speaking on subjects that actually matter, transformational education — the mission you can't put down is the career.`,
    },
    21: {
      heading: `Money Moves Through Global Reach and Integration`,
      text: `You get paid at scale. International business and trade, digital platforms and online ecosystems, cross-border projects, travel and relocation services, large networks and communities — your work was never meant to stay small.`,
    },
    22: {
      heading: `Money Moves Through Freedom and Original Work`,
      text: `You get paid for refusing the fixed shape. Freelancing, creative entrepreneurship, a digital-nomad life, startups and experimental ventures, work that doesn't fit a standard job title — you don't wait for the guarantee before you start.`,
    },

  };

  function get(arcanaNum) {
    return paths[arcanaNum] || null;
  }

  return { get };

})();
