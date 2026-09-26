/* Synastry readings: what contacts between two people's planets tend to mean. */
window.AstroDeep = window.AstroDeep || {};

window.AstroDeep.synastry = window.AstroDeep.synastry || {};
window.AstroDeep.synastry.intro = "Synastry compares two birth charts by laying one over the other and noticing where each person's planets touch the other's. A contact between your Venus and their Mars, or your Moon and their Saturn, describes a particular current running between you: where you light each other up, where you feel at home, and where you rub against each other. It does not describe either of you alone. It describes what happens in the space you share.\n\nNo single aspect makes or breaks a relationship. A hard Saturn contact can sit inside a deeply loving, lasting bond, and a dazzling Venus trine can fizzle if nothing else supports it. Read the overall pattern: which themes repeat, which planets are most involved, and whether the easy links give you enough goodwill to work through the difficult ones. Treat the difficult contacts as places that ask for skill and honesty, not as verdicts.";
window.AstroDeep.synastry.categories = {
  attraction: "This measures the pull between you: the chemistry, desire and fascination that draws you together and keeps you curious. It weighs Venus and Mars contacts most heavily, along with Sun and Moon links and the intensity of any Pluto contacts.",
  emotional: "This measures how safe, understood and cared for you feel with each other. It draws mainly on Moon contacts, especially Moon with Venus and Moon with Sun, which show whether your instinctive needs fit together.",
  communication: "This measures how easily you talk, think and solve problems together. It is built from Mercury contacts, which show whether your minds click, spark or talk past each other.",
  stability: "This measures the capacity for commitment, loyalty and building something that lasts. It leans on Saturn contacts, the overall harmony between Sun and Moon, and Juno contacts where they are present.",
  growth: "This measures how much you expand, heal and move toward your purpose through each other. It draws on Jupiter, North Node and Chiron contacts, which show where the relationship stretches both of you in meaningful directions.",
  challenge: "This measures the friction you are likely to meet: the squares and oppositions that create pressure, especially those involving Mars, Saturn, Pluto and Uranus. A high score is not a warning to leave, it shows where the relationship will ask the most of you."
};
window.AstroDeep.synastry.pairs = {
  "sun-sun": {
    theme: "Two central fires",
    text: "When your Suns connect, your core identities meet directly. Each of you recognises something of your own purpose and way of shining in the other, and that recognition can feel like instant respect or instant rivalry, depending on the angle. This contact says a lot about whether your life directions support each other or compete for the same space.\n\nIt is less about romance than about companionship of spirit. When it works, you feel like two people on compatible paths, each confident enough to cheer the other on without feeling diminished.",
    fusion: "Your Suns in the same place means you share a core drive and style, which brings deep familiarity and sometimes a sense that there is only room for one of you in the spotlight.",
    harmony: "Your identities flow easily together: you like who the other person is, and your goals tend to support each other without much negotiation.",
    tension: "Your wills pull in different directions, so you may compete, misread each other's motives or feel the other is always taking the lead. Respect for difference is the skill this asks for."
  },
  "sun-moon": {
    theme: "Classic complement",
    text: "This is one of the most traditional signs of compatibility. The Sun person's sense of purpose meets the Moon person's emotional needs, and the two often slot together like sunlight and a reflecting surface. The Moon person tends to feel warmed and seen by the Sun person, while the Sun person feels accepted and supported at a gut level.\n\nThe risk is a quiet imbalance, where the Sun person leads and the Moon person adapts. The contact works best when the Sun person notices the Moon person's needs as clearly as the Moon person notices theirs.",
    fusion: "The conjunction is a strong bond of belonging: the Moon person feels instinctively at home with the Sun person, and the Sun person feels deeply understood.",
    harmony: "There is an easy, natural fit between what the Sun person wants to be and what the Moon person needs to feel safe, which makes daily life together feel smooth.",
    tension: "The Sun person's plans can seem to override the Moon person's feelings, and the Moon person's moods can seem to block the Sun person's direction. Name needs out loud rather than hoping they will be guessed."
  },
  "sun-mercury": {
    theme: "Minds meet the self",
    text: "The Mercury person tends to understand the Sun person's ideas, plans and personality quickly, and can put into words things the Sun person has only half formed. The Sun person, in turn, gives the Mercury person's thinking a sense of importance and direction. This is a good contact for friendship, working together and long conversations that go somewhere.\n\nIt is a mental rather than emotional link. It adds clarity and interest to a relationship but does not on its own create closeness. Its gift is that you rarely run out of things to say.",
    fusion: "The Mercury person thinks in a way that closely mirrors the Sun person's identity, so conversation feels effortless and the Sun person feels genuinely understood.",
    harmony: "Ideas flow easily between you, and the Mercury person is a helpful sounding board for the Sun person's plans.",
    tension: "The Mercury person may critique or overanalyse what the Sun person holds dear, and the Sun person may not listen closely enough. Ask before offering opinions on each other's projects."
  },
  "sun-venus": {
    theme: "Warm admiration",
    text: "This is an affectionate, appreciative contact. The Venus person tends to find the Sun person attractive and admirable, and the Sun person feels valued and enjoyed simply for being themselves. There is often an easy pleasure in each other's company, a shared taste in some things, and a natural generosity.\n\nIt is one of the gentler signs of romantic interest and also sweetens friendships. Its weakness is that it can be a little too comfortable: flattery can replace honesty. Let the warmth carry you through hard conversations rather than letting it cover them over.",
    fusion: "The Venus person is drawn to the very heart of the Sun person, bringing strong affection and a feeling of being cherished.",
    harmony: "Liking comes easily here: you enjoy each other, share pleasures and tend to bring out each other's charm.",
    tension: "Attraction is still present, but values may clash, or the Venus person may feel their affection is taken for granted. Small gestures of appreciation go a long way."
  },
  "sun-mars": {
    theme: "Energy and drive",
    text: "The Mars person energises and activates the Sun person, and the Sun person gives the Mars person's drive something to aim at. This can produce strong physical attraction, a sense of adventure and a partnership that gets things done. You tend to push each other, sometimes productively, sometimes into arguments.\n\nThe contact is lively rather than restful. It brings courage and momentum, and it can bring competitiveness or irritation if both of you want to lead. Shared physical activity and common goals help channel the heat usefully.",
    fusion: "The Mars person's drive lands squarely on the Sun person's identity, bringing strong chemistry and a lot of fire, along with the potential for heated clashes.",
    harmony: "You motivate each other well: the Mars person backs the Sun person's aims with energy and the Sun person admires the Mars person's courage.",
    tension: "The Mars person can feel pushy or combative to the Sun person, and the Sun person can feel dismissive to the Mars person. Take a pause before reacting, and fight about the issue, not the person."
  },
  "sun-jupiter": {
    theme: "Generous encouragement",
    text: "The Jupiter person tends to believe in the Sun person, and the Sun person feels bigger, more hopeful and more capable in their company. This is a lucky, generous contact: you open doors for each other, share laughter and widen each other's horizons through travel, ideas or faith.\n\nIts gift is optimism. Its risk is excess, where you encourage each other to overspend, overcommit or skip the practical details. It is rarely a source of real conflict, and it adds a lot of goodwill to a relationship that also has more demanding contacts.",
    fusion: "The Jupiter person amplifies the Sun person's confidence and vision, and the relationship often feels blessed with opportunity.",
    harmony: "Mutual encouragement flows naturally, and you tend to grow wiser and happier together.",
    tension: "The Jupiter person's advice may feel preachy or overblown to the Sun person, or you may feed each other's tendency to promise too much. Keep one foot on the ground."
  },
  "sun-saturn": {
    theme: "Commitment and weight",
    text: "Sun and Saturn contacts are a classic sign of lasting bonds. The Saturn person brings structure, responsibility and a sense of seriousness to the Sun person, who in turn gives the Saturn person something worth committing to. There is often a feeling of duty, loyalty and building something real.\n\nThe cost can be heaviness. The Saturn person may criticise, restrain or parent the Sun person, and the Sun person may feel judged or held back. When both of you respect the other, this contact becomes a steady backbone that outlasts easier attractions.",
    fusion: "The Saturn person sits right on the Sun person's identity: a strong sense of commitment, with a real need to keep criticism kind and to leave the Sun person room to shine.",
    harmony: "The Saturn person offers reliable support and practical guidance, and the Sun person feels grounded rather than restricted.",
    tension: "The Sun person may feel judged, blocked or never quite good enough, and the Saturn person may feel their caution is ignored. Say what you value in each other as often as you say what worries you."
  },
  "sun-uranus": {
    theme: "Electric awakening",
    text: "The Uranus person wakes the Sun person up. There is excitement, surprise and a feeling that life has become more interesting, often from the first meeting. The Uranus person encourages the Sun person to be more original and free, while the Sun person gives the Uranus person a steady centre to spin around.\n\nThe same current that thrills can also unsettle. The connection may be on and off, unpredictable or hard to pin down. It works best when both of you give each other space and treat freedom as part of the bond rather than a threat to it.",
    fusion: "The attraction is sudden and striking, and the Uranus person keeps disrupting the Sun person's routines in ways that are both freeing and destabilising.",
    harmony: "You inspire each other's individuality and enjoy an unconventional, friendly bond with plenty of room to breathe.",
    tension: "The Uranus person can feel unreliable and the Sun person can feel controlling. Agree on what freedom and commitment each mean to you before either feels trapped."
  },
  "sun-neptune": {
    theme: "Dreamlike idealism",
    text: "This contact brings a romantic, spiritual or artistic glow. The Neptune person tends to see the Sun person through a flattering haze, and the Sun person feels inspired and gently enchanted. There can be real compassion, creativity and a sense of soul recognition.\n\nThe danger is illusion. One or both of you may see what you want to see, avoid awkward truths or slide into rescuing and being rescued. The contact stays beautiful when you keep checking the dream against what is actually happening, and when kindness includes honesty.",
    fusion: "The Neptune person idealises the Sun person strongly, bringing deep tenderness along with a real risk of disappointment if the fantasy is never tested.",
    harmony: "There is gentle inspiration and shared imagination here, often expressed through art, music or spiritual interests.",
    tension: "Confusion, unmet expectations or quiet deception can creep in. Say clearly what you mean and ask what the other person means, rather than filling the gaps."
  },
  "sun-pluto": {
    theme: "Intense transformation",
    text: "Sun and Pluto contacts bring intensity. The Pluto person is often fascinated by the Sun person and can see right through them, which feels powerful and sometimes exposing. The relationship tends to change both of you at a deep level, and it rarely stays casual.\n\nThe shadow is control. The Pluto person may try to shape, possess or dominate the Sun person, or the Sun person may feel overpowered. When trust is strong, this becomes a bond of profound loyalty and mutual empowerment. When it is not, it becomes a power struggle. Honesty about power is essential.",
    fusion: "The conjunction is magnetic and consuming: the Pluto person's influence reaches into the Sun person's sense of self and neither of you comes away unchanged.",
    harmony: "The Pluto person helps the Sun person become stronger and more authentic, and the intensity feels empowering rather than threatening.",
    tension: "Power struggles, jealousy or manipulation can surface. Notice when you are trying to control the outcome, and choose openness over leverage."
  },
  "sun-northNode": {
    theme: "Fated direction",
    text: "Contacts to the North Node often feel meaningful from the start, as if you were meant to meet. The Sun person tends to embody qualities the Node person is growing toward, so the Node person learns and moves forward through the relationship, and the Sun person feels their presence has purpose.\n\nThis is a strong sign of a significant connection, though not necessarily an easy or permanent one. Its value is growth. The relationship tends to push the Node person toward their future, and the Sun person gains a sense of shared mission.",
    fusion: "The Sun person shines directly on the Node person's path, and the meeting often feels destined and life-changing.",
    harmony: "The Sun person supports the Node person's growth naturally, and you tend to move forward together with a shared sense of direction.",
    tension: "The Sun person may pull the Node person back toward old patterns or in a direction that does not quite fit. Talk openly about where each of you is heading."
  },
  "sun-chiron": {
    theme: "Healing through recognition",
    text: "The Sun person tends to touch old hurts in the Chiron person, sometimes simply by being who they are. This can stir pain, but it also brings the chance of healing, because the Sun person's warmth can help the Chiron person feel seen in a place they usually hide.\n\nThe Chiron person may, in turn, offer the Sun person wise and compassionate insight. The contact is tender. It asks both of you to be careful with each other's sore spots and generous with understanding when old wounds are triggered.",
    fusion: "The Sun person shines directly on the Chiron person's wound, which can feel painfully exposing at first and deeply healing over time.",
    harmony: "The Sun person's confidence gently supports the Chiron person's healing, and the Chiron person's empathy helps the Sun person feel understood.",
    tension: "The Sun person may unintentionally press on the Chiron person's wound, and the Chiron person may react defensively. Gentleness and patience turn hurt into growth."
  },
  "sun-asc": {
    theme: "Instant recognition",
    text: "When the Sun person's Sun touches the Ascendant person's rising point, there is usually quick liking and a sense of familiarity. The Sun person sees and appreciates the Ascendant person's natural manner, and the Ascendant person feels more confident and alive around the Sun person.\n\nThis is a strong contact for first impressions and physical ease together. It often shows people who look good as a pair and enjoy being seen together. It supports friendship and partnership alike, though it works on the surface first and needs other links to go deep.",
    fusion: "The Sun person lights up the Ascendant person's whole presence, and you tend to feel natural and at ease together from the first meeting.",
    harmony: "You enjoy each other's style and energy, and each of you makes the other feel more like themselves.",
    tension: "The Sun person may find the Ascendant person's manner a little off-putting at first, or the opposition may make you feel like opposites who need each other. Stay curious about the difference."
  },
  "moon-moon": {
    theme: "Shared emotional rhythm",
    text: "When your Moons connect, your emotional instincts meet. This shows how comfortable you feel living together, being tired together and handling ordinary moods side by side. A good Moon link often means you simply feel at home with each other without having to explain why.\n\nIt is one of the most important contacts for long-term daily life, because it describes what each of you needs to feel safe. Where it is easy, you care for each other in ways that land. Where it is hard, you each need to learn the other's emotional language rather than assuming it matches your own.",
    fusion: "You both react to life in very similar ways, which brings deep familiarity and also means you can amplify each other's moods, good or bad.",
    harmony: "Your emotional needs fit together easily, so comfort, routine and care flow between you with little effort.",
    tension: "Each of you needs something different to feel safe, and what soothes one of you may unsettle the other. Ask, rather than guess, what care looks like."
  },
  "moon-mercury": {
    theme: "Talking about feelings",
    text: "The Mercury person tends to understand the Moon person's feelings and can help put them into words. The Moon person, in turn, softens and personalises the Mercury person's thinking. Conversations often move easily between the practical and the personal, and you may talk about everyday life a great deal.\n\nThis is a helpful contact for any relationship that relies on talking things through. Its risk is that the Mercury person analyses when the Moon person simply wants comfort, or that the Moon person takes a casual remark personally. Listening for feeling as well as content keeps it warm.",
    fusion: "The Mercury person seems to read the Moon person's mind, and heart-to-heart conversation comes easily.",
    harmony: "You communicate with sensitivity and ease, and everyday talk feels caring rather than functional.",
    tension: "The Mercury person may seem cold or critical to the Moon person, and the Moon person may seem irrational to the Mercury person. Slow down and reflect back what you heard before responding."
  },
  "moon-venus": {
    theme: "Tender affection",
    text: "This is one of the sweetest contacts in synastry. The Venus person expresses love in a way that makes the Moon person feel cared for, and the Moon person offers the Venus person a sense of emotional safety and appreciation. There is often gentleness, shared comforts and a strong wish to please each other.\n\nIt supports both romance and long friendship, and it helps couples through hard times because the basic affection is real. Its only real risk is avoidance: you may both prefer harmony so much that difficult topics are put off. Kindness can include honesty.",
    fusion: "The Venus person's love lands exactly where the Moon person needs it, creating deep tenderness and a strong sense of belonging.",
    harmony: "Affection and care flow easily, and you both feel appreciated and comfortable together.",
    tension: "The Venus person's way of showing love may not quite meet the Moon person's needs, or one of you feels more invested. Talk about what makes each of you feel loved."
  },
  "moon-mars": {
    theme: "Passion and reactivity",
    text: "Mars stirs the Moon. The Mars person's directness and desire can excite the Moon person, and there is often strong physical and emotional chemistry. The Moon person's feelings, in turn, can fire up the Mars person's protective or passionate side.\n\nThis contact is emotionally lively. It can also be touchy. The Mars person may act or speak bluntly and hurt the Moon person without meaning to, and the Moon person may react in ways that feel to the Mars person like being blocked. When handled with care, it brings warmth, honesty and a relationship that never goes flat.",
    fusion: "The Mars person activates the Moon person's feelings directly, bringing intense chemistry and quick emotional sparks in both directions.",
    harmony: "The Mars person protects and energises the Moon person, and the Moon person's warmth softens the Mars person's edges.",
    tension: "Irritation and hurt feelings flare easily, and arguments can become personal fast. Cool down before responding, and remember the Moon person feels things before they think them."
  },
  "moon-jupiter": {
    theme: "Emotional generosity",
    text: "The Jupiter person makes the Moon person feel emotionally supported, hopeful and accepted. There is warmth, humour and a generous spirit between you, and the home you share tends to feel open and welcoming. The Moon person, in turn, gives the Jupiter person a sense of belonging.\n\nThis is a very comforting contact. It helps you forgive each other and recover quickly from low moods. The only risk is too much of a good thing: indulging, overpromising or not taking real problems seriously enough. Mostly it adds kindness to the whole relationship.",
    fusion: "The Jupiter person expands the Moon person's sense of emotional security, and being together simply feels good.",
    harmony: "Care, trust and goodwill come easily, and you tend to lift each other's spirits.",
    tension: "The Jupiter person's cheerfulness may feel dismissive of the Moon person's real feelings, or you may indulge each other too much. Make space for the harder emotions too."
  },
  "moon-saturn": {
    theme: "Steady but cool",
    text: "This is a well-known sign of long-term relationships. The Saturn person offers the Moon person stability, protection and reliability, and the Moon person gives the Saturn person a place where they can soften. Many committed couples have this contact.\n\nIt can also feel emotionally cool. The Moon person may feel their needs are judged, rationed or met with a sense of duty rather than warmth, and the Saturn person may feel the Moon person's emotions are a burden. The bond deepens when the Saturn person shows affection openly and the Moon person trusts the steadiness underneath.",
    fusion: "The Saturn person provides deep security, but the Moon person may feel emotionally restricted unless warmth is expressed as clearly as responsibility.",
    harmony: "The Saturn person's steadiness helps the Moon person feel safe, and the relationship tends to be loyal and enduring.",
    tension: "The Moon person may feel criticised, lonely or held at arm's length, and the Saturn person may feel overwhelmed by emotional demands. Regular, gentle check-ins help a great deal."
  },
  "moon-uranus": {
    theme: "Exciting but unsettled",
    text: "The Uranus person brings novelty and excitement into the Moon person's emotional world. There is often a thrill of attraction, a sense of freedom and a feeling that life has become less predictable. The Moon person offers the Uranus person a sense of home they may not have expected to want.\n\nThe difficulty is consistency. The Moon person may feel insecure because the Uranus person seems detached or erratic, and the Uranus person may feel smothered by the Moon person's need for closeness. It works when you build a relationship with room for both space and reassurance.",
    fusion: "The Uranus person electrifies the Moon person's feelings, bringing excitement along with emotional ups and downs.",
    harmony: "You enjoy a lively, friendly bond that allows emotional freedom without losing closeness.",
    tension: "The Moon person feels unsettled and the Uranus person feels confined. Agree on small rituals of connection that keep the Moon person steady while leaving the Uranus person free."
  },
  "moon-neptune": {
    theme: "Psychic closeness",
    text: "This contact creates strong emotional attunement. The Neptune person seems to sense what the Moon person feels without being told, and the Moon person feels a dreamy, compassionate connection that can be deeply moving. There can be shared creativity, spirituality or a love of retreat together.\n\nThe shadow is blurred boundaries. You may absorb each other's moods, avoid facing practical problems or build a picture of each other that is not quite real. The bond is beautiful when you keep some ground under your feet and speak plainly about needs.",
    fusion: "You feel emotionally merged, which is tender and intuitive but can make it hard to tell whose feelings are whose.",
    harmony: "Empathy and compassion flow gently between you, and you often understand each other without words.",
    tension: "Misunderstandings, disappointment or quiet evasion can creep in. Check your assumptions and say what you actually need."
  },
  "moon-pluto": {
    theme: "Deep emotional bond",
    text: "Pluto on the Moon creates an intense emotional connection. The Pluto person reaches the Moon person's deepest feelings, and the Moon person may feel both profoundly understood and slightly overpowered. The bond can be very hard to walk away from.\n\nThis contact can heal old family patterns or repeat them. Jealousy, possessiveness and emotional control are the risks, especially if either of you fears abandonment. When trust grows, it becomes a relationship where nothing needs to be hidden and both people are changed for the better.",
    fusion: "The emotional intensity is profound and binding, and the Moon person's inner world is transformed by the Pluto person's presence.",
    harmony: "The Pluto person helps the Moon person face and heal old emotional patterns, and the bond feels deep and protective.",
    tension: "Emotional power struggles, possessiveness or manipulation can arise. Speak about fears openly rather than acting them out."
  },
  "moon-northNode": {
    theme: "Nurturing destiny",
    text: "The Moon person often feels familiar to the Node person, as though they have known each other a long time. The Moon person nurtures the Node person's growth, offering emotional support as the Node person moves toward new directions in life.\n\nThis contact often appears in family bonds and significant partnerships. It carries a sense of meaning and care. The Moon person may help the Node person feel safe enough to take risks they would not attempt alone.",
    fusion: "The Moon person's care feels destined for the Node person, and the relationship carries a strong sense of emotional purpose.",
    harmony: "The Moon person supports the Node person's growth gently and consistently, and both of you feel the bond matters.",
    tension: "The Moon person's comfort may keep the Node person in familiar habits rather than helping them move forward. Encourage growth, not just safety."
  },
  "moon-chiron": {
    theme: "Tender wounds",
    text: "The Moon person tends to touch the Chiron person's emotional sore spots, often without knowing it. This can bring old hurts to the surface, but it also offers a chance to be cared for in exactly the place that has felt most neglected.\n\nThe Chiron person, in turn, can offer the Moon person wise, compassionate understanding. The contact asks for patience and gentleness from both of you. When handled well, it becomes one of the most healing bonds you can share.",
    fusion: "The Moon person's feelings press directly on the Chiron person's wound, which can be painful and deeply healing in equal measure.",
    harmony: "The Moon person's care soothes the Chiron person's old hurts, and the Chiron person helps the Moon person feel understood.",
    tension: "Emotional reactions can reopen wounds on both sides. Pause, name what is being triggered, and respond with care rather than defence."
  },
  "moon-asc": {
    theme: "Feels like home",
    text: "When the Moon person's Moon touches the Ascendant person's rising point, the Moon person tends to feel instinctively comfortable with the Ascendant person's presence, and the Ascendant person feels cared for and accepted as they are. There is ease in everyday life, shared routines and physical closeness.\n\nThis is a lovely contact for living together, as it makes ordinary moments feel warm. It can bring emotional sensitivity to how you treat each other in public and in private, so small gestures and tone matter more than usual.",
    fusion: "The Moon person feels immediately at home with the Ascendant person, and the Ascendant person feels nurtured just by being around them.",
    harmony: "You are relaxed and caring together, and your daily rhythms fit comfortably.",
    tension: "The Moon person's moods may affect the Ascendant person strongly, or the Ascendant person's manner may hurt the Moon person's feelings. Gentle tone goes a long way."
  },
  "mercury-mercury": {
    theme: "Meeting of minds",
    text: "When your Mercuries connect, you meet at the level of thought and speech. This shows how naturally you understand each other's reasoning, humour and way of explaining things. A good Mercury link makes planning, problem solving and simply chatting feel easy, and it keeps a relationship interesting over the years.\n\nWhere the link is hard, you can talk past each other. One of you may think in pictures and the other in lists, or one may want to debate while the other wants to agree. Learning each other's style prevents a lot of needless friction.",
    fusion: "You both think along very similar lines, so you finish each other's sentences and rarely need to explain yourselves.",
    harmony: "Conversation flows easily, and you enjoy exchanging ideas, jokes and plans.",
    tension: "You approach problems differently and can misunderstand or argue over details. Treat your different styles as two useful angles rather than one right way."
  },
  "mercury-venus": {
    theme: "Sweet talk",
    text: "The Mercury person tends to express themselves in a way the Venus person finds charming, and the Venus person makes the Mercury person's words feel appreciated. There is often pleasant, affectionate conversation, shared taste in books, music or ideas, and a knack for saying kind things to each other.\n\nThis contact softens disagreements, because you tend to be diplomatic with each other. It is a gentle link rather than a deep one, but it adds grace to how you communicate and helps you enjoy simply being together.",
    fusion: "The Mercury person's words land sweetly with the Venus person, and conversation often carries warmth and a little flirtation.",
    harmony: "You speak kindly to each other and enjoy sharing ideas, beauty and culture.",
    tension: "The Mercury person may say things bluntly that the Venus person finds unkind, or the Venus person may avoid honest discussion to keep the peace. Choose words with care."
  },
  "mercury-mars": {
    theme: "Sharp exchange",
    text: "Mars energises Mercury. The Mars person pushes the Mercury person to think faster and speak more directly, while the Mercury person gives the Mars person's drive a plan. This can make for lively debate, quick decisions and a strong working partnership.\n\nThe risk is argument. Words can become weapons, and the Mars person may interrupt or steamroll while the Mercury person responds with sharp criticism. When you both enjoy robust discussion, it keeps things stimulating. When you do not, it wears you out.",
    fusion: "The Mars person fires up the Mercury person's mind, bringing exciting conversation and quick flashes of temper.",
    harmony: "You make a decisive team, turning ideas into action quickly and enjoying spirited discussion.",
    tension: "Arguments escalate fast and can turn hurtful. Agree to pause heated conversations and come back to them when both of you are calmer."
  },
  "mercury-jupiter": {
    theme: "Expanding ideas",
    text: "The Jupiter person broadens the Mercury person's thinking, bringing big-picture vision, humour and encouragement. The Mercury person gives the Jupiter person's ideas detail and form. You often enjoy talking about philosophy, travel, learning or future plans, and your conversations tend to be optimistic.\n\nThis is a good contact for studying, teaching or planning adventures together. Its weakness is overlooking small practical details, or promising more than either of you can deliver. It is rarely a source of real conflict.",
    fusion: "The Jupiter person expands the Mercury person's mind, and conversations feel inspiring and full of possibility.",
    harmony: "Ideas grow easily between you, and you learn a great deal from each other.",
    tension: "The Jupiter person may seem preachy or careless with facts, and the Mercury person may seem nitpicky. Respect both the vision and the details."
  },
  "mercury-saturn": {
    theme: "Serious conversation",
    text: "The Saturn person brings structure, discipline and seriousness to the Mercury person's thinking. This can be a productive contact for working together, making plans and following through. The Mercury person may learn a lot from the Saturn person's experience, and the Saturn person may enjoy the Mercury person's quickness.\n\nThe shadow is criticism. The Mercury person may feel their ideas are dismissed or picked apart, and the Saturn person may feel the Mercury person is careless. When respect is mutual, it becomes a reliable, thoughtful partnership of minds.",
    fusion: "The Saturn person weighs every word the Mercury person says, which brings depth to your conversations and can make the Mercury person feel scrutinised.",
    harmony: "You plan well together, and the Saturn person helps the Mercury person turn ideas into something solid.",
    tension: "The Mercury person may feel silenced or judged, and the Saturn person may feel unheard. Practise listening fully before offering correction."
  },
  "mercury-uranus": {
    theme: "Brilliant sparks",
    text: "The Uranus person electrifies the Mercury person's thinking. Conversations jump between unexpected ideas, and you often surprise each other with fresh angles. This contact is exciting for creative work, innovation and friendship, and it can make you feel intellectually alive together.\n\nThe risk is erratic communication. One of you may change your mind suddenly, go silent or state opinions abruptly. It works best when you enjoy the stimulation without expecting predictable responses.",
    fusion: "The Uranus person sparks the Mercury person's mind in surprising ways, and conversations are rarely dull.",
    harmony: "You share original ideas easily and enjoy exploring unusual subjects together.",
    tension: "Communication can feel jumpy or unreliable, with sudden disagreements. Slow down and confirm what was actually said and agreed."
  },
  "mercury-neptune": {
    theme: "Poetic understanding",
    text: "The Neptune person brings imagination, intuition and softness to the Mercury person's words. You may communicate through images, music or unspoken understanding, and there can be a lovely creative or spiritual quality to your conversations.\n\nThe shadow is confusion. Messages may be misunderstood, promises remembered differently, or hard truths blurred into something vaguer. This contact rewards writing important things down and checking in regularly, so the poetry never replaces clarity.",
    fusion: "The Neptune person seems to understand the Mercury person intuitively, but details can easily get lost in the haze.",
    harmony: "You share imaginative, gentle conversation and a sense of understanding beyond words.",
    tension: "Misunderstandings, vagueness or evasive answers can build mistrust. Be clear, be specific and ask questions when unsure."
  },
  "mercury-pluto": {
    theme: "Penetrating talk",
    text: "The Pluto person brings depth and intensity to the Mercury person's thinking. Conversations tend to go beneath the surface, uncovering secrets, motives and hidden truths. The Mercury person may feel both fascinated and exposed, as though the Pluto person can read their thoughts.\n\nThis is a powerful contact for research, psychology or honest talks about difficult subjects. Its shadow is persuasion turning into control, or words used to wound. Keep conversations honest rather than strategic.",
    fusion: "The Pluto person reaches into the Mercury person's mind, and talks become intense, probing and transformative.",
    harmony: "You can discuss anything, however deep, and your conversations change how each of you thinks.",
    tension: "Conversations can become interrogations or power plays. Let each other hold opinions without needing to win the argument."
  },
  "mercury-northNode": {
    theme: "Meaningful messages",
    text: "The Mercury person tends to say things that help the Node person understand their path. Conversations may feel significant, as though the Mercury person brings the right idea or piece of information at the right time.\n\nThis contact is excellent for mentorship, study and teaching, and it often shows two people who help each other think more clearly about the future. Its lessons tend to come through words, books and ideas shared between you.",
    fusion: "The Mercury person's ideas speak directly to the Node person's growth, and conversations often feel fated.",
    harmony: "The Mercury person helps the Node person think clearly about direction, and learning flows easily between you.",
    tension: "The Mercury person's advice may pull the Node person toward old ways of thinking. Keep asking whether ideas point forward or back."
  },
  "mercury-chiron": {
    theme: "Healing words",
    text: "The Mercury person's words tend to reach the Chiron person's sensitive places. Sometimes this hurts, especially if the Chiron person has old wounds around being heard or understood. It can also heal, because the Mercury person may be the one who finally helps the Chiron person articulate what they have struggled to say.\n\nThe Chiron person can offer the Mercury person thoughtful, wise perspective in return. Careful, compassionate speech makes this contact a gift.",
    fusion: "The Mercury person's words go straight to the Chiron person's wound, which can sting and can also bring deep relief.",
    harmony: "Talking together helps the Chiron person heal, and the Mercury person learns to speak with more compassion.",
    tension: "Careless words may reopen old hurts. Think before speaking, and ask how a comment landed if the mood shifts."
  },
  "mercury-asc": {
    theme: "Easy rapport",
    text: "When the Mercury person's Mercury touches the Ascendant person's rising point, the Mercury person tends to understand the Ascendant person's manner and way of approaching life, and conversation starts easily from the first meeting. The Ascendant person often feels the Mercury person \"gets\" them.\n\nThis is a friendly, talkative contact that helps with practical cooperation and shared projects. It is lighter than emotional links, but it makes spending time together feel natural and engaging.",
    fusion: "The Mercury person connects instantly with the Ascendant person, and conversation flows naturally from the start.",
    harmony: "You communicate easily and enjoy exchanging ideas and observations.",
    tension: "The Mercury person may comment too readily on the Ascendant person's appearance or manner. Keep feedback kind and invited."
  },
  "venus-venus": {
    theme: "Shared tastes",
    text: "When your Venuses connect, your ways of loving, enjoying and valuing things meet. This shows whether you like the same pleasures, spend money in similar ways and express affection in a language the other understands. A good Venus link makes dates, holidays, homes and gifts feel easy to agree on.\n\nWhere the contact is hard, you may love each other genuinely yet disagree about what a good time, a beautiful room or a fair spend looks like. Neither taste is wrong. Making room for both keeps the pleasure in the relationship.",
    fusion: "You both love in a very similar way and enjoy the same things, which brings strong affection and easy companionship.",
    harmony: "Your tastes and values fit comfortably, and you enjoy sharing pleasures and beauty together.",
    tension: "You value different things or show love differently, which can lead to small resentments. Take turns choosing, and say what makes each of you feel appreciated."
  },
  "venus-mars": {
    theme: "Romantic chemistry",
    text: "This is the classic sign of romantic and sexual attraction. The Venus person's receptive charm meets the Mars person's desire and pursuit, and the pull between you can be strong and immediate. The Mars person tends to want the Venus person, and the Venus person enjoys being wanted.\n\nThe contact keeps a relationship alive with desire and flirtation. On its own it does not guarantee compatibility, and the hard angles can bring as much frustration as passion. When combined with emotional and practical links, it keeps love vivid over time.",
    fusion: "The attraction is powerful and direct, often felt from the first meeting.",
    harmony: "Desire and affection flow easily, and romance feels natural and playful.",
    tension: "The chemistry is strong but charged with friction, as the Mars person may feel too pushy and the Venus person too elusive. Make room for both passion and gentleness."
  },
  "venus-jupiter": {
    theme: "Generous love",
    text: "This is one of the happiest contacts in synastry. The Jupiter person showers the Venus person with generosity, appreciation and encouragement, and the Venus person brings warmth and delight to the Jupiter person's life. You tend to enjoy good times, celebrations and shared pleasures together.\n\nIt adds goodwill and forgiveness to the relationship, making it easier to recover from difficulties. Its only real risk is overindulgence in food, spending or comfort. Mostly it is simply a blessing.",
    fusion: "The Jupiter person expands the Venus person's capacity for love and joy, and the relationship feels abundant.",
    harmony: "You bring out each other's generosity and enjoy life together with warmth and humour.",
    tension: "You may encourage each other's excesses, or the Jupiter person's generosity may feel showy to the Venus person. Keep the good times sustainable."
  },
  "venus-saturn": {
    theme: "Loyal devotion",
    text: "Venus and Saturn contacts are frequent in long-lasting marriages. The Saturn person brings commitment, reliability and a serious intent to the Venus person's affection, and the Venus person softens and warms the Saturn person. There is often a feeling that this love is meant to be built on.\n\nThe difficulty is coolness. The Venus person may feel their affection is rationed or judged, and the Saturn person may feel pressure or fear of rejection. When both of you express appreciation openly, this contact becomes a deep and lasting loyalty.",
    fusion: "The Saturn person commits strongly to the Venus person, which brings stability and sometimes a sense of restraint in how love is expressed.",
    harmony: "Love feels steady and dependable, and you are both willing to invest in the long term.",
    tension: "The Venus person may feel unloved or criticised, and the Saturn person may feel insecure about the relationship. Show affection in small, reliable ways."
  },
  "venus-uranus": {
    theme: "Sudden attraction",
    text: "The Uranus person brings excitement, surprise and unpredictability to the Venus person's love life. Attraction can be sudden and thrilling, and the relationship may feel unconventional or different from anything either of you has known. The Venus person feels more alive and free.\n\nThe difficulty is stability. The attraction may come and go, or one of you may pull away just as closeness grows. Relationships with this contact thrive when you keep things fresh and allow independence.",
    fusion: "The attraction strikes like lightning, bringing excitement and a need to keep the relationship free and unconventional.",
    harmony: "You enjoy a lively, open love that keeps both of you interested and individual.",
    tension: "Unpredictability or detachment can unsettle the Venus person, and the Uranus person may feel hemmed in. Agree on what freedom means for you both."
  },
  "venus-neptune": {
    theme: "Romantic dream",
    text: "This is the most romantic contact in synastry. The Neptune person sees the Venus person as an ideal, and the Venus person feels enchanted and adored. There can be a deeply spiritual or creative love, with music, art or a shared sense of soulmate connection.\n\nThe shadow is illusion. It can be hard to see each other clearly, and disappointment follows when reality intrudes. When you balance the dream with honesty, this contact brings a lasting tenderness that gives the relationship a sense of magic.",
    fusion: "You idealise each other intensely, which is beautiful and needs a regular reality check.",
    harmony: "There is gentle, compassionate romance and a shared love of beauty and imagination.",
    tension: "Confusion, unrealistic expectations or disappointment can undermine trust. Keep speaking plainly about what you each want."
  },
  "venus-pluto": {
    theme: "Magnetic desire",
    text: "Venus and Pluto contacts create intense, obsessive attraction. The Pluto person is deeply drawn to the Venus person, and the Venus person feels overwhelmingly desired, which can be thrilling and a little frightening. The relationship tends to transform how both of you understand love.\n\nThe risks are jealousy, possessiveness and power games around affection, money or sex. When trust is established, the depth and loyalty here are extraordinary. When it is not, the intensity can become controlling.",
    fusion: "The attraction is consuming and transformative, and neither of you is likely to forget it.",
    harmony: "Deep, passionate love that heals and strengthens both of you over time.",
    tension: "Jealousy, possessiveness or emotional manipulation can surface. Choose honesty and open conversation over control."
  },
  "venus-northNode": {
    theme: "Destined affection",
    text: "The Venus person's love helps the Node person grow toward their future. There is often a sense of fated attraction, as though the relationship was meant to happen. The Venus person brings pleasure, beauty and affection into the Node person's path, making growth feel inviting rather than forced.\n\nThis contact often appears in significant relationships that change the course of both lives. It supports connection built on shared values and a sense of meaning, and it tends to leave both people with a clearer idea of what they truly love.",
    fusion: "The Venus person's love feels destined and helps the Node person move forward with joy.",
    harmony: "Affection supports growth naturally, and the relationship brings harmony to both paths.",
    tension: "The Venus person's comforts may tempt the Node person to stay where they are. Keep love connected to growth."
  },
  "venus-chiron": {
    theme: "Love that heals",
    text: "The Venus person's love reaches into the Chiron person's wounded places, especially around worth, beauty or being lovable. This can feel healing, as if the Venus person accepts exactly what the Chiron person feared was unlovable. It can also surface insecurities that have been quiet for years.\n\nThe Chiron person often brings wisdom and compassion that helps the Venus person love more deeply. This is a tender, healing contact that rewards patience and gentle reassurance.",
    fusion: "The Venus person's love touches the Chiron person's deepest wound, bringing both vulnerability and powerful healing.",
    harmony: "Love helps soothe old hurts, and you care for each other's tender places.",
    tension: "Rejection or insecurity may be triggered easily. Offer reassurance, and speak about fears openly."
  },
  "venus-asc": {
    theme: "Natural charm",
    text: "When the Venus person's Venus touches the Ascendant person's rising point, the Venus person finds the Ascendant person attractive and pleasant to be around, and the Ascendant person feels admired. This contact often shows immediate physical attraction and a pleasing, easy rapport.\n\nIt brings grace to how you treat each other and often makes you a good-looking pair in others' eyes. It supports affection and harmony, though it works best when other contacts provide depth.",
    fusion: "The Venus person is immediately drawn to the Ascendant person's appearance and manner, creating strong attraction and affection.",
    harmony: "You enjoy each other's company and find each other appealing and easy to be with.",
    tension: "Attraction is present but small differences in taste or style may irritate. Appreciate rather than try to change each other."
  },
  "mars-mars": {
    theme: "Matching drives",
    text: "When your Marses connect, your ways of acting, wanting and fighting meet. This shows how you handle conflict, pace, physical energy and desire as a pair. A good Mars link makes you a strong team: you move at a similar speed, go after goals together and can enjoy sport, adventure or physical intimacy with real vigour.\n\nWhere the link is hard, you may clash over timing, methods or who takes the lead, and anger can flare quickly. That friction is not always bad. Handled honestly, it keeps the relationship energised and stops resentment building up unspoken.",
    fusion: "You both act and desire in a similar way, which brings strong chemistry and teamwork, along with the chance of explosive clashes.",
    harmony: "Your energies work well together, and you tackle goals and challenges as a united team.",
    tension: "You clash over timing and control, and arguments can escalate quickly. Channel the heat into shared physical activity and fair, direct disagreement."
  },
  "mars-jupiter": {
    theme: "Bold adventure",
    text: "The Jupiter person encourages and expands the Mars person's drive, and the Mars person brings energy to the Jupiter person's plans. Together you tend to be bold, adventurous and enthusiastic, launching into travel, sport, business ventures or big projects with confidence.\n\nThe risk is overdoing it. You may take on too much, take risks together without enough caution, or egg each other on. Generally this contact brings optimism and courage to the relationship.",
    fusion: "The Jupiter person amplifies the Mars person's energy, creating a bold and adventurous partnership.",
    harmony: "You encourage each other's courage and ambition, and achieve a lot together.",
    tension: "You may overextend yourselves or disagree about which direction to charge in. Pick shared goals and pace yourselves."
  },
  "mars-saturn": {
    theme: "Friction and discipline",
    text: "This is one of the more challenging contacts in synastry. The Saturn person tends to restrain, slow or criticise the Mars person's drive, and the Mars person may feel frustrated, blocked or pushed to rebel. The Saturn person, in turn, may feel the Mars person is reckless.\n\nIt can also be a powerful working contact. When you respect each other, the Saturn person gives the Mars person's energy structure and endurance, and together you can build something disciplined and lasting. The key is to make restraint feel like support rather than control.",
    fusion: "The Saturn person strongly checks the Mars person's actions, which can feel frustrating but builds real discipline when handled with respect.",
    harmony: "The Saturn person channels the Mars person's energy into sustained effort, and you work well together toward long-term goals.",
    tension: "Frustration, resentment or cold conflict can build. The Mars person needs room to act and the Saturn person needs to be heard. Agree on plans together."
  },
  "mars-uranus": {
    theme: "Explosive excitement",
    text: "The Uranus person electrifies the Mars person's drive, bringing excitement, spontaneity and sometimes rebellion. There can be intense physical attraction and a sense of daring. Together you may take risks, break rules or pursue unusual projects that neither of you would try alone.\n\nThe risk is volatility. Sudden arguments, impulsive decisions or unpredictable behaviour can unsettle the relationship. It works best when both of you enjoy excitement and agree on a few ground rules for the moments when things get heated.",
    fusion: "The Uranus person sparks the Mars person's energy in unpredictable ways, bringing thrilling chemistry and sudden flare-ups.",
    harmony: "You inspire each other to take bold, original action, and life together feels exciting.",
    tension: "Impatience, rebellion or sudden conflict can disrupt things. Slow down before acting on impulse."
  },
  "mars-neptune": {
    theme: "Inspired or confused",
    text: "The Neptune person softens and inspires the Mars person's drive, and there can be a dreamy, romantic sexual chemistry. The Mars person may feel enchanted, while the Neptune person feels energised to follow their dreams.\n\nThe difficulty is clarity. The Mars person may feel undermined or unsure what the Neptune person wants, and the Neptune person may feel pushed. Honesty and clear agreements prevent this contact from sliding into confusion or passive resistance.",
    fusion: "The Neptune person's influence makes the Mars person feel inspired, but motives can easily become blurred.",
    harmony: "You share creative, idealistic energy, and can work together on artistic or spiritual pursuits.",
    tension: "Confusion, passive resistance or deception can undermine trust. Be clear about what you want and follow through."
  },
  "mars-pluto": {
    theme: "Raw intensity",
    text: "Mars and Pluto contacts produce powerful, sometimes overwhelming intensity. There is often strong sexual chemistry and a feeling that the relationship could transform both of you. The Pluto person may push the Mars person to their limits, and the Mars person may challenge the Pluto person's control.\n\nThe shadow is power struggle, anger or domination. This contact needs trust, honesty and a shared commitment to fair play. When handled well, it builds tremendous strength and resilience together.",
    fusion: "The chemistry is intense and all-consuming, and the relationship can be both deeply passionate and difficult to control.",
    harmony: "You empower each other to act with courage and determination, and together you can achieve remarkable things.",
    tension: "Power struggles, anger or control issues can arise. Choose honesty over manipulation, and step away before conflict turns destructive."
  },
  "mars-northNode": {
    theme: "Driven purpose",
    text: "The Mars person pushes the Node person forward on their path. There is often a sense that the Mars person arrived to spur the Node person into action, helping them take risks or make changes they had been putting off for a long time.\n\nThis contact brings energy and momentum to the relationship. It can feel like a shared mission, and it often appears in partnerships that accomplish real things together. The Mars person, in turn, finds their drive has a meaningful direction.",
    fusion: "The Mars person strongly energises the Node person's growth, and the relationship often feels driven by purpose.",
    harmony: "The Mars person supports the Node person's forward movement with courage and energy.",
    tension: "The Mars person may push too hard or in the wrong direction. Keep talking about what the Node person truly wants."
  },
  "mars-chiron": {
    theme: "Sore spots touched",
    text: "The Mars person's actions may press on the Chiron person's wounds, sometimes unintentionally. This can create hurt or defensiveness, especially around confidence, anger or feeling safe. It can also be healing, as the Mars person may encourage the Chiron person to stand up for themselves.\n\nThe Chiron person can help the Mars person see where their drive causes harm. This contact asks for gentleness and patience from both of you.",
    fusion: "The Mars person's energy hits directly on the Chiron person's wound, which can be painful or empowering.",
    harmony: "The Mars person helps the Chiron person find courage, and the Chiron person helps the Mars person act with more care.",
    tension: "Anger or careless action may reopen old hurts. Slow down and ask how your actions are landing."
  },
  "mars-asc": {
    theme: "Physical spark",
    text: "When the Mars person's Mars touches the Ascendant person's rising point, there is often strong physical attraction and energy. The Mars person is drawn to the Ascendant person's presence, and the Ascendant person feels energised and noticed.\n\nThis contact brings excitement and drive to the relationship. It can also create friction, as the Mars person may seem pushy and the Ascendant person may feel crowded. Respect for space keeps the spark positive.",
    fusion: "The Mars person's energy lands strongly on the Ascendant person, bringing physical attraction and occasional friction.",
    harmony: "You energise each other and enjoy active pursuits together.",
    tension: "The Mars person may feel aggressive or intrusive to the Ascendant person. Pay attention to boundaries and tone."
  },
  "jupiter-asc": {
    theme: "Uplifting presence",
    text: "The Jupiter person makes the Ascendant person feel more confident, optimistic and appreciated. There is warmth and generosity, and the Ascendant person often feels encouraged to express themselves more fully and take up more space. The Jupiter person, in turn, enjoys the Ascendant person's manner and presence.\n\nThis is a friendly, lucky contact that supports good humour and mutual encouragement. Its only real risk is overindulgence or overpromising, but it generally adds warmth and goodwill to everything else in the relationship.",
    fusion: "The Jupiter person expands the Ascendant person's confidence, and being together feels hopeful and generous.",
    harmony: "You encourage each other's growth and enjoy a warm, generous rapport.",
    tension: "The Jupiter person's enthusiasm may feel overbearing to the Ascendant person. Encourage without overwhelming."
  },
  "saturn-asc": {
    theme: "Serious impression",
    text: "The Saturn person tends to take the Ascendant person seriously from the start, sometimes treating them almost as a responsibility. The Ascendant person may feel supported and grounded by this, or judged and restricted, depending on how the contact is handled.\n\nThis contact often shows a bond built on commitment and reliability. It can make first impressions a little stiff or formal, but it tends to grow into loyalty and trust over time. The Saturn person needs to remember to show approval, not only concern, so the Ascendant person feels free to be themselves.",
    fusion: "The Saturn person places real weight on the Ascendant person, bringing commitment along with the risk of criticism.",
    harmony: "The Saturn person provides steady support, and the Ascendant person feels secure and respected.",
    tension: "The Ascendant person may feel judged or held back. Balance responsibility with encouragement."
  },
  "uranus-asc": {
    theme: "Unexpected spark",
    text: "The Uranus person brings excitement and unpredictability into the Ascendant person's life. First meetings are often sudden or unusual, and the Ascendant person may feel freer, bolder and more original in the Uranus person's company, as though they have been given permission to try a new way of being.\n\nThe risk is instability. The relationship may come and go, or feel hard to settle into a steady shape. It works best when you both value independence and treat surprise as part of the bond rather than a sign that something is wrong.",
    fusion: "The Uranus person electrifies the Ascendant person's presence, bringing surprise and change.",
    harmony: "You encourage each other's individuality and enjoy an unconventional connection.",
    tension: "Unpredictability can unsettle the Ascendant person. Talk openly about freedom and reliability."
  },
  "neptune-asc": {
    theme: "Enchanting glow",
    text: "The Neptune person sees the Ascendant person through a soft, idealised lens. The Ascendant person may feel seen as special or even magical, and there can be deep tenderness between you. The connection often carries a spiritual, artistic or quietly romantic quality.\n\nThe risk is illusion. The Neptune person may fall for an image rather than the real person, and the Ascendant person may feel pressure to live up to it. The Ascendant person can also absorb the Neptune person's moods without noticing. Honesty keeps the enchantment grounded and lets real closeness grow.",
    fusion: "The Neptune person idealises the Ascendant person, creating a dreamy and tender connection.",
    harmony: "You share gentle, imaginative rapport and compassion.",
    tension: "Misunderstanding or disappointment may arise. Stay honest and clear."
  },
  "pluto-asc": {
    theme: "Magnetic presence",
    text: "The Pluto person is deeply drawn to the Ascendant person and may seem to see straight through their public face. The Ascendant person may feel fascinated and a little exposed. This contact often brings intense attraction and a sense that the relationship is quietly changing how the Ascendant person presents themselves to the world.\n\nThe risk is control or obsession, where the Pluto person tries to reshape the Ascendant person or the Ascendant person feels watched. Trust and clear respect for boundaries keep the intensity healthy and turn it into genuine empowerment.",
    fusion: "The Pluto person's intensity focuses strongly on the Ascendant person, creating deep attraction and transformation.",
    harmony: "The Pluto person helps the Ascendant person become stronger and more authentic.",
    tension: "Power struggles or control issues may surface. Choose openness and respect."
  },
  "northNode-asc": {
    theme: "Meaningful meeting",
    text: "The Node person often feels a sense of destiny around the Ascendant person, as though the meeting was important for their path. The Ascendant person's natural manner models something the Node person is learning, so simply spending time together can help the Node person grow in new directions.\n\nThis contact often appears in significant relationships and brings a sense of shared purpose. It does not promise ease, but it tends to leave a lasting mark. The Ascendant person may find that being with the Node person gives their own presence more meaning.",
    fusion: "The meeting feels fated, and the Ascendant person plays an important role in the Node person's growth.",
    harmony: "You support each other's paths naturally.",
    tension: "The relationship may pull the Node person back toward old patterns. Keep focusing on growth."
  },
  "chiron-asc": {
    theme: "Gentle healing",
    text: "The Ascendant person's presence or manner tends to touch the Chiron person's old wound, often without meaning to. This can bring discomfort at first, since the Chiron person may feel exposed. Over time it can bring real healing, as the Ascendant person helps the Chiron person feel accepted in a way they did not expect.\n\nThe Chiron person may also help the Ascendant person understand their own vulnerabilities, offering a wise and compassionate view of how they come across. This contact rewards patience, kindness and a willingness to talk about what hurts.",
    fusion: "The Ascendant person's presence touches the Chiron person's wound, bringing vulnerability and healing.",
    harmony: "You help each other heal and accept yourselves.",
    tension: "Sensitive spots may be triggered. Be gentle and patient."
  },
  "asc-asc": {
    theme: "Matching approach",
    text: "When your Ascendants connect, the way each of you meets the world meets the other's. This shows first impressions, how comfortable you feel physically side by side, and whether your instinctive styles of approaching new situations fit together or pull apart.\n\nA good link makes you feel at ease in each other's presence, as though you move through life at a compatible pace. A hard link can make each of you find the other's manner a little odd at first, though that difference often becomes part of the attraction once you know each other better.",
    fusion: "You both approach life in a similar way, which brings instant familiarity and ease.",
    harmony: "Your styles complement each other, and being together feels comfortable.",
    tension: "Your manners and approaches differ, and you may misread each other initially. Give first impressions time."
  }
};
