/* Transit readings: what each moving planet brings, and what it tends to bring as it passes through each house of the birth chart */
window.AstroDeep = window.AstroDeep || {};

window.AstroDeep.transitPlanets = {
  sun: {
    brings: "The transiting Sun works like a spotlight. For about a month, whatever the house it crosses governs becomes more visible, and you tend to have more energy and willingness to deal with it. Matters you have been avoiding often come up for attention. It rarely feels dramatic. It is more a steady warmth that shows you where to put yourself this month.",
    timescale: "about 1 month per sign"
  },
  moon: {
    brings: "The Moon moves so quickly that its transits register as passing moods more than chapters. For a couple of days your feelings, appetite and need for comfort tend to tilt toward the house it crosses. It is useful for timing small things: a phone call, a clean-out, a quiet night in. Tracked over a few months, it can show you your own emotional tides.",
    timescale: "about 2.5 days per sign"
  },
  mercury: {
    brings: "Mercury brings conversations, errands, paperwork and ideas into the house it visits. Your thinking tends to circle that part of life, and messages, short trips and small decisions cluster there. When Mercury turns retrograde it lingers, and old topics resurface for review. The period usually feels busy and mentally lively, occasionally scattered, and it rewards writing things down.",
    timescale: "about 3 weeks to 2 months per sign, longer when retrograde"
  },
  venus: {
    brings: "Venus brings ease, pleasure and a softer touch to whichever house she passes through. Affection, spending, beauty and the things you value tend to gather around that area, and people are often more cooperative there. It can feel sweet and sometimes indulgent. During her retrograde periods, old loves and questions of worth may come back for a second look.",
    timescale: "about 4 weeks per sign, up to 4 months when retrograde"
  },
  mars: {
    brings: "Mars brings drive, heat and friction. Where it transits, you tend to want to act, compete or fix something, and patience runs short. It can stir conflict, accidents from rushing, or a burst of productive effort that gets stalled plans moving. When Mars is retrograde the energy turns inward, and old frustrations often need handling before anything new can start.",
    timescale: "about 6 to 7 weeks per sign, up to 7 months when retrograde"
  },
  jupiter: {
    brings: "Jupiter tends to widen whatever it touches. For about a year, the house it crosses often brings opportunity, generosity, helpful people and a sense that more is possible. The mood is hopeful and expansive, though it can also bring excess, overcommitment or inflated expectations. Growth arrives most reliably when you say yes to the right things and then follow through on them.",
    timescale: "about 1 year per sign"
  },
  saturn: {
    brings: "Saturn asks for structure, effort and honesty in the house it moves through. For a couple of years that area of life can feel heavier, slower or more tested, and shortcuts stop working. Many people find it sobering at first. Over time it tends to reward patience with something durable: a real skill, a firm boundary, a commitment you can actually rely on.",
    timescale: "about 2.5 years per sign"
  },
  uranus: {
    brings: "Uranus brings change that arrives sideways. Over several years, the house it crosses tends to become restless, unpredictable and hungry for freedom. Old arrangements may break down suddenly, and new possibilities appear just as fast. It can feel exciting and unsettling in the same week. The long-term result is usually a more authentic, less conventional way of living in that area.",
    timescale: "about 7 years per sign"
  },
  neptune: {
    brings: "Neptune dissolves edges. Over many years, the house it moves through often becomes more imaginative, spiritual or idealised, and also more confusing. Things you once took for granted can quietly lose their solidity. It can bring inspiration, compassion and creative flow, along with disappointment when something turns out to be other than it seemed. Clarity usually comes slowly and gently.",
    timescale: "about 14 years per sign"
  },
  pluto: {
    brings: "Pluto works slowly and at depth. Across many years, the house it occupies tends to go through a thorough overhaul: what is no longer alive gets stripped away, and hidden power dynamics come into the open. It can feel intense, compulsive or like a long ending. Whatever survives the process is usually stronger, more honest and far harder to shake.",
    timescale: "about 12 to 30 years per sign"
  },
  chiron: {
    brings: "Chiron touches old wounds in the house it crosses. Sensitivities you thought were settled can resurface, often through ordinary events that sting more than expected. The period tends to feel tender and revealing. It also brings a chance to understand the hurt differently, find help that genuinely works, and develop the kind of compassion that lets you support others with the same struggle.",
    timescale: "about 2 to 8 years per sign"
  },
  northNode: {
    brings: "The North Node moves backwards through the zodiac and points to where growth is asking for your attention. While it passes through a house, you tend to be pulled toward unfamiliar experiences in that area and away from comfortable old habits in the opposite one. It can feel awkward and effortful, and it often brings meaningful encounters and a clearer sense of direction.",
    timescale: "about 18 months per sign, moving backwards through the zodiac"
  }
};

window.AstroDeep.transitHouses = {
  jupiter: {
    1: {
      text: "When Jupiter crosses your first house, confidence tends to swell and people respond to you more readily. This is a year when you may change your look, launch something personal, or simply feel willing to take up more room. Doors often open because you walk up to them with a certain ease. The body can expand too, through appetite or sheer restlessness. The risk is overpromising, or assuming goodwill will cover every gap. Used well, it marks the start of a fresh twelve-year cycle of personal growth.",
      advice: "Choose one personal goal that genuinely excites you and commit to it before the year's momentum carries you somewhere else."
    },
    2: {
      text: "Money and possessions often feel easier while Jupiter moves through your second house. Earning opportunities can appear, a talent may suddenly become marketable, or you simply feel more generous and less anxious about having enough. Self-worth tends to rise with it. The catch is that spending rises just as readily, and a comfortable year can breed carelessness. Many people find this transit most useful for working out what they truly value, then putting their resources behind it instead of scattering them on impulse.",
      advice: "Decide in advance what any extra income is for, so a good year leaves something lasting behind."
    },
    3: {
      text: "Your curiosity tends to switch on when Jupiter enters the third house. Courses, books, writing projects and stimulating conversations multiply, and your own neighbourhood may suddenly feel full of possibility. Siblings, neighbours or colleagues can bring help or good news, and short trips often deliver more than expected. The downside is mental overload: enrolling in five things, answering every message, promising to read everything. This year rewards a learner's attitude and a willingness to speak up, provided you finish at least some of what you start.",
      advice: "Pick one subject or skill to study properly this year, and let the other interesting distractions wait their turn."
    },
    4: {
      text: "Home and family often become the centre of growth with Jupiter in your fourth house. You might move somewhere larger, renovate, welcome someone into the household, or feel a new warmth toward relatives. Time at home tends to feel restorative, and your inner sense of security deepens. Sometimes the expansion is emotional: understanding where you come from, reconnecting with heritage, softening an old family pattern. The shadow is overreaching on property or taking on more domestic responsibility than you can comfortably hold.",
      advice: "Before committing to a bigger home or project, cost it realistically and ask whether it serves the life you want now."
    },
    5: {
      text: "Pleasure, romance and creative risk are favoured while Jupiter passes through your fifth house. You may fall in love, start a creative project, enjoy children more, or rediscover a hobby that makes whole afternoons disappear. Confidence in self-expression grows, and people enjoy your company. Gambling instincts can grow as well, so speculation, dramatic affairs and overindulgence are the usual traps. At its best this year reminds you that joy has value in itself, and that play often leads to your most original work.",
      advice: "Make regular room for something you do purely for enjoyment, and be wary of risks that appeal mainly because they are risky."
    },
    6: {
      text: "Work routines and health habits tend to improve under a sixth house Jupiter. You may find a better job, a more supportive team, or a way of organising your days that finally fits. Colleagues are often helpful, and practical skills come easily. Many people feel motivated to look after their body through movement, cooking or overdue checkups. The pitfall is accepting too many tasks because everything looks manageable, or indulging in ways that quietly undo good habits. Small daily improvements compound nicely this year.",
      advice: "Build one sustainable daily habit this year, and decline extra tasks that only look manageable on a good day."
    },
    7: {
      text: "This is a classic transit for meeting someone significant, deepening a commitment, or forming a useful business alliance. With Jupiter in your seventh house, existing partners may bring opportunities, or you learn a great deal through the people closest to you. Contracts and negotiations often go your way. The shadow is idealising a partner or agreeing to terms too quickly because the mood is good. Growth comes through generosity, fair exchange and genuine interest in the other person's world, including the parts that differ from yours.",
      advice: "Read agreements carefully even when everyone is getting along, and make sure generosity runs in both directions."
    },
    8: {
      text: "Emotional and financial ties with others tend to deepen when Jupiter moves through your eighth house. Shared resources can grow through a partner's income, an inheritance, a settlement or a joint venture, and intimacy often becomes more meaningful. Many people gain psychological insight, grow braver about taboo subjects, or come through a crisis stronger than before. The risk is overextending on debt or becoming more entangled than you intended. It is a year for trusting more deeply while keeping your eyes open about what you are merging with.",
      advice: "Get clear on joint finances and emotional expectations early, so deeper closeness rests on honest ground."
    },
    9: {
      text: "Horizons open as Jupiter travels through your ninth house, the part of the chart it naturally rules. Travel, higher education, publishing, teaching and spiritual exploration are all favoured. You may be drawn to a new philosophy, a foreign culture or a course that reshapes how you see the world, and the future starts to feel larger. The pitfall is restlessness or preachiness: believing you have found the one answer, or chasing the next horizon before absorbing the last. For many, it is among the most inspiring years of the cycle.",
      advice: "Commit to one meaningful trip, course or teaching project, and give yourself time to digest what it shows you."
    },
    10: {
      text: "Career visibility often rises under Jupiter's tenth house transit. Promotions, public recognition, a new role or a mentor's backing are common, and people in authority tend to notice your work. Ambition feels natural and less anxious than usual. This is often a peak year for professional standing, though it rewards groundwork laid earlier more than sudden leaps. The shadow is overreaching, accepting a title that looks impressive but does not suit you, or letting success inflate your sense of importance.",
      advice: "Put yourself forward for the opportunity you have prepared for, and check that the role fits your values as well as your ambition."
    },
    11: {
      text: "New people tend to arrive while Jupiter moves through your eleventh house. Groups welcome you, and networks can open doors you could not have reached alone. Hopes for the future feel achievable, and you may join a cause, club or collaboration that genuinely matters to you. The pitfall is spreading yourself thin socially, or leaning on connections in place of effort. This transit often shows you who your real allies are, and what kind of future you want to build alongside them.",
      advice: "Invest your time in two or three groups or friendships that share your hopes, instead of accepting every invitation."
    },
    12: {
      text: "Jupiter in the twelfth house works quietly. Growth this year tends to happen behind the scenes: in retreat, in therapy, in spiritual practice, or through service to people who need help. Many people sense a kind of hidden protection, as though things work out without anyone seeing how. Outwardly it can be a slower year, and that is part of its purpose. The shadow is escapism or leaning too hard on whatever numbs. Much of what you tend now prepares the fresh start that comes as Jupiter reaches your Ascendant.",
      advice: "Give yourself regular solitude or reflection this year, and let unseen preparation count as real progress."
    }
  },

  saturn: {
    1: {
      text: "Saturn crossing your first house often brings a sober, defining period. You may feel older, more serious or more aware of your body's limits, and people tend to take you more seriously in return. Responsibilities land squarely on your shoulders. Energy can dip, and old ways of presenting yourself stop fitting. This is a time for deciding who you are on your own terms, with less concern for approval. The effort is real, but the self that emerges usually feels sturdier and far more your own.",
      advice: "Treat your body as a long-term project with steady sleep, movement and pacing, and let your image simplify to what is true."
    },
    2: {
      text: "Money and self-worth come under review while Saturn moves through your second house. Income may feel tight, spending needs discipline, or you realise your finances rest on shakier ground than you assumed. Many people also confront how they value themselves, particularly whether they undercharge or cling to things for security. It can feel lean and anxious. Across these years, though, a practical, realistic relationship with resources tends to form, and you often build something slow and solid that lasts long after the transit ends.",
      advice: "Track where your money actually goes for a few months, then shape a simple plan around what matters most to you."
    },
    3: {
      text: "Communication tends to become more deliberate under Saturn's third house transit. Words carry weight, and you grow more careful about what you say or put in writing. Study can feel harder yet more rewarding, which makes this an excellent period for serious training or qualifications. Siblings or neighbours may bring responsibilities or friction, and commuting, errands and paperwork can feel like a grind. Some people wrestle with doubts about their intelligence. What comes out of this time is usually a disciplined mind and a voice people trust.",
      advice: "Take on one structured course of study or writing practice, and let slow, regular effort replace bursts of cramming."
    },
    4: {
      text: "Family duty tends to weigh more with Saturn in your fourth house. You might care for an ageing parent, deal with property repairs, move under pressure, or face family patterns you had hoped to leave behind. Emotional foundations are being tested, sometimes quietly. It can be a lonely stretch, with more duty than comfort at home. The deeper work is building an inner security that does not depend on circumstances. Many people come out of this period with a home, literal or emotional, that genuinely holds them.",
      advice: "Deal with practical household problems as they appear, and ask for support if family duties start to outweigh your own needs."
    },
    5: {
      text: "Fun sometimes feels like something you have to earn while Saturn passes through the fifth house. Romance may turn more serious or become scarce, creative work can stall under self-criticism, and children may bring added responsibility. Yet this is a strong period for disciplined creative work: learning a craft properly, finishing a long project, or committing to a relationship with clear eyes. Joy tends to return in a more mature form, rooted in skill and in choices you have made deliberately.",
      advice: "Schedule creative practice like an appointment, and let it be imperfect so self-criticism does not shut it down."
    },
    6: {
      text: "Daily life goes under the microscope when Saturn enters the sixth house. Work can become demanding, with heavier loads, exacting managers or a job that no longer suits you. The body often asks for attention, making it plain which habits are no longer sustainable. This transit rewards practical reorganisation: better routines, realistic scheduling, steady health habits. For a while it can feel like drudgery. The outcome is usually a working life and daily rhythm that are more efficient, more honest about your limits, and easier to keep up.",
      advice: "Audit your weekly routine for one habit that drains you, and replace it with something simple you can keep doing."
    },
    7: {
      text: "Relationships are tested when Saturn moves through the seventh house. Partnerships that lack a solid base may end, while those with real commitment often deepen and formalise, sometimes through marriage or a signed agreement. You may feel the weight of a partner's needs, or recognise patterns you keep repeating with different people. Business arrangements and contracts demand clear terms. It can be a lonely or sobering time. What tends to emerge is a much clearer idea of what you need from others and what you are willing to give.",
      advice: "Talk plainly about expectations and responsibilities in your closest relationships, and put important agreements in writing."
    },
    8: {
      text: "Serious matters around shared resources tend to surface during Saturn's eighth house transit: debt, tax, inheritance, a partner's finances. Intimacy can feel guarded, and trust may need rebuilding step by step. Some people face endings, losses or psychological material they have long avoided. The period is rarely light, but it can be profoundly strengthening. It asks you to take responsibility for what you share with others, emotionally and materially, and to face fear directly. Much of what once frightened you becomes manageable once you look at it honestly.",
      advice: "Get joint paperwork in order, and consider professional support if old grief or fear surfaces strongly."
    },
    9: {
      text: "Beliefs are put to the test as Saturn crosses the ninth house. Ideas you inherited or picked up casually may stop holding, and you tend to want a philosophy that survives real experience. Higher education can be demanding but worthwhile, so this suits serious study, teaching credentials or a publishing project. Travel may be complicated or undertaken out of duty, and legal matters can move slowly. The reward is a worldview that is genuinely yours, built from evidence and lived experience more than enthusiasm.",
      advice: "Commit to a structured course of learning or teaching, and examine one belief you hold simply because it was handed to you."
    },
    10: {
      text: "Career and reputation come into sharp focus when Saturn reaches the tenth house. This is often a culmination: the efforts of recent years are assessed, and you may gain authority, a senior role or public recognition. Where the foundations were weak, it can bring setbacks or a sense of hitting a ceiling. Responsibility increases either way, and many people feel pressure to prove themselves. Your standing tends to become more solid during these years, provided you are willing to carry the weight honestly.",
      advice: "Take on responsibility you can genuinely sustain, and let a steady track record do the persuading for you."
    },
    11: {
      text: "Saturn in the eleventh house tends to sort your friendships and groups. Some connections fade, often those based on convenience or old habit, while a few become deeper and more reliable. You may take on a leadership or organising role in a community or cause. Long-range goals come under scrutiny, and wishful thinking gives way to realistic planning. At times it can feel isolating. What remains is a smaller, sturdier circle and a clear sense of which hopes are worth years of effort.",
      advice: "Invest in the friendships that show up consistently, and turn one long-term hope into a practical, staged plan."
    },
    12: {
      text: "Saturn's passage through the twelfth house is a period of endings and quiet preparation. Old patterns, fears and unfinished business tend to surface, often when you are alone. Energy may be lower and outward progress slower. Many people find themselves caring for others, working behind the scenes, or dealing with matters that cannot be rushed. It can feel like a long winter. The work is clearing space: letting go, resting well, facing what you have avoided. That groundwork supports a fresh start once Saturn reaches your Ascendant.",
      advice: "Build regular rest and reflection into your weeks, and finish or release commitments that belong to an older version of you."
    }
  },

  uranus: {
    1: {
      text: "A restless urge to reinvent yourself tends to arrive when Uranus crosses your first house. You may change your appearance dramatically, walk away from a role that confined you, or surprise people who thought they knew you. Independence starts to feel essential. Sudden events can shift your direction or the way you present to the world. The body may feel wired or unsettled, and impulsive choices come easily. Over these years many people shed a personality built mainly to fit in, and become far more recognisably themselves.",
      advice: "Try out change in small, reversible steps first, so freedom does not cost you stability you still need."
    },
    2: {
      text: "Income and possessions can become unpredictable while Uranus moves through your second house. Money may arrive or vanish suddenly, or you might change the way you earn entirely, turning to freelance work, technology or an unconventional skill. Your sense of what matters is shifting too, and attachments to things that once meant security can loosen. The period is often exciting and financially bumpy at once. Over time it tends to produce a more independent relationship with resources and a self-worth that rests less on what you own.",
      advice: "Keep something steady underneath you while you experiment with new ways of earning, so opportunity does not turn into panic."
    },
    3: {
      text: "Your mind tends to speed up with Uranus in the third house. New ideas, unusual subjects and flashes of insight arrive frequently, and conventional ways of thinking may start to bore you. Communication becomes more direct and sometimes blunt. You might change neighbourhoods, alter how you get around, or find sibling relationships shifting unexpectedly. Technology often plays a bigger part in how you learn and connect. Focus can suffer from all the stimulation, yet this transit tends to leave you with a more original voice.",
      advice: "Capture sudden ideas in one place, and set aside regular time to develop the best of them properly."
    },
    4: {
      text: "Domestic life can be shaken up while Uranus passes through the fourth house. Unexpected moves, changes in who lives with you, or a sudden need to live differently are common. Family relationships may shift as you question the roots you came from. Some people renovate constantly or never quite feel settled during these years. Inner foundations loosen too, so old emotional patterns can surface without warning. Unsettling as it is, this transit often frees you from inherited expectations and lets you create a home that reflects who you actually are.",
      advice: "Ask what kind of home genuinely suits you now, and let family changes unfold without forcing old arrangements back into place."
    },
    5: {
      text: "Romance, creativity and play tend to become electric under a fifth house Uranus. Attractions can arrive suddenly and burn out just as fast, and you may find yourself drawn to unusual people or unconventional arrangements. Creative work often breaks into new territory, with experimental ideas that surprise even you. Children may bring unexpected changes, or ask for more freedom than you are used to giving. Risk-taking appeals. The trap is chasing excitement for its own sake. At best, your self-expression is freed from other people's expectations.",
      advice: "Follow creative impulses into new forms, while checking that romantic or risky choices still respect everyone involved."
    },
    6: {
      text: "Daily routines rarely stay the same when Uranus moves through the sixth house. Jobs can change suddenly, schedules turn irregular, or you crave work that offers more autonomy, and many people shift to freelance or flexible arrangements during these years. Stress often shows up through the nervous system, so restlessness and broken sleep are common signs that you need a better rhythm. Alternative approaches to wellbeing may appeal. The aim is a working life that suits your nature, with room for variety and independence.",
      advice: "Design a flexible routine with a few fixed anchors, such as sleep and meals, and let everything else vary."
    },
    7: {
      text: "Close relationships tend to go through sudden changes while Uranus crosses your seventh house. You may meet someone unexpected, need far more freedom within a partnership, or find a relationship ending abruptly. Unconventional arrangements can appeal, and existing partners may themselves change in ways you did not predict. This period tests whether your relationships allow both people to be fully themselves. It can be unsettling and liberating in equal measure. Many people come out of it knowing exactly how much closeness and independence they need.",
      advice: "Speak openly about your need for space before it builds into restlessness, and listen for the same need in your partner."
    },
    8: {
      text: "Sudden shifts in shared resources and intimate life are typical of Uranus in the eighth house. A partner's finances may change unexpectedly, or joint arrangements may need restructuring. Intimacy can become more experimental, or emotional attachments may loosen abruptly. Some people go through an unexpected crisis that breaks old patterns open, and psychological breakthroughs around control and trust are common. It can feel like the ground moving underfoot. Afterwards you are often freer from fears and dependencies that once shaped your closest bonds.",
      advice: "Keep shared financial arrangements transparent and adaptable, and turn unexpected changes in intimacy into honest conversations."
    },
    9: {
      text: "Your worldview can change dramatically as Uranus moves through the ninth house. Beliefs you held firmly may give way to new ideas, and you might be drawn to unusual philosophies, spontaneous travel or study in an unexpected field. Foreign places and people can bring genuinely eye-opening experiences. Plans around education or travel may change at short notice. The shadow is restless idealism, jumping from one belief system to the next. Used well, this transit liberates your thinking and gives you a broader, more independent understanding of life.",
      advice: "Stay open to new ideas and places, and test each exciting belief against how it actually works in your daily life."
    },
    10: {
      text: "Professional life tends to be shaken up when Uranus reaches the tenth house. Sudden job changes, a new direction, restructuring at work or an unexpected opening are all common. You may find rigid hierarchies increasingly hard to tolerate, or become known for something unusual. Relationships with bosses and authority figures can become strained. Professionally the period can feel unstable, yet it often leads to work that fits you far better. Many people discover their real vocation during these years, sometimes through an abrupt ending.",
      advice: "Keep your skills current and your options open, so career surprises become openings instead of emergencies."
    },
    11: {
      text: "Unusual people tend to enter your circle while Uranus travels through the eleventh house, and some long-standing friendships may end without much warning. You might become involved in activism, online communities or innovative projects, and your hopes for the future can change direction entirely. This transit favours collaboration with people who share a vision of change. The difficulty is feeling unable to commit to any one group for long. Over time it usually brings a network that reflects your true values.",
      advice: "Seek out communities built around shared ideas, and let friendships that have run their course end without bitterness."
    },
    12: {
      text: "Uranus in the twelfth house tends to stir the unconscious. Dreams become vivid, intuitions sharpen, and old fears can surface without warning. Most of the change happens out of sight, as hidden patterns loosen and something new quietly takes shape. Restlessness may disrupt sleep. Some people experience sudden spiritual insight or a strong urge to break free of self-defeating habits. Because the shifts are hard to name, it can feel disorienting. What is being prepared here often becomes visible once Uranus reaches the Ascendant.",
      advice: "Keep a dream journal or regular reflective practice, and protect your sleep as carefully as you can."
    }
  },

  neptune: {
    1: {
      text: "Your sense of identity tends to blur while Neptune crosses the first house. You may feel more sensitive, more porous to other people's moods, and less certain about who you are or how you come across. Others can project their fantasies onto you, seeing a healer, a muse or a mystery. Creativity, spirituality and compassion often grow. The body may react more strongly to alcohol, stress or noisy environments. Losing yourself in others' expectations is the main risk. Over these years, many people find a softer, more intuitive identity that feels truer.",
      advice: "Check in with your own preferences each day, and limit draining environments while you are this sensitive."
    },
    2: {
      text: "Money and values can feel slippery during Neptune's second house transit. Finances may be vague, income irregular, or you realise you have been unclear about where your resources actually go. Some people become more generous or less materialistic, finding worth in creative or spiritual pursuits. Others run into confusion or even deception around money. Self-worth may feel foggy too. The gift of this long period is a relationship with resources that reflects your ideals, provided you keep paying practical attention to the details.",
      advice: "Keep clear, simple records of what comes in and goes out, and double-check any arrangement that sounds too good."
    },
    3: {
      text: "Thinking tends to become more imaginative and less linear with Neptune in the third house. Poetry, music, intuition and symbolic ideas come easily, while precise communication, detail and paperwork may slip. Misunderstandings with siblings or neighbours are possible, or you may feel especially tender toward them. You often learn best through images and stories. The pitfalls are vagueness, gossip, or saying what people want to hear. At its finest, this period gives your voice a gentle, inspired quality that others find moving.",
      advice: "Write down important agreements and details, and give your imaginative thinking a regular creative outlet."
    },
    4: {
      text: "Home can become a sanctuary, or a source of confusion, while Neptune moves through the fourth house. You may idealise a particular place, long for a spiritual home, or find family relationships clouded by unspoken feelings. Practical matters such as damp, leaks or unclear property boundaries sometimes need attention. A parent may need care or become harder to read. Old family memories can soften and resurface in unexpected ways. The gift is a more compassionate connection to your roots and a richer inner life.",
      advice: "Get property decisions checked carefully, and create one peaceful space at home that genuinely restores you."
    },
    5: {
      text: "Romance and creativity take on a dreamy, idealistic tone under a fifth house Neptune. You may fall for someone who seems perfect, only to discover more complexity later. Creative inspiration can be abundant, particularly in music, art, film or anything that draws on imagination. Children may bring tenderness, or situations that are hard to read clearly. Escapist pleasures can appeal a little too much. The gift is a capacity to find magic in ordinary life and to create from deep feeling, as long as you stay grounded in what you actually see.",
      advice: "Enjoy romantic and creative inspiration fully, and give new attractions time to show you who they really are."
    },
    6: {
      text: "Daily routines can feel vague or draining while Neptune passes through the sixth house. Work may lack clear structure, roles become confusing, or you feel called toward caring, healing or creative jobs. The body tends to grow more sensitive, so symptoms can be hard to pin down, and diet, stress and surroundings matter more than before. Discipline around routine may slip without your noticing. This period often asks you to bring meaning and compassion to everyday tasks while still keeping practical order.",
      advice: "Keep a simple daily structure, and seek clear professional answers for health concerns that feel hard to define."
    },
    7: {
      text: "Idealism flows into partnership when Neptune moves through the seventh house. You may meet someone who feels like a soulmate, or find yourself caring for a partner who needs a great deal of help. Boundaries between you and others can blur, and it may be hard to see people as they are. Deception or disappointment is possible, especially in business dealings. The gift is compassion and a capacity for generous love. The work is learning to love someone clearly, including their flaws, without rescuing them or disappearing yourself.",
      advice: "Look closely at what partners actually do over time, and keep your own needs visible in every close relationship."
    },
    8: {
      text: "Boundaries in intimacy and shared resources tend to dissolve during Neptune's eighth house years. Emotional and sexual connection can feel transcendent or bewildering, and joint finances may be unclear or need close watching. Some people go through loss, grief or experiences that deepen their sense of life's mysteries, and intuition often becomes very strong. The risk is merging too completely or skipping the fine print. At best, this period brings healing, surrender and profound psychological insight.",
      advice: "Stay informed about joint finances and legal paperwork, and give grief or spiritual experiences room to unfold."
    },
    9: {
      text: "Spiritual seeking tends to intensify while Neptune crosses the ninth house. You may be drawn to mysticism, retreats, religious study, or travel to places that feel sacred. Beliefs often grow more inclusive and compassionate. The shadow is following teachers or philosophies uncritically, or becoming disillusioned with ideals you once held dear. Travel plans can get muddled, and formal study may inspire you or lose its focus. Over these years, many people develop a faith or worldview grounded in their own experience of meaning.",
      advice: "Explore spiritual or philosophical paths freely, and keep asking whether each teacher respects your independent judgement."
    },
    10: {
      text: "Career direction and public image can blur while Neptune occupies the tenth house. You may feel uncertain about your professional path, or drawn toward creative, healing or service work that inspires you. Others tend to project idealised or muddled images onto you, and recognition may come through artistic or compassionate work. The pitfalls are scandal, a job with no clear shape, or losing ambition altogether. This transit asks you to find a vocation that expresses your ideals while keeping practical goals in view.",
      advice: "Clarify one concrete professional goal each year, and let your ideals shape the work without replacing the plan."
    },
    11: {
      text: "Friendship and group life take on a softer, more idealised quality with Neptune in the eleventh house. You may be drawn to spiritual communities, artistic collectives or humanitarian causes. Friends can be deeply supportive or quietly disappointing, and it may be hard to tell who is genuinely on your side. Your hopes for the future can become more visionary and less defined. Watch for groups that ask more than they give. The best of this period connects you with people whose ideals match your own.",
      advice: "Give generously to causes you believe in, and notice whether groups and friends return the same good faith."
    },
    12: {
      text: "Neptune in the twelfth house, its natural home, tends to deepen your inner life. Dreams, intuition, meditation and creative imagination can become powerful. You may feel drawn to solitude, spiritual practice, or service to people in hospitals, institutions or hard circumstances. The boundary between your feelings and other people's can grow very thin. The risks are escapism, exhaustion or hidden anxieties. This period can bring profound peace and understanding when you balance retreat with enough grounding in ordinary life.",
      advice: "Make time for regular quiet and spiritual practice, and keep one practical routine that anchors you in everyday life."
    }
  },

  pluto: {
    1: {
      text: "Identity tends to be remade from the root while Pluto crosses your first house. Over these years you may change how you look, how you carry yourself and how you meet the world, often after an intense personal crisis. Your presence can become more magnetic, and people may react strongly to you, sometimes before you have said much. Control issues around the body or image can surface. The old self is gradually stripped away. What emerges is usually a resilient person who knows exactly what they will and will not accept.",
      advice: "Notice where you try to control how others see you, and let hard changes reshape you instead of fighting every one."
    },
    2: {
      text: "Pluto moving through the second house tends to overhaul your relationship with money, possessions and self-worth. Finances may go through upheaval, loss or regeneration, and you may find yourself questioning what you truly need. Power struggles over resources are possible, whether with an employer, a partner or family. Some people build considerable wealth, while others learn to release attachments that kept them stuck. Underneath it all runs a question of worth. Over time your values tend to become deeper and more honestly your own.",
      advice: "Look honestly at where money and possessions carry emotional weight, and release what you keep only out of fear."
    },
    3: {
      text: "Thinking deepens and intensifies with Pluto in the third house. You may become absorbed in psychology, research, investigation or hidden subjects, and ordinary conversations can turn serious quickly. Words gain power, and so do misunderstandings. Relationships with siblings or neighbours may be transformed or become fraught. Obsessive thinking and mental loops are a real pitfall. Over the years, this transit often gives you a penetrating mind and a voice that gets to the heart of things, especially in writing, research or teaching.",
      advice: "Channel intense thinking into research or writing, and pause before saying anything you cannot take back."
    },
    4: {
      text: "Deep change comes to home and family while Pluto passes through the fourth house. You may move, lose a family member, uncover family secrets, or confront patterns that shaped your early life. Power dynamics at home can become intense. Emotional foundations are rebuilt from the ground up, often slowly and sometimes painfully, and many people do significant psychological work during these years. The reward is a home and inner life freed of inherited burdens, grounded in your own sense of where you belong.",
      advice: "Consider working with a counsellor on family patterns, and allow old roots to change without clinging to how things were."
    },
    5: {
      text: "Love, creativity and self-expression gain real intensity under a fifth house Pluto. Romances can become all-consuming, jealous or life-altering, and creative work may reach darker, deeper and more powerful places. Children can bring major life changes or become a source of profound growth. Pleasure may tip into compulsion at times. The gift of these years is creative power and a capacity for deep, loyal love. The work is learning to express passion without trying to control the people or projects you care about.",
      advice: "Pour intensity into creative work, and notice when a romance begins to feel more like possession than affection."
    },
    6: {
      text: "Daily work and health habits tend to be transformed while Pluto moves through the sixth house. Jobs may end or change completely, and power struggles with colleagues or managers are possible. The body often signals what needs deep change, sometimes through health concerns that prompt a complete overhaul of routines. Compulsive working is a common trap, as is trying to control every small detail. Over these years you are likely to build daily habits and working conditions that genuinely support your wellbeing, usually through thorough, determined effort.",
      advice: "Respond to health signals promptly with proper care, and redesign your working life so it stops costing your wellbeing."
    },
    7: {
      text: "Relationships go through profound change as Pluto crosses the seventh house. Intense partnerships may begin, end or alter beyond recognition. Power dynamics in close bonds tend to come into the open, and you may meet people who provoke strong reactions in you. Business alliances can be equally charged. This period often exposes patterns of control, dependency or projection. The reward is deeper, more honest partnerships built on equality, and a far clearer sense of who you become when you are close to someone.",
      advice: "Name power imbalances in relationships when you notice them, and look for the part of yourself you see in difficult people."
    },
    8: {
      text: "Pluto in the eighth house, its natural territory, brings deep change through intimacy, shared resources and crisis. You may experience loss, inheritance, major financial entanglement or a bond of unusual emotional depth. Psychological material rises to the surface, often through events you cannot control, and taboo subjects may fascinate you. The transit can feel heavy and all-consuming for long stretches. It also carries enormous capacity for regeneration, and over these years you tend to lose much of your fear of life's depths.",
      advice: "Face grief, fear and shared financial matters directly, with professional support when the load becomes too heavy."
    },
    9: {
      text: "Beliefs tend to be broken down and rebuilt while Pluto moves through the ninth house. Philosophies you once held may collapse entirely, and you may become passionate about truths you discover for yourself. Education, travel or encounters with other cultures can have life-changing effects. You might challenge religious or political authority, or grow more zealous about your own views than is comfortable for others. Legal matters can become intense. Over these years your worldview is likely to become deeper, more tested and more genuinely yours.",
      advice: "Hold new convictions with some humility, and keep learning from people whose views unsettle yours."
    },
    10: {
      text: "Your public standing and vocation are reshaped when Pluto occupies the tenth house. You may rise to positions of real power, face a major professional crisis, or reinvent your vocation completely. Relationships with authority can involve intense power struggles, and your reputation may change dramatically, for better or worse. This period reveals what you truly want to achieve and what you are willing to do for it. The reward is often a career with genuine influence and depth, built on hard-won experience.",
      advice: "Use growing influence carefully, and let a career path end once it has clearly run its course."
    },
    11: {
      text: "Friendships and group life change deeply during Pluto's eleventh house years. Some friendships end, while others become intense, loyal and life-changing. Groups can bring power struggles, or you may become influential within a community or cause. Your hopes and goals often shift at a fundamental level. Manipulation in social settings, from others or from yourself, is the thing to watch. The gift is a network of genuine allies and a vision of the future strong enough to reshape how you live.",
      advice: "Notice who genuinely supports your growth, and bring your full commitment to one cause that matters to you."
    },
    12: {
      text: "Deep unconscious material tends to stir while Pluto passes through the twelfth house. Old fears, buried grief and hidden patterns can surface slowly over many years, often in dreams or long solitary stretches. You may feel drawn to therapy, spiritual work or quiet service. Some experiences are private and hard to explain to anyone else. Feeling haunted by what you have not yet faced is the main difficulty. The gift is profound inner change and freedom from old compulsions, preparing a powerful rebirth when Pluto reaches your Ascendant.",
      advice: "Give buried feelings a safe container, such as therapy, journalling or spiritual practice, and let them change you gradually."
    }
  },

  chiron: {
    1: {
      text: "Old wounds around identity, appearance or belonging can rise to the surface while Chiron crosses your first house. You may feel unusually self-conscious, or notice that other people's reactions still sting more than you expected. Physical vulnerabilities can ask for attention. Your usual confidence may feel thin for a while. Yet this transit often brings a chance to accept yourself more fully, including the parts you once hid. People may begin to see you as someone who understands struggle, and that becomes a strength.",
      advice: "Treat self-consciousness with kindness, and share your honest experience with someone who can hear it without judgement."
    },
    2: {
      text: "Chiron in the second house tends to touch sore places around money, security and self-worth. Old feelings of never having enough, or of not being valuable, may resurface through quite ordinary financial events: a bill, a pay review, a purchase you hesitate over. You may notice patterns in how you earn, spend or undervalue yourself. It can feel raw. This period offers a chance to heal your sense of worth and to recognise talents born from struggle that others genuinely value.",
      advice: "Notice the stories you tell yourself about money and worth, and write down concrete evidence of your real value."
    },
    3: {
      text: "Old hurts around speaking, learning or siblings can come to light during Chiron's third house transit. You may feel unheard, doubt your intelligence, or relive memories of school and being corrected. Everyday conversations can suddenly feel charged. Speaking up takes more courage than usual. Healing tends to come through finding your own voice, learning in a way that suits your mind, and often through helping others express themselves. Writing or teaching can become deeply meaningful during these years.",
      advice: "Take one small step each week toward speaking or writing openly, even when your inner critic objects."
    },
    4: {
      text: "Wounds from family and early home life tend to stir as Chiron moves through the fourth house. Memories may resurface, a parent's struggles may become clearer to you, or home itself may feel unsettled. A sense of not quite belonging anywhere can be strong. This period offers a chance to understand your family history with more compassion, and to build a home that feels genuinely safe. Many people describe it as a time of slow, deep emotional repair and reconnection with their roots.",
      advice: "Let family memories surface gently, and seek support if they feel too heavy to carry alone."
    },
    5: {
      text: "With Chiron in the fifth house, old sensitivities around self-expression, romance and play tend to stir. You may feel shy about being seen, fear rejection in love, or find that creative work stirs up old criticism you absorbed long ago. Children, your own or others', can mirror early hurts back to you. Healing comes through reclaiming joy on your own terms, creating from vulnerability, and rediscovering the playful self that was once dismissed or teased. Small, private acts of creativity often matter most.",
      advice: "Make something just for yourself each week, and let it be playful and imperfect."
    },
    6: {
      text: "Health, work and daily routine become the sensitive areas while Chiron passes through the sixth house. Physical niggles may need attention, or you may feel overlooked and undervalued at work. Habits you use to cope, such as overworking or skipping meals, can come into plain view. This is often a period of learning your body's real limits. Healing comes through routines that genuinely care for you, and frequently through work that involves helping, healing or serving others with patience.",
      advice: "Listen to your body's early signals, seek proper care, and build routines around genuine wellbeing."
    },
    7: {
      text: "Relationship wounds tend to surface with Chiron in the seventh house. You may attract partners who echo old hurts, or feel unusually sensitive to rejection and imbalance. Pain from past relationships can resurface, sometimes triggered by a small comment. It is a tender, revealing period. Healing tends to come through honest communication and through seeing clearly how you give and receive in close bonds. Many people become more compassionate partners and learn to support others through relationship struggles.",
      advice: "Notice patterns in your relationships without blaming yourself or anyone else, and speak honestly about what hurts."
    },
    8: {
      text: "Deep wounds around trust, intimacy, loss or shared resources can stir during Chiron's eighth house transit. Old grief may resurface, and letting someone close can feel frightening. Issues of control or dependency may become visible in ways you cannot ignore. Emotionally it can be a demanding time. It also brings a chance for real healing, particularly through therapy, honest intimacy or facing fear directly. Many people come away with a new capacity to support others through crisis.",
      advice: "Let trusted people see your vulnerability gradually, and find support for grief or fear that feels overwhelming."
    },
    9: {
      text: "Chiron moving through the ninth house tends to touch wounds around belief, education and meaning. You may question your faith, feel you lack the right qualifications, or confront disillusionment with teachers or institutions. Travel can stir unexpected sensitivities, such as feeling foreign or out of place. It is a searching time. Healing comes through building your own philosophy from experience, and many people become wise guides for others wrestling with the same questions.",
      advice: "Let doubt open questions instead of closing them, and seek teachers who respect your own experience."
    },
    10: {
      text: "Career, recognition and authority become sore points while Chiron occupies the tenth house. You may feel unseen professionally, struggle with imposter feelings, or have difficulty with people in charge. Public exposure can feel uncomfortable, and ambition may feel exposed. Healing comes through finding a vocation that honours your experience, including the struggles you would once have hidden. Many people find their calling in helping others through the same challenges they faced.",
      advice: "Recognise your professional achievements honestly, and consider how your own struggles could inform your work."
    },
    11: {
      text: "Wounds around belonging, friendship and groups tend to be touched while Chiron moves through the eleventh house. You may feel like an outsider, experience rejection from a community, or remember old social hurts from school or early adulthood. Hopes for the future can feel fragile. At times it may be lonely. Healing comes through finding people who accept you as you are, and often through creating inclusive spaces for others who feel different. Friendships formed during these years can be unusually meaningful.",
      advice: "Seek out one group where you feel genuinely welcome, and offer the same welcome to others."
    },
    12: {
      text: "Hidden wounds tend to come up for air during Chiron's twelfth house transit. Old pain, sometimes from childhood or inherited through the family line, may surface in dreams, solitude or quiet moments. You may feel vulnerable without knowing why. This is a deeply introspective time. Healing comes through rest, spiritual practice, therapy or creative work that gives form to what is hard to say. Many people find a profound compassion and a sense of peace emerging from facing what was long buried.",
      advice: "Give yourself regular quiet time, and bring whatever surfaces to a counsellor, journal or trusted friend."
    }
  },

  sun: {
    1: { text: "The month the Sun crosses your first house often feels like a personal new year. Energy and confidence rise, people notice you more, and it is a natural moment to start something, refresh your appearance or set intentions for the months ahead." },
    2: { text: "Attention turns to money, possessions and what you are worth while the Sun moves through your second house. It suits reviewing your spending, asking for fair pay, or recognising which skills and belongings genuinely support the life you want." },
    3: { text: "Conversations, errands and short trips tend to fill this month as the Sun passes your third house. Curiosity rises, messages multiply, and siblings or neighbours may feature more than usual. It is a useful stretch for learning, writing and catching up." },
    4: { text: "With the Sun in your fourth house, your focus drifts homeward. You may want more time with family, feel like nesting, or finally deal with household matters. Outward energy can dip a little, which makes this a good month to recharge." },
    5: { text: "Pleasure and self-expression come forward when the Sun enters your fifth house. Romance, creative projects, children and play tend to bring more joy than usual. The month favours doing something purely because you enjoy it, and letting yourself be seen." },
    6: { text: "Daily routines, work tasks and health habits get the spotlight while the Sun crosses your sixth house. It is a practical month for organising, clearing a backlog, improving one routine, or looking after your body with a little more care." },
    7: { text: "Other people take centre stage as the Sun moves into your seventh house, opposite where it sat on your birthday. Partners, clients and close collaborators need attention, and relationships tend to reflect back how you are doing. Cooperation works better than going it alone." },
    8: { text: "Deeper matters come up during the Sun's month in your eighth house: shared money, intimacy, debts, tax or feelings you usually sidestep. It can feel intense, and it often brings useful clarity about what you share with others and on what terms." },
    9: { text: "Horizons widen when the Sun travels through your ninth house. Travel, study, big ideas and questions of meaning tend to appeal. It is a good month for planning a trip, enrolling in a course, or stepping back to see the larger shape of your life." },
    10: { text: "This is often your most visible month of the year, as the Sun crosses the top of your chart. Career matters, reputation and ambitions come forward, and people in authority may notice your efforts. A strong time to put yourself forward professionally." },
    11: { text: "Friends, groups and future plans shine while the Sun moves through your eleventh house. Invitations often increase and collaboration comes more easily. You may feel inspired to revisit long-term goals, especially alongside people who share your hopes." },
    12: { text: "The month before your birthday, with the Sun in your twelfth house, often feels quieter and more inward. Energy may run lower, and rest, reflection and finishing things suit it best. Tying up loose ends clears the way for the year ahead." }
  },

  mercury: {
    1: { text: "Mercury in your first house sharpens your wits and makes you quicker to speak up. You may feel mentally restless and eager to share ideas. It suits pitching, interviews and any situation where you need to explain yourself clearly and confidently." },
    2: { text: "Thoughts turn to money and possessions while Mercury moves through your second house. You may review bills, compare prices, negotiate or plan purchases. It is a helpful period for practical thinking about resources and for putting your skills into words." },
    3: { text: "Mercury feels at home in your third house, so messages, conversations and short trips tend to multiply. Your mind works quickly and curiously. It is a productive stretch for writing, study, networking and staying in touch with siblings and neighbours." },
    4: { text: "Conversations drift toward home and family as Mercury passes through your fourth house. You may discuss household plans, sort paperwork, research property or think a lot about the past. Relatives may want to talk, and old memories surface easily." },
    5: { text: "Play and self-expression become more talkative with Mercury in your fifth house. Flirting, games, creative writing and lively conversation with children all come easily. Share the ideas you are excited about, and enjoy some purely mental fun." },
    6: { text: "A busy stream of work messages, lists and practical details tends to arrive as Mercury crosses your sixth house. It suits organising schedules, fixing systems and researching healthier routines. Watch for nervous tension if the to-do list gets long." },
    7: { text: "Conversations with partners, clients and close collaborators become central while Mercury moves through your seventh house. Negotiations, contracts and important discussions tend to cluster now. Listening carefully and clarifying expectations keep relationships running smoothly." },
    8: { text: "Your thinking turns toward deeper subjects when Mercury enters your eighth house: shared finances, psychology, secrets or taboo topics. Research and investigation come easily. It can be a useful time for frank conversations about money, trust and intimacy." },
    9: { text: "Your mind reaches outward as Mercury crosses your ninth house. Study, travel plans, publishing and philosophical conversation tend to appeal. It is a good time to learn something new, test your opinions, or share a big idea with a wider audience." },
    10: { text: "Career communication comes to the fore with Mercury in your tenth house. Meetings, presentations, emails with managers and professional planning tend to increase. It suits speaking up about your ambitions and making your ideas visible at work." },
    11: { text: "Social conversation flows while Mercury moves through your eleventh house. You may reconnect with friends, join group discussions or network online. It is a useful period for brainstorming future plans and trading ideas with like-minded people." },
    12: { text: "Your thoughts tend to turn inward while Mercury crosses your twelfth house. You may think more than you speak, mull over the past or notice intuitive hunches. It suits journalling, quiet research and finishing old work before starting anything new." }
  },

  venus: {
    1: { text: "Venus crossing your first house tends to make you more relaxed, sociable and appealing to others. People often respond warmly, and you may want to refresh your wardrobe or look. It is a pleasant stretch for first impressions and simple enjoyment." },
    2: { text: "Comfort, beauty and good quality things tend to attract you while Venus moves through your second house. Income may improve, and spending can tempt you just as much. Appreciating what you already have helps you recognise your own worth." },
    3: { text: "Your words soften and conversations grow easier with Venus in your third house. Relationships with siblings, neighbours and colleagues tend to improve. Kind messages, local outings and learning something beautiful all suit this gentle, sociable period." },
    4: { text: "Home becomes especially inviting while Venus passes through your fourth house. You may want to decorate, entertain or spend more time with family. Tensions with relatives often ease, and small domestic comforts feel more important than usual." },
    5: { text: "Few transits are as enjoyable as Venus in your fifth house. Romance, flirting, creativity and fun tend to flourish. It is a lovely time for dates, making art, playing, and spending easy, affectionate time with children or the people you love." },
    6: { text: "Work tends to feel more pleasant with Venus in your sixth house, and relations with colleagues ease. It favours brightening your workspace, enjoying routines that feel good, and treating your body with gentle, consistent care instead of harsh discipline." },
    7: { text: "Partnership takes centre stage while Venus crosses your seventh house. Relationships tend to feel more harmonious, and you may meet someone significant or grow closer to a partner. Negotiations and collaborations benefit from the goodwill in the air." },
    8: { text: "Intimacy tends to deepen when Venus moves through your eighth house. Emotional and physical closeness can feel more intense, and shared money may come into focus. It suits honest conversations about trust, desire and what you hold in common." },
    9: { text: "Pleasure comes through travel, study and new experiences while Venus passes your ninth house. You may be attracted to people from different backgrounds, or to beautiful places far from home. Curiosity and affection tend to go hand in hand." },
    10: { text: "Charm tends to work in your favour professionally while Venus crosses your tenth house. People in authority may view you kindly, and working relationships often improve. It is a helpful time to present your work well and seek recognition." },
    11: { text: "Friendships feel warmer while Venus moves through your eleventh house. Social life may get busier, and groups tend to welcome you. It suits reconnecting with old friends, joining a community, and sharing your hopes with people who care." },
    12: { text: "Love and pleasure turn inward when Venus enters your twelfth house. You may crave solitude, reflect on past relationships or feel quiet compassion for others. Secret attractions are possible. Gentle self-care and unhurried rest suit this period well." }
  },

  mars: {
    1: { text: "Mars crossing your first house tends to boost energy, courage and impatience in equal measure. You may feel ready to act, start projects or assert yourself. Exercise helps channel the heat, while rushing can lead to small accidents or quick arguments." },
    2: { text: "Your drive to earn tends to fire up with Mars in your second house. You may work harder for income, push for a raise or feel impulsive about spending. Arguments over possessions or values can flare, so pause before reacting." },
    3: { text: "Words become sharper and faster while Mars moves through your third house. You may debate, write forcefully or rush between errands. Driving and commuting call for extra care, and friction with siblings or neighbours is more likely than usual." },
    4: { text: "Energy tends to gather at home when Mars enters your fourth house. Renovations, clearing clutter and heavy household jobs suit it well. Family tensions can rise too, and patience with relatives goes a long way toward keeping the peace." },
    5: { text: "Passion flows into romance, creativity and play while Mars crosses your fifth house. You may pursue someone boldly, throw yourself into a creative project or enjoy competitive sport. Risk-taking appeals, so choose your challenges with some care." },
    6: { text: "Work and health routines get a jolt of energy with Mars in your sixth house. You can clear a great many tasks and may start a new exercise regime. Overwork, minor strains and friction with colleagues are the usual pitfalls." },
    7: { text: "Relationships heat up while Mars moves through your seventh house. Partners may be more assertive, or conflicts that have simmered can surface. Honest confrontation often clears the air, and acting together with others can achieve a great deal." },
    8: { text: "Desire and emotional power struggles tend to intensify with Mars in your eighth house. Shared finances or debts may call for decisive action, and sexual energy often rises. It suits tackling difficult issues head on, with care for how others feel." },
    9: { text: "The urge for adventure tends to fire up as Mars crosses your ninth house. Travel, study, sport or debating beliefs appeal strongly. You may defend your views passionately, so keep an open mind when someone disagrees with you." },
    10: { text: "Ambition runs hot while Mars moves through your tenth house. You may work hard toward career goals, compete for recognition or clash with people in authority. It suits bold professional steps, taken with enough diplomacy to keep allies onside." },
    11: { text: "With Mars in your eleventh house, you may take an active role in groups, causes or team projects. Social energy rises, though friction with friends is possible when opinions clash. It suits pushing shared goals forward with real momentum." },
    12: { text: "Drive tends to turn inward while Mars passes through your twelfth house. You may feel tired, frustrated or unsure where to direct your drive. Rest, behind-the-scenes work and finding safe outlets for old anger help most." }
  },

  northNode: {
    1: { text: "With the North Node in your first house, growth asks you to back yourself more often. Independence, self-definition and taking initiative are favoured, while bending to fit partners' wishes, the pull of the South Node in the seventh, feels less satisfying." },
    2: { text: "Growth points toward self-reliance, steady earning and knowing what you value while the North Node crosses your second house. Leaning on other people's resources or emotional intensity, the eighth house habit, tends to lose its appeal during these eighteen months." },
    3: { text: "Curiosity, conversation and local connection are where growth lies while the North Node moves through your third house. Asking questions and listening carefully tend to serve you better than preaching big certainties, the ninth house comfort zone." },
    4: { text: "Growth turns homeward with the North Node in your fourth house. Family, roots and emotional foundations ask for attention, and chasing status or public approval, the tenth house default, may start to feel hollow by comparison." },
    5: { text: "Creative and romantic risks are favoured with the North Node in your fifth house, along with enjoying yourself openly. Hiding in the crowd or putting group goals first, the eleventh house habit, is less rewarding than usual." },
    6: { text: "Practical routines, useful work and care for your body are favoured while the North Node crosses your sixth house. Drifting, escaping or waiting for inspiration, the twelfth house pattern, gives way to steady daily effort." },
    7: { text: "Partnership becomes the growth area with the North Node in your seventh house. Cooperation, compromise and genuine interest in others are favoured, while insisting on doing everything your own way, the first house reflex, tends to backfire." },
    8: { text: "Sharing more deeply, emotionally and materially, is the task while the North Node crosses your eighth house. Trust, intimacy and letting go of control are favoured, while clinging to comfort and ownership, the second house habit, keeps you stuck." },
    9: { text: "Big questions and wider horizons call while the North Node moves through your ninth house. Travel, study and developing a philosophy of your own are favoured, while endless information gathering and small talk, the third house habit, feel less nourishing." },
    10: { text: "Career and public responsibility become the growth edge with the North Node in your tenth house. Stepping into a visible role is favoured, even when retreating into private and family life, the fourth house comfort, feels safer." },
    11: { text: "Friendship, community and long-range hopes are highlighted while the North Node crosses your eleventh house. Collaborating toward shared goals tends to reward you more than seeking personal applause, the fifth house habit." },
    12: { text: "Solitude, surrender and inner work are asked of you with the North Node in your twelfth house. Rest, spiritual practice and quiet service are favoured, while fixing, organising and controlling every detail, the sixth house reflex, brings diminishing returns." }
  }
};
