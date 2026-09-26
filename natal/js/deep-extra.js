/* Deeper readings for Moon phase, chart shape, hemispheres, quadrants and retrograde/stationary planets. */
window.AstroDeep = window.AstroDeep || {};

window.AstroDeep.phases = {
  "New Moon": {
    text: "At a New Moon birth the Sun and Moon sit together, so will and feeling fuse into one instinctive drive. You tend to act first and understand later, projecting yourself into life with a sense that something new is trying to begin through you. Other people's opinions matter less than your own inner push, which can make you a natural starter and a little oblivious to how you come across.\n\nThis phase carries the energy of a seed breaking open. Your life often has a quality of emergence: you keep arriving at fresh starts, sometimes before the last cycle is finished. The work is learning to see yourself from the outside, and to let experience shape the vision rather than insisting on it untested.",
    gifts: ["Instinctive courage", "Fresh vision", "Self-starting energy"],
    challenges: ["Subjective blind spots", "Impatience with process", "Starting over too often"],
    advice: "Ask one trusted person for honest feedback before a big launch, then trust your instinct with that information in hand.",
  },
  Crescent: {
    text: "Born in the crescent phase, the Moon has just pulled away from the Sun and a thin sliver of light is fighting to grow. You carry a feeling of pushing forward against resistance, often against the weight of family expectation, old habits or the pull of what came before. There is real determination here, and an early sense that you have to earn your place.\n\nThe crescent personality often feels the tension between security and growth. You may be drawn back toward what is safe just as you need to move on. Your strength comes from persisting through that pull. When you stop apologising for wanting something different, the momentum builds quickly and your efforts start to compound.",
    gifts: ["Determination", "Resourcefulness", "Growing confidence"],
    challenges: ["Pull of the past", "Self-doubt early on", "Fear of outgrowing others"],
    advice: "Name the old voice that tells you to stay small, and take one concrete step each week that it would disapprove of.",
  },
  "First Quarter": {
    text: "At the first quarter the Moon stands at a right angle to the Sun: a crisis-in-action phase. You tend to meet life by doing, building and breaking through. Obstacles energise you more than they discourage you, and you often feel most alive when something needs to be fixed, cleared or constructed from scratch.\n\nThis is a strong-willed, structure-building birth. You may clear away old forms, sometimes abruptly, to make room for what you believe in. The risk is living in permanent emergency, pushing when a pause would serve better. At your best you are a builder of lasting things, and people trust you to turn a plan into something that stands.",
    gifts: ["Decisive action", "Builder's stamina", "Thrives under pressure"],
    challenges: ["Manufacturing crises", "Forcefulness", "Burnout from constant effort"],
    advice: "Before you push through, ask whether the obstacle is a wall to break or a signal to change direction.",
  },
  Gibbous: {
    text: "Born in the gibbous phase, the Moon is nearly full and working toward completion. You are a refiner: you analyse, question, improve and polish. There is a strong need to understand why things work and to perfect your craft, and you often feel that something is almost, but not quite, right yet.\n\nThis phase gives a seeker's mind and a devotion to growth through study and practice. You can be a gifted student, editor, researcher or helper. The shadow is perfectionism, and the sense that you cannot rest until everything is flawless. Your growth lies in letting the work be good enough to share, because its value comes alive in other people's hands.",
    gifts: ["Analytical depth", "Dedication to craft", "Continuous improvement"],
    challenges: ["Perfectionism", "Self-criticism", "Holding work back"],
    advice: "Set a clear finish line for each project and release it when you reach it, even if you can still see flaws.",
  },
  "Full Moon": {
    text: "At a Full Moon birth the Sun and Moon face each other across the sky, so your life is shaped by awareness through contrast. You see things clearly by holding opposites side by side: your needs and someone else's, head and heart, private life and public role. Relationships are central, because other people act as mirrors that show you who you are.\n\nThis phase brings illumination and a sense of fulfilment when you find balance. It can also bring inner tension, as though two parts of you want different things. You are often highly perceptive about people and gifted at bringing hidden things into the open. The work is integration: letting both sides of the seesaw belong to you.",
    gifts: ["Perceptive awareness", "Relationship insight", "Ability to see both sides"],
    challenges: ["Inner division", "Projecting onto partners", "Emotional swings"],
    advice: "When a relationship frustrates you, ask which part of yourself the other person is reflecting back to you.",
  },
  Disseminating: {
    text: "Born in the disseminating phase, the Moon is waning after fullness, and you carry the urge to share what has been learned. You are a natural teacher, communicator or populariser. Ideas and experiences feel incomplete to you until they have been passed on, explained or put to use for others.\n\nThis phase often shows as a strong belief system or message. You may feel you have something important to say and look for platforms to say it. The shadow is preaching, or clinging so tightly to a truth that you stop learning. At your best you translate wisdom into something practical that changes how people live.",
    gifts: ["Teaching ability", "Clear message", "Generous sharing"],
    challenges: ["Preachiness", "Rigid convictions", "Needing an audience"],
    advice: "Pair every message you share with a genuine question, so teaching stays a two-way exchange.",
  },
  "Last Quarter": {
    text: "At the last quarter the Moon again stands at a right angle to the Sun, this time waning: a crisis-in-consciousness phase. You tend to question inherited beliefs and quietly reorient your values. Where the first quarter builds structures, you see through them, and you often find yourself turning away from what no longer rings true.\n\nThis phase gives an independent, reforming mind. You may lead change behind the scenes, living by principle before others are ready. It can also bring a sense of being out of step, or a habit of rejecting before you are rejected. Your gift is conscious change: letting go with purpose and pointing toward what should come next.",
    gifts: ["Independent thinking", "Principled change", "Seeing past appearances"],
    challenges: ["Detachment", "Restless dissatisfaction", "Burning bridges"],
    advice: "When you feel the urge to walk away, write down what you want to keep before deciding what to release.",
  },
  Balsamic: {
    text: "Born in the balsamic phase, the last sliver of Moon is fading before the next New Moon. This is traditionally an old-soul birth: you carry a sense of completion, of wrapping up something bigger than this life. You may feel older than your years, drawn to solitude, spirituality or the future, and aware of patterns other people miss.\n\nThis phase is prophetic and transitional. You release what is finished so the next cycle can begin, and you often act as a bridge between one era and the next. The shadow is withdrawal, fatigue or feeling that you do not belong in the present. Your gift is wisdom distilled from experience, and a quiet sense of where things are heading.",
    gifts: ["Intuition and foresight", "Wisdom beyond years", "Capacity to let go"],
    challenges: ["Withdrawal", "Feeling out of time", "Low energy for the ordinary"],
    advice: "Protect regular time alone, then bring what you receive there back into one practical daily commitment.",
  },
};

window.AstroDeep.shapes = {
  bundle: {
    name: "Bundle",
    text: "All ten planets sit within about a third of the zodiac. This concentrates your life energy into a narrow band of experience. You tend to be focused, self-contained and highly capable within your chosen field, with a strong sense of what matters to you. The empty part of the chart is not a gap in your life so much as territory you meet through other people and circumstances. The risk is a narrow outlook; the gift is depth and specialisation that others rarely match.",
  },
  bowl: {
    name: "Bowl",
    text: "Your planets occupy one half of the chart and leave the other half empty. A bowl chart is self-contained and purposeful: you carry what you have, and you are driven to fill the empty half through experience, service or a cause. There is often a sense of mission and a clear awareness of what is missing. The leading planet at the rim of the bowl often shows how you move out into the world.",
  },
  bucket: {
    name: "Bucket",
    text: "Nine planets gather in one half of the chart while a single planet, the handle, stands alone on the other side. The handle becomes a focal point and a lever for the whole chart: its sign, house and meaning describe how you pour your energy out into the world. You tend to have one overriding drive or channel, and life often organises itself around it.",
  },
  locomotive: {
    name: "Locomotive",
    text: "Your planets fill about two thirds of the zodiac and leave an empty trine of at least 120°. The locomotive is a pattern of drive and self-propulsion: you have a strong sense of something missing and a practical determination to supply it. The leading planet, at the front edge of the procession, acts as the engine and shows where your momentum comes from.",
  },
  seesaw: {
    name: "Seesaw",
    text: "Your planets fall into two groups facing each other across the chart, separated by two empty spaces. Life is lived through opposites and choices: this or that, self or other, work or home. You weigh things carefully and can see both sides of any argument. The challenge is indecision or swinging between extremes; the gift is balance, fairness and an ability to reconcile what seems opposed.",
  },
  splash: {
    name: "Splash",
    text: "Your planets are spread evenly around the wheel, touching many signs and houses. This gives wide interests, versatility and an appetite for all of life. You can relate to many kinds of people and situations. The risk is scattering your energy across too much; the gift is breadth, adaptability and a life that rarely feels one-dimensional.",
  },
  splay: {
    name: "Splay",
    text: "Your planets cluster in irregular groups around the wheel rather than any neat pattern. The splay chart belongs to individualists: you resist being categorised, follow your own interests and build a life around several strong centres of focus. Others may find you hard to predict. Your gift is originality and the confidence to go your own way.",
  },
};

window.AstroDeep.hemis = {
  above: "Most of your planets are above the horizon, in houses 7 to 12. Life tends to be oriented outward, toward the public, the social and the objective. You are often more visible than you realise, and your development comes through engagement with the world, other people and your role in it. Achievement and contribution can matter more to you than privacy.",
  below: "Most of your planets are below the horizon, in houses 1 to 6. Life tends to be oriented inward, toward the personal, the private and the subjective. You develop through self-knowledge, family, skills and daily life before stepping into public roles. You may be more reserved than you seem, and you often do your best work away from the spotlight.",
  east: "Most of your planets are in the eastern half of the chart, around the Ascendant. This favours self-determination: you create your own circumstances and prefer to set the pace. You are at your best when you take initiative, and waiting for others to move can frustrate you.",
  west: "Most of your planets are in the western half of the chart, around the Descendant. Life unfolds through other people: partners, clients, collaborators and timing. You adapt well and often find that opportunities arrive through relationships, so learning to cooperate without losing yourself is central.",
  balancedVertical: "Your planets are balanced above and below the horizon, giving an even mix of private and public life.",
  balancedHorizontal: "Your planets are balanced east and west, giving an even mix of self-direction and responsiveness to others.",
};

window.AstroDeep.quadrants = {
  1: { name: "Quadrant I · houses 1–3", text: "Self-development. Planets here focus energy on identity, resources and learning. You build yourself first, often independently, and your early life shapes you strongly." },
  2: { name: "Quadrant II · houses 4–6", text: "Self-expression. Planets here focus energy on home, creativity and daily craft. Emotional roots, creative play and useful work are where you grow." },
  3: { name: "Quadrant III · houses 7–9", text: "Relationship and understanding. Planets here focus energy on partnership, intimacy and belief. You learn about yourself through others and through expanding your worldview." },
  4: { name: "Quadrant IV · houses 10–12", text: "Contribution to the world. Planets here focus energy on career, community and the collective. Your development is tied to your public role and to what you give back." },
};

window.AstroDeep.retro = {
  mercury: "Mercury retrograde at birth turns the mind inward. You tend to think before speaking, rehearse conversations and process information in loops, returning to ideas until they settle. Learning may follow an unconventional path, and you may understand things slowly at first but more deeply than others in the end. Writing, reflection and research often suit you better than quick-fire debate. Karmically, Mercury retrograde suggests revisiting how you speak your truth and how you listen.",
  venus: "Venus retrograde at birth turns love and values inward. You may feel that your tastes and standards are different from those around you, or that love arrives in unusual ways and at unusual times. Past relationships, including old flames, tend to return for resolution. Self-worth is built from the inside rather than borrowed from approval. Karmically this is associated with old-soul standards of love and the task of learning to value yourself first.",
  mars: "Mars retrograde at birth turns drive inward. You may hesitate before acting, then act with great intensity once you have decided. Anger can be held for a long time and released all at once, so conscious outlets matter: exercise, craft, competition with yourself. You often work best at your own pace rather than in open conflict. Karmically this suggests re-learning how to assert desire without repeating old battles.",
  jupiter: "Jupiter retrograde at birth makes faith and growth personal. You tend to question conventional beliefs and build your own philosophy from experience. Opportunities may come through inner development rather than luck handed to you. Generosity can be quiet, and you may be wiser than you appear. Karmically this is about finding meaning that you have tested for yourself.",
  saturn: "Saturn retrograde at birth makes you your own strictest authority. Rules imposed from outside matter less than the standards you set yourself, which can be very high. Responsibility may have come early, or a parent may have been absent or inconsistent, prompting you to build inner structure. Mastery tends to arrive later but is deeply earned. Karmically this suggests unfinished duties being completed from within.",
  uranus: "Uranus retrograde at birth turns rebellion and awakening inward. Your originality may be quieter than it looks, expressed through independent thinking rather than public disruption. Sudden insights and inner breakthroughs matter more than outward revolt. The outer planets are retrograde for around five months each year, so this is common and shared by many born near you.",
  neptune: "Neptune retrograde at birth turns imagination and spirituality inward. You may have a rich inner life, vivid dreams and strong intuitions that you keep private. Discernment between vision and illusion is a lifelong practice. This placement is shared by many born in the same months, so its personal meaning depends on Neptune's house and aspects.",
  pluto: "Pluto retrograde at birth turns transformation inward. Deep change happens privately, often through reflection, therapy or quiet crisis, rather than dramatic outward upheaval. You may revisit old themes of power and control to resolve them for good. Pluto is retrograde around half of each year, so the house it occupies says more about you than the retrograde itself.",
  chiron: "Chiron retrograde at birth suggests the wound is worked through privately. You may take a long time to recognise it, and healing tends to come from looking within rather than from outside fixes. Once you have made peace with it, your insight into others' pain becomes a quiet strength.",
  none: "Every planet was moving direct when you were born. Energy tends to flow outward with little hesitation: you act on ideas, express desires openly and engage with life at face value. The growth edge is building in time for reflection, since you rarely have planets that force you to slow down and review.",
  stationary: "A planet is stationary when it is almost motionless, about to change direction between direct and retrograde. Astrologers treat a stationary planet as unusually powerful and concentrated: its themes become a signature of the whole chart. Whatever that planet represents, you are likely to feel it strongly and express it intensely.",
};
