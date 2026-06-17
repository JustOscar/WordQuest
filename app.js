(function () {
  "use strict";

  var TOTAL_WEEKS = 26;
  var DAYS_PER_WEEK = 7;
  var WORDS_PER_QUEST = 5;
  var TOTAL_SESSIONS = TOTAL_WEEKS * DAYS_PER_WEEK;
  var REVIEW_EVERY = 5;
  var STORAGE_KEY = "greatWordQuestProgress.v1";

  var TIERS = [
    {
      name: "Tier 1: The Valley of Sounds",
      shortName: "The Valley of Sounds",
      startWeek: 1,
      endWeek: 6,
      realms: ["Mossy Letter Gate", "Whispering Pebble Path", "Sunny Sound Meadow", "Firefly Reading Grove", "Cozy Acorn Bridge", "Moonbeam Word Pond"]
    },
    {
      name: "Tier 2: The Island of Actions",
      shortName: "The Island of Actions",
      startWeek: 7,
      endWeek: 12,
      realms: ["Splashy Verb Cove", "Jumping Shell Beach", "Blue Kite Cliff", "Rolling Coconut Trail", "Sailboat Sound Bay", "Dancing Palm Pier"]
    },
    {
      name: "Tier 3: The Forest of Descriptions",
      shortName: "The Forest of Descriptions",
      startWeek: 13,
      endWeek: 18,
      realms: ["Rainbow Leaf Woods", "Tiny Lantern Hollow", "Bright Button Trail", "Happy Fern Clearing", "Soft Moss Library", "Silver Berry Bridge"]
    },
    {
      name: "Tier 4: The Castle of Stories",
      shortName: "The Castle of Stories",
      startWeek: 19,
      endWeek: 26,
      realms: ["Golden Gate Courtyard", "Secret Story Hall", "Dragonfly Tower", "Moonlit Library", "Crystal Key Garden", "Starry Choice Room", "Crown and Lantern Path", "Wish Window Balcony"]
    }
  ];

  function splitWords(text) {
    return text.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").split(" ");
  }

  function addEntries(target, text, kind) {
    var list = splitWords(text);
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i]) {
        target.push({ text: list[i], key: list[i].toLowerCase(), kind: kind });
      }
    }
  }

  function buildWordBanks() {
    var banks = [[], [], [], []];

    addEntries(banks[0],
      "cat bat rat mat sat hat cap map tap nap lap gap bag tag rag wag ham jam ram fan man pan van can ran dad mad sad pad had bad " +
      "bed red fed led wed web hen pen ten men den pet met net set wet vet jet get let yes " +
      "big pig wig dig fig fin pin win tin bin bit sit fit hit kit pit lip hip zip rip sip dip lid kid hid dim him " +
      "dog log fog hog jog hot cot pot dot lot not box fox pop top hop mop sob rob rod pod " +
      "bug rug dug tug hug mug mud bud bun fun sun run cut hut but nut cup pup bus gum gun cab lab tab cob job rib bib cub tub sub",
      "cvc");
    addEntries(banks[0],
      "a I am an and are as at be by do for from go has have he her here his in is it like little look me my no of on one or said see she so the there they this to up was we were what where who with you your",
      "sight");
    addEntries(banks[0],
      "ship shop shut shed shell fish dish wish chin chip chat chop chick much such rich bath path math moth thin than that then " +
      "star stem step stop stay stone stool snail snap snack snow spin spill spot spoon blue black block blink bloom blast blend " +
      "clap clip clam club clock cloud flag flap flip frog fresh green grass grin grab grow tree train truck trip trap " +
      "drip drop drum dress dream crab crib crop crown brush brick bring brave brown slide sleep slow smile small smell",
      "blend");

    addEntries(banks[1],
      "run jump hop skip swim fly walk crawl climb slide spin dance sing clap wave kick toss catch throw roll push pull lift carry paint draw read write " +
      "look see hear smell taste touch hug help wash brush bake cook stir mix pour slice build stack open close shut bring take give get find hide seek " +
      "dig plant grow water pick ride drive sail row float dive splash skate swing bounce march tiptoe whisper shout laugh smile cry sleep wake eat drink " +
      "chew bite sip share count sort match choose point tap drag drop stretch bend twist turn wiggle shake nod bow peek chase follow lead stop start move " +
      "rest zoom race pack fold sweep mop wipe clean dust rake scoop pat patter hum drum cheer",
      "verb");
    addEntries(banks[1],
      "bear fish bird duck frog crab turtle dog cat fox horse sheep cow pig goat hen bug bee ant butterfly boat ship kite ball bike car bus train plane rocket " +
      "drum bell book pencil brush cup spoon plate door window chair table bed bag box shell wave sand island sail flag rope ladder bridge bucket shovel net",
      "noun");
    addEntries(banks[1],
      "big little blue red green yellow fast slow high low wet dry loud quiet soft bright happy silly brave calm",
      "adjective");

    addEntries(banks[2],
      "red blue yellow green orange purple pink black white brown gray gold silver rainbow bright dark light shiny dull clear cloudy big small tiny huge tall short " +
      "long wide narrow round square soft hard smooth rough bumpy fuzzy fluffy silky sticky slippery warm cold hot cool wet dry clean messy full empty happy sad " +
      "silly brave calm kind mad shy proud sleepy awake fast slow loud quiet sweet sour spicy yucky yummy gentle strong weak new old young safe lost found near " +
      "far high low deep flat curved straight sharp cozy glad upset worried excited noisy silent busy lazy early late first last next best fine fair",
      "adjective");
    addEntries(banks[2],
      "rabbit pony turtle flower cloud river hill cave bell feather pebble blanket basket garden rainbow moon star planet leaf branch seed pumpkin apple berry carrot " +
      "cookie honey pillow boat wagon ladder tunnel bridge tower village meadow forest nest door window button ribbon scarf lantern candle stone pond trail",
      "noun");
    addEntries(banks[2],
      "because after before under over beside inside outside between around through above below near behind beside with without into onto",
      "context");

    addEntries(banks[3],
      "castle tower gate door window hallway room roof garden forest cave lake river village market kitchen library bedroom meadow mountain bridge tunnel island beach " +
      "palace pond path trail courtyard balcony stair step wall arch field farm shop school home tent camp valley hill",
      "story-noun");
    addEntries(banks[3],
      "key crown gem jewel bell rope book letter box basket lantern map mirror shell feather coin seed wand drum clock cup plate spoon scarf ribbon blanket pillow " +
      "broom candle button pocket bottle apple pear peach plum bread cake soup cheese milk water juice tea flower leaf branch stone star moon cloud flag sail boat",
      "story-noun");
    addEntries(banks[3],
      "princess knight dragon fairy baker painter teacher friend queen king child mother father sister brother grandpa grandma puppy kitten owl fox bear rabbit turtle " +
      "frog bird bee butterfly wizard helper singer dancer reader keeper gardener sailor captain",
      "character");
    addEntries(banks[3],
      "find found open opened close closed follow followed enter entered leave left carry carried whisper whispered answer answered listen listened decide decided choose chose " +
      "wonder wondered remember remembered promise promised invite invited thank thanked rescue rescued share shared sparkle sparkled glow glowed climb climbed point pointed " +
      "turn turned wait waited knock knocked ask asked read reads write writes smile smiled laugh laughed",
      "story-verb");
    addEntries(banks[3],
      "golden silver hidden secret brave gentle curious lonely clever magical quiet bright tiny giant sleepy lucky red blue yellow green purple orange pink white black " +
      "brown happy sad silly calm proud shy kind soft warm cool dark light",
      "story-adjective");
    addEntries(banks[3],
      "morning evening night today tomorrow yesterday once again suddenly carefully softly quickly slowly happily kindly under over beside inside outside between around through " +
      "across behind before after because when where why who adventure treasure mystery surprise picnic parade song story wish dream clue choice",
      "story-context");

    return banks;
  }

  var WORD_BANKS = buildWordBanks();

  var dom = {
    progressLabel: document.getElementById("progressLabel"),
    tierLabel: document.getElementById("tierLabel"),
    realmBadge: document.getElementById("realmBadge"),
    roundBadge: document.getElementById("roundBadge"),
    questTitle: document.getElementById("questTitle"),
    companionLine: document.getElementById("companionLine"),
    targetWord: document.getElementById("targetWord"),
    challengeArea: document.getElementById("challengeArea"),
    feedback: document.getElementById("feedback"),
    hearButton: document.getElementById("hearButton"),
    nextButton: document.getElementById("nextButton"),
    soundToggle: document.getElementById("soundToggle"),
    sceneFrame: document.getElementById("sceneFrame"),
    parentToggle: document.getElementById("parentToggle"),
    parentPanel: document.getElementById("parentPanel"),
    closePanel: document.getElementById("closePanel"),
    weekSelect: document.getElementById("weekSelect"),
    daySelect: document.getElementById("daySelect"),
    goToDay: document.getElementById("goToDay"),
    resetGame: document.getElementById("resetGame"),
    parentStats: document.getElementById("parentStats")
  };

  var saved = loadProgress();
  var play = {
    sessionIndex: clampSession(saved.sessionIndex || 0),
    session: null,
    roundIndex: 0,
    answered: false,
    mistakes: 0,
    chosenStoryWord: "",
    voiceStarted: false,
    advanceTimer: null,
    promptTimer: null
  };
  var audioContext = null;

  function loadProgress() {
    var fallback = { sessionIndex: 0, soundOn: true, knownWords: {}, completed: {} };
    var raw;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return fallback;
      }
      raw = JSON.parse(raw);
      raw.sessionIndex = typeof raw.sessionIndex === "number" ? raw.sessionIndex : 0;
      raw.soundOn = raw.soundOn !== false;
      raw.knownWords = raw.knownWords || {};
      raw.completed = raw.completed || {};
      return raw;
    } catch (error) {
      return fallback;
    }
  }

  function saveProgress() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (error) {
      return false;
    }
    return true;
  }

  function clampSession(index) {
    if (index < 0) {
      return 0;
    }
    if (index >= TOTAL_SESSIONS) {
      return TOTAL_SESSIONS - 1;
    }
    return index;
  }

  function getWeekDay(index) {
    return {
      week: Math.floor(index / DAYS_PER_WEEK) + 1,
      day: (index % DAYS_PER_WEEK) + 1
    };
  }

  function getTierIndexFromWeek(week) {
    if (week <= 6) {
      return 0;
    }
    if (week <= 12) {
      return 1;
    }
    if (week <= 18) {
      return 2;
    }
    return 3;
  }

  function isReviewSession(index) {
    var info = getWeekDay(index);
    var tierIndex = getTierIndexFromWeek(info.week);
    var localSession = index - tierStartSession(tierIndex) + 1;
    return localSession % REVIEW_EVERY === 0;
  }

  function tierStartSession(tierIndex) {
    return (TIERS[tierIndex].startWeek - 1) * DAYS_PER_WEEK;
  }

  function countLearningSessionsBefore(tierIndex, sessionIndex) {
    var start = tierStartSession(tierIndex);
    var count = 0;
    var i;
    for (i = start; i < sessionIndex; i += 1) {
      if (!isReviewSession(i)) {
        count += 1;
      }
    }
    return count;
  }

  function pickWordsFromBank(bank, offset, count) {
    var picked = [];
    var seen = {};
    var i = 0;
    var item;
    while (picked.length < count && i < bank.length * 2) {
      item = bank[(offset + i) % bank.length];
      if (!seen[item.key]) {
        picked.push(item);
        seen[item.key] = true;
      }
      i += 1;
    }
    return picked;
  }

  function getNewWordsForSession(index) {
    var info = getWeekDay(index);
    var tierIndex = getTierIndexFromWeek(info.week);
    var bank = WORD_BANKS[tierIndex];
    var learningNumber = countLearningSessionsBefore(tierIndex, index);
    return pickWordsFromBank(bank, learningNumber * WORDS_PER_QUEST, WORDS_PER_QUEST);
  }

  function getReviewWords(index) {
    var pool = [];
    var seen = {};
    var i;
    var words;
    var w;
    for (i = index - 1; i >= 0 && pool.length < 24; i -= 1) {
      if (!isReviewSession(i)) {
        words = getNewWordsForSession(i);
        for (w = 0; w < words.length; w += 1) {
          if (!seen[words[w].key]) {
            pool.push(words[w]);
            seen[words[w].key] = true;
          }
        }
      }
    }
    if (pool.length < WORDS_PER_QUEST) {
      words = getNewWordsForSession(index);
      for (w = 0; w < words.length; w += 1) {
        if (!seen[words[w].key]) {
          pool.push(words[w]);
          seen[words[w].key] = true;
        }
      }
    }
    return pickWordsFromBank(pool, index % Math.max(pool.length, 1), WORDS_PER_QUEST);
  }

  function buildSession(index) {
    var info = getWeekDay(index);
    var tierIndex = getTierIndexFromWeek(info.week);
    var tier = TIERS[tierIndex];
    var review = isReviewSession(index);
    var realmIndex = (info.week + info.day + tierIndex) % tier.realms.length;
    var modesByTier = [
      ["match", "build", "sentence", "match", "build"],
      ["sentence", "match", "build", "sentence", "match"],
      ["sentence", "build", "sentence", "match", "sentence"],
      ["story", "sentence", "choice", "build", "story"]
    ];
    return {
      index: index,
      week: info.week,
      day: info.day,
      tierIndex: tierIndex,
      tier: tier,
      review: review,
      realm: review ? "Treasure Chest Review Day" : tier.realms[realmIndex],
      words: review ? getReviewWords(index) : getNewWordsForSession(index),
      modes: modesByTier[tierIndex]
    };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function displayWord(entry) {
    if (!entry) {
      return "";
    }
    if (entry.text === "i") {
      return "I";
    }
    return entry.text;
  }

  function seededNumber(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function shuffle(list, seed) {
    var copy = list.slice(0);
    var i;
    var j;
    var temp;
    for (i = copy.length - 1; i > 0; i -= 1) {
      j = Math.floor(seededNumber(seed + i * 13) * (i + 1));
      temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function getChoiceEntries(correct, count) {
    var bank = WORD_BANKS[play.session.tierIndex];
    var options = [correct];
    var seen = {};
    var i;
    var item;
    seen[correct.key] = true;
    for (i = 0; options.length < count && i < bank.length * 2; i += 1) {
      item = bank[(play.session.index * 7 + play.roundIndex * 11 + i) % bank.length];
      if (!seen[item.key] && Math.abs(item.text.length - correct.text.length) <= 3) {
        options.push(item);
        seen[item.key] = true;
      }
    }
    return shuffle(options, play.session.index + play.roundIndex + 3);
  }

  function getLetterOptions(word, missingIndex) {
    var letters = "abcdefghijklmnopqrstuvwxyz";
    var correct = word.charAt(missingIndex).toLowerCase();
    var options = [correct];
    var seed = play.session.index + play.roundIndex * 17;
    var i;
    var letter;
    for (i = 0; options.length < 3 && i < letters.length; i += 1) {
      letter = letters.charAt(Math.floor(seededNumber(seed + i) * letters.length));
      if (options.indexOf(letter) === -1) {
        options.push(letter);
      }
    }
    return shuffle(options, seed + 44);
  }

  function phonicsText(entry) {
    var text = displayWord(entry);
    var lower = text.toLowerCase();
    if (entry.kind === "sight" || lower.length > 5) {
      return "Read the word: " + text + ".";
    }
    return lower.split("").join("-") + ". " + text + ".";
  }

  function sentenceFor(entry, blank) {
    var word = blank ? "____" : displayWord(entry);
    var kind = entry.kind;
    if (kind === "verb") {
      return "Lumi can " + word + ".";
    }
    if (kind === "adjective" || kind === "story-adjective") {
      return "The star is " + word + ".";
    }
    if (kind === "context" || kind === "story-context") {
      return "The helper word is " + word + ".";
    }
    if (kind === "sight") {
      return sightSentence(entry.text, blank);
    }
    if (kind === "character") {
      return "Lumi meets the " + word + ".";
    }
    if (kind === "story-verb") {
      return "The story word is " + word + ".";
    }
    return "Lumi sees " + articleFor(word) + " " + word + ".";
  }

  function articleFor(word) {
    var first = String(word).charAt(0).toLowerCase();
    return "aeiou".indexOf(first) >= 0 ? "an" : "a";
  }

  function sightSentence(word, blank) {
    var show = blank ? "____" : displayWord({ text: word });
    var key = word.toLowerCase();
    var lines = {
      "a": "Lumi sees " + show + " map.",
      "i": show + " can read.",
      "am": "I " + show + " happy.",
      "an": "Lumi sees " + show + " ant.",
      "and": "Lumi " + show + " Bear read.",
      "are": "We " + show + " here.",
      "as": "Run " + show + " fast as Lumi.",
      "at": "Look " + show + " the sun.",
      "be": "I can " + show + " brave.",
      "by": "Sit " + show + " Lumi.",
      "do": show + " you see it?",
      "for": "This is " + show + " you.",
      "from": "A note came " + show + " Lumi.",
      "go": "We " + show + " up.",
      "has": "Lumi " + show + " a map.",
      "have": "I " + show + " a hat.",
      "he": show + " can hop.",
      "her": "This is " + show + " cup.",
      "here": "Lumi is " + show + ".",
      "his": "This is " + show + " bell.",
      "in": "The bug is " + show + " the cup.",
      "is": "The sun " + show + " up.",
      "it": show + " is big.",
      "like": "I " + show + " the cat.",
      "little": "A " + show + " fox hops.",
      "look": show + " at Lumi.",
      "me": "Come with " + show + ".",
      "my": "This is " + show + " map.",
      "no": show + " mud today.",
      "of": "A cup " + show + " tea.",
      "on": "The cat is " + show + " the mat.",
      "one": "I see " + show + " star.",
      "or": "Cat " + show + " dog?",
      "said": "Lumi " + show + " hello.",
      "see": "I " + show + " a sun.",
      "she": show + " can run.",
      "so": "The star is " + show + " bright.",
      "the": show + " cat naps.",
      "there": "Go over " + show + ".",
      "they": show + " can play.",
      "this": show + " is a map.",
      "to": "Go " + show + " the gate.",
      "up": "Look " + show + ".",
      "was": "The sky " + show + " pink.",
      "we": show + " can read.",
      "were": "We " + show + " brave.",
      "what": show + " is it?",
      "where": show + " is Lumi?",
      "who": show + " can help?",
      "with": "Read " + show + " Lumi.",
      "you": show + " did it.",
      "your": "Open " + show + " map."
    };
    return lines[key] || "Read " + show + ".";
  }

  function buildRoundData() {
    return {
      word: play.session.words[play.roundIndex],
      mode: play.session.modes[play.roundIndex] || "match"
    };
  }

  function render() {
    play.session = buildSession(play.sessionIndex);
    if (play.roundIndex >= play.session.words.length) {
      renderComplete();
      return;
    }
    play.answered = false;
    play.mistakes = 0;
    updateHeader();
    renderRound();
    renderParentStats();
  }

  function updateHeader() {
    dom.progressLabel.innerHTML = "Week " + play.session.week + ", Day " + play.session.day;
    dom.tierLabel.innerHTML = escapeHtml(play.session.tier.shortName);
    dom.realmBadge.innerHTML = escapeHtml(play.session.realm);
    dom.roundBadge.innerHTML = (play.roundIndex + 1) + " of " + play.session.words.length;
    dom.soundToggle.innerHTML = saved.soundOn ? "Audio on" : "Audio off";
    dom.soundToggle.setAttribute("aria-label", saved.soundOn ? "Turn sound off" : "Turn sound on");
  }

  function renderRound() {
    var data = buildRoundData();
    var title = play.session.review ? "Treasure Chest Review" : titleForMode(data.mode);
    play.answered = false;
    play.mistakes = 0;
    clearAutoTimers();
    updateHeader();
    dom.questTitle.innerHTML = escapeHtml(title);
    dom.companionLine.innerHTML = escapeHtml(lineForMode(data.mode, data.word));
    dom.targetWord.innerHTML = escapeHtml(targetDisplayFor(data.word, data.mode));
    dom.targetWord.className = "target-word";
    dom.feedback.innerHTML = "";
    dom.feedback.className = "feedback";
    dom.nextButton.disabled = true;
    dom.nextButton.innerHTML = play.roundIndex === play.session.words.length - 1 ? "Finish" : "Next";
    renderScene(data.word);
    if (data.mode === "build") {
      renderBuild(data.word);
    } else if (data.mode === "sentence") {
      renderSentence(data.word);
    } else if (data.mode === "story") {
      renderStory(data.word);
    } else if (data.mode === "choice") {
      renderChoice(data.word);
    } else {
      renderMatch(data.word);
    }
    queueRoundPrompt();
  }

  function titleForMode(mode) {
    if (mode === "build") {
      return "Build the word";
    }
    if (mode === "sentence") {
      return "Read the tiny sentence";
    }
    if (mode === "story") {
      return "Read Lumi's story";
    }
    if (mode === "choice") {
      return "Choose the next path";
    }
    return "Read the word";
  }

  function lineForMode(mode, word) {
    return "";
  }

  function renderMatch(word) {
    var options = getChoiceEntries(word, 3);
    dom.challengeArea.innerHTML =
      miniLessonHtml(word, -1) +
      '<div class="word-options">' + optionButtons(options, word.key) + '</div>';
  }

  function renderBuild(word) {
    var text = displayWord(word).toLowerCase();
    var missing = missingIndexFor(text);
    var options = getLetterOptions(text, missing);
    dom.challengeArea.innerHTML =
      miniLessonHtml(word, missing) +
      '<div class="letter-options">' + letterButtons(options, text.charAt(missing)) + '</div>';
  }

  function renderSentence(word) {
    var options = getChoiceEntries(word, 3);
    dom.challengeArea.innerHTML =
      '<div class="sentence-line">' + escapeHtml(sentenceFor(word, true)) + '</div>' +
      '<div class="word-options">' + optionButtons(options, word.key) + '</div>';
  }

  function renderStory(word) {
    dom.challengeArea.innerHTML =
      miniLessonHtml(word, -1) +
      '<div class="word-options">' + optionButtons(getChoiceEntries(word, 3), word.key) + '</div>';
  }

  function renderChoice(word) {
    var other = getChoiceEntries(word, 2)[1] || word;
    var buttons = [
      '<button class="option-button story-choice" type="button" data-choice="' + escapeHtml(word.key) + '">' + escapeHtml(displayWord(word)) + '</button>',
      '<button class="option-button story-choice" type="button" data-choice="' + escapeHtml(other.key) + '">' + escapeHtml(displayWord(other)) + '</button>'
    ].join("");
    dom.challengeArea.innerHTML =
      '<div class="word-options">' + buttons + '</div>';
  }

  function canSoundOut(entry) {
    var text = displayWord(entry).toLowerCase();
    return entry.kind === "cvc" && /^[a-z][a-z][a-z]$/.test(text);
  }

  function missingIndexFor(text) {
    return Math.min(text.length - 1, (play.session.index + play.roundIndex) % text.length);
  }

  function wordPatternFor(entry) {
    var text = displayWord(entry).toLowerCase();
    var missing = missingIndexFor(text);
    return text.substring(0, missing) + "_" + text.substring(missing + 1);
  }

  function targetDisplayFor(entry, mode) {
    if (mode === "build" && canSoundOut(entry)) {
      return wordPatternFor(entry);
    }
    return displayWord(entry);
  }

  function miniLessonHtml(entry, missingIndex) {
    var text = displayWord(entry);
    var lower = text.toLowerCase();
    var i;
    var html = '<div class="mini-lesson">';
    if (canSoundOut(entry)) {
      html += '<div class="sound-boxes">';
      for (i = 0; i < lower.length; i += 1) {
        if (i === missingIndex) {
          html += '<span class="sound-box missing-sound">?</span>';
        } else {
          html += '<span class="sound-box">' + escapeHtml(lower.charAt(i)) + '</span>';
        }
      }
      html += '</div>';
    } else {
      html += '<div class="memory-word">' + escapeHtml(text) + '</div>';
    }
    html += '</div>';
    return html;
  }

  function optionButtons(options, answerKey) {
    var html = "";
    var i;
    for (i = 0; i < options.length; i += 1) {
      html += '<button class="option-button" type="button" data-answer="' + escapeHtml(answerKey) + '" data-value="' + escapeHtml(options[i].key) + '">' + escapeHtml(displayWord(options[i])) + '</button>';
    }
    return html;
  }

  function letterButtons(options, answer) {
    var html = "";
    var i;
    for (i = 0; i < options.length; i += 1) {
      html += '<button class="option-button" type="button" data-answer="' + escapeHtml(answer) + '" data-value="' + escapeHtml(options[i]) + '">' + escapeHtml(options[i]) + '</button>';
    }
    return html;
  }

  function handleOptionClick(event) {
    var target = event.target;
    var value;
    var answer;
    while (target && target !== dom.challengeArea && !hasClass(target, "option-button")) {
      target = target.parentNode;
    }
    if (!target || target === dom.challengeArea || play.answered) {
      return;
    }
    if (hasClass(target, "story-choice")) {
      play.chosenStoryWord = target.getAttribute("data-choice") || "";
      markCorrect(target, "You chose a sparkling path. Lumi is ready!");
      return;
    }
    value = target.getAttribute("data-value");
    answer = target.getAttribute("data-answer");
    if (value === answer) {
      markCorrect(target, praiseForCurrentWord());
    } else {
      markWrong(target);
    }
  }

  function hasClass(node, className) {
    return (" " + node.className + " ").indexOf(" " + className + " ") > -1;
  }

  function addClass(node, className) {
    if (!hasClass(node, className)) {
      node.className += " " + className;
    }
  }

  function markCorrect(target, message) {
    var data = buildRoundData();
    clearAutoTimers();
    addClass(target, "correct");
    disableRoundOptions();
    play.answered = true;
    saved.knownWords[data.word.key] = true;
    saveProgress();
    dom.feedback.innerHTML = escapeHtml(message);
    dom.feedback.className = "feedback";
    dom.targetWord.className = "target-word word-complete";
    playSuccessSound();
    speak("Yes. " + displayWord(data.word) + ".");
    play.advanceTimer = window.setTimeout(function () {
      nextRound();
    }, 1150);
    renderParentStats();
  }

  function markWrong(target) {
    var data = buildRoundData();
    clearPromptTimer();
    play.mistakes += 1;
    addClass(target, "wrong");
    dom.feedback.innerHTML = escapeHtml(hintFor(data.word));
    dom.feedback.className = "feedback try";
    playSoftSound();
    speak(wrongPromptFor(data));
  }

  function praiseForCurrentWord() {
    var word = buildRoundData().word;
    var lines = [
      "Yes! You read " + displayWord(word) + ".",
      "Sparkly reading! That word is " + displayWord(word) + ".",
      "Lumi is glowing. You found " + displayWord(word) + ".",
      "Wonderful! Your reading magic is growing."
    ];
    return lines[(play.session.index + play.roundIndex) % lines.length];
  }

  function hintFor(word) {
    var text = displayWord(word);
    if (word.kind === "cvc" || text.length <= 4) {
      return "Almost. Try the first sound: " + text.charAt(0).toLowerCase() + ". Then read " + phonicsText(word);
    }
    return "Good try. Look carefully at the first letter, then try " + text + " again.";
  }

  function nextRound() {
    if (!play.answered && play.roundIndex < play.session.words.length) {
      return;
    }
    clearAutoTimers();
    play.roundIndex += 1;
    if (play.roundIndex >= play.session.words.length) {
      renderComplete();
    } else {
      renderRound();
    }
  }

  function renderComplete() {
    var nextIndex = clampSession(play.sessionIndex + 1);
    clearAutoTimers();
    saved.completed[String(play.sessionIndex)] = true;
    if (saved.sessionIndex <= play.sessionIndex && play.sessionIndex < TOTAL_SESSIONS - 1) {
      saved.sessionIndex = nextIndex;
    }
    saveProgress();
    updateHeader();
    dom.roundBadge.innerHTML = "Done";
    dom.questTitle.innerHTML = "Quest complete";
    dom.companionLine.innerHTML = "Lumi tucked today's words into your treasure book.";
    dom.targetWord.innerHTML = "Yay!";
    dom.challengeArea.innerHTML =
      '<div class="finish-stars" aria-hidden="true"><span></span><span></span><span></span></div>';
    dom.feedback.innerHTML = "You are becoming a brave reader.";
    dom.nextButton.disabled = true;
    renderScene(null);
    renderParentStats();
    speak("You did it. Today's quest is finished.");
  }

  function speakCurrent() {
    var data = play.session && play.roundIndex < play.session.words.length ? buildRoundData() : null;
    play.voiceStarted = true;
    if (data) {
      speak(roundPromptFor(data));
    } else {
      speak("Great reading.");
    }
  }

  function speak(text) {
    var utterance;
    if (!saved.soundOn || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      utterance = new window.SpeechSynthesisUtterance(text);
      utterance.rate = 0.78;
      utterance.pitch = 1.18;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      return;
    }
  }

  function clearAutoTimers() {
    if (play.advanceTimer) {
      window.clearTimeout(play.advanceTimer);
      play.advanceTimer = null;
    }
    if (play.promptTimer) {
      window.clearTimeout(play.promptTimer);
      play.promptTimer = null;
    }
  }

  function queueRoundPrompt() {
    play.promptTimer = window.setTimeout(function () {
      speak(roundPromptFor(buildRoundData()));
    }, 350);
  }

  function roundPromptFor(data) {
    var word = displayWord(data.word);
    var lower = word.toLowerCase();
    if (data.mode === "build" && canSoundOut(data.word)) {
      return "Listen. The word is " + word + ". " + spokenSounds(lower) + ". One sound is missing. Touch the letter you hear.";
    }
    if (data.mode === "sentence") {
      return "Listen. Read with me. " + sentenceFor(data.word, false) + " Now touch " + word + ".";
    }
    if (data.mode === "story") {
      return "Listen. Lumi found the word " + word + ". Touch " + word + ".";
    }
    if (data.mode === "choice") {
      return "Listen. Touch a word to choose Lumi's path.";
    }
    if (canSoundOut(data.word)) {
      return "Listen. This word is " + word + ". " + spokenSounds(lower) + ". " + word + ". Touch " + word + ".";
    }
    return "Listen. This word is " + word + ". Touch " + word + ".";
  }

  function wrongPromptFor(data) {
    var word = displayWord(data.word);
    if (canSoundOut(data.word)) {
      return "Try again. Listen. " + spokenSounds(word.toLowerCase()) + ". " + word + ".";
    }
    return "Try again. Listen for " + word + ".";
  }

  function clearPromptTimer() {
    if (play.promptTimer) {
      window.clearTimeout(play.promptTimer);
      play.promptTimer = null;
    }
  }

  function spokenSounds(word) {
    var parts = [];
    var i;
    for (i = 0; i < word.length; i += 1) {
      parts.push(soundForLetter(word.charAt(i)));
    }
    return parts.join(". ") + ".";
  }

  function soundForLetter(letter) {
    var sounds = {
      a: "ah",
      b: "buh",
      c: "kuh",
      d: "duh",
      e: "eh",
      f: "fff",
      g: "guh",
      h: "huh",
      i: "ih",
      j: "juh",
      k: "kuh",
      l: "lll",
      m: "mmm",
      n: "nnn",
      o: "ah",
      p: "puh",
      q: "kwuh",
      r: "rrr",
      s: "sss",
      t: "tuh",
      u: "uh",
      v: "vvv",
      w: "wuh",
      x: "ks",
      y: "yuh",
      z: "zzz"
    };
    return sounds[letter] || letter;
  }

  function disableRoundOptions() {
    var buttons = dom.challengeArea.getElementsByTagName("button");
    var i;
    for (i = 0; i < buttons.length; i += 1) {
      buttons[i].disabled = true;
    }
  }

  function getAudioContext() {
    var Ctor;
    if (!saved.soundOn) {
      return null;
    }
    Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) {
      return null;
    }
    try {
      if (!audioContext) {
        audioContext = new Ctor();
      }
      if (audioContext.resume) {
        audioContext.resume();
      }
      return audioContext;
    } catch (error) {
      return null;
    }
  }

  function tone(frequency, start, duration, gainValue) {
    var context = getAudioContext();
    var oscillator;
    var gain;
    if (!context) {
      return;
    }
    oscillator = context.createOscillator();
    gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + start + duration);
    oscillator.stop(context.currentTime + start + duration);
  }

  function playSuccessSound() {
    tone(523, 0, 0.18, 0.06);
    tone(659, 0.08, 0.18, 0.05);
    tone(784, 0.16, 0.24, 0.045);
  }

  function playSoftSound() {
    tone(330, 0, 0.12, 0.035);
  }

  function renderScene(currentWord) {
    var tier = play.session ? play.session.tierIndex : 0;
    var bg = sceneColors(tier);
    dom.sceneFrame.innerHTML =
      '<svg viewBox="0 0 800 450" role="img" aria-label="Lumi the Star-Fox guides the reading quest">' +
      '<defs>' +
      '<linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="' + bg.skyTop + '"/><stop offset="1" stop-color="' + bg.skyBottom + '"/></linearGradient>' +
      '<radialGradient id="glow" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#fff7bd"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<rect width="800" height="450" fill="url(#sky)"/>' +
      '<circle cx="650" cy="78" r="56" fill="#ffe184" opacity="0.95"/>' +
      '<circle cx="148" cy="94" r="70" fill="url(#glow)" opacity="0.72"/>' +
      sceneBackdrop(tier) +
      '<path d="M0 350 C130 318 238 370 370 333 C515 292 656 322 800 286 L800 450 L0 450 Z" fill="' + bg.ground + '"/>' +
      '<path d="M126 450 C202 370 321 346 420 450 Z" fill="#dfc77a" opacity="0.95"/>' +
      focusGemSvg(currentWord) +
      lumiSvg(84, 286) +
      '</svg>';
  }

  function focusGemSvg(currentWord) {
    if (!currentWord) {
      return '<circle cx="615" cy="256" r="44" fill="#fff4a8" opacity="0.95"/>' +
        '<path d="M615 196 L629 236 L671 236 L637 260 L650 302 L615 276 L580 302 L593 260 L559 236 L601 236 Z" fill="#f6cd55" stroke="#d89a33" stroke-width="4"/>';
    }
    return '<circle cx="615" cy="256" r="44" fill="#fff4a8" opacity="0.95"/>' +
      '<path d="M615 196 L629 236 L671 236 L637 260 L650 302 L615 276 L580 302 L593 260 L559 236 L601 236 Z" fill="#f6cd55" stroke="#d89a33" stroke-width="4"/>' +
      '<circle cx="615" cy="256" r="10" fill="#ffffff" opacity="0.85"/>';
  }

  function sceneColors(tier) {
    var colors = [
      { skyTop: "#bfe7ff", skyBottom: "#e6f8d7", ground: "#86c879" },
      { skyTop: "#bdeaff", skyBottom: "#dff8ff", ground: "#f0d27c" },
      { skyTop: "#d9f0ff", skyBottom: "#e9f8d7", ground: "#75b978" },
      { skyTop: "#d5dcff", skyBottom: "#fff1c7", ground: "#97c48d" }
    ];
    return colors[tier] || colors[0];
  }

  function sceneBackdrop(tier) {
    if (tier === 1) {
      return '<path d="M0 302 C120 250 210 274 310 230 C430 178 570 226 800 170 L800 360 L0 360 Z" fill="#78c7d5" opacity="0.72"/>' +
        '<path d="M0 330 C150 302 280 330 410 292 C550 254 682 283 800 240 L800 360 L0 360 Z" fill="#4fb2c2" opacity="0.5"/>' +
        '<path d="M534 255 l42 -54 l42 54 Z" fill="#ef7f61"/><rect x="548" y="255" width="55" height="42" fill="#9d7442"/>';
    }
    if (tier === 2) {
      return '<rect x="0" y="210" width="800" height="170" fill="#74b179" opacity="0.6"/>' +
        '<g fill="#457f55"><rect x="92" y="184" width="28" height="140" rx="8"/><circle cx="106" cy="168" r="58"/><rect x="660" y="168" width="30" height="160" rx="8"/><circle cx="675" cy="145" r="70"/></g>' +
        '<path d="M498 232 C560 204 634 209 712 236 C642 225 576 227 498 232 Z" fill="#f3c95f"/>';
    }
    if (tier === 3) {
      return '<rect x="506" y="142" width="150" height="178" fill="#b7a1d9"/><rect x="534" y="104" width="42" height="76" fill="#947cc2"/><rect x="612" y="96" width="42" height="84" fill="#947cc2"/><path d="M506 142 L580 84 L656 142 Z" fill="#7d679f"/>' +
        '<rect x="552" y="226" width="58" height="94" fill="#6f537a"/><circle cx="581" cy="270" r="5" fill="#f5d36b"/>';
    }
    return '<path d="M0 318 C110 258 172 282 265 220 C343 168 418 218 495 178 C604 120 690 174 800 132 L800 360 L0 360 Z" fill="#8cbf86" opacity="0.55"/>' +
      '<g fill="#5f9b62"><rect x="562" y="182" width="26" height="136" rx="8"/><circle cx="575" cy="164" r="52"/><rect x="62" y="202" width="22" height="116" rx="8"/><circle cx="73" cy="188" r="42"/></g>';
  }

  function lumiSvg(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<ellipse cx="20" cy="44" rx="30" ry="20" fill="#f59d39"/>' +
      '<path d="M43 42 C84 18 92 67 46 68 C66 58 63 45 43 42 Z" fill="#f6c84f"/>' +
      '<circle cx="4" cy="25" r="24" fill="#f7a43f"/>' +
      '<path d="M-12 8 L-8 -22 L8 3 Z" fill="#f09334"/>' +
      '<path d="M11 8 L26 -18 L25 11 Z" fill="#f09334"/>' +
      '<path d="M-6 7 L-5 -8 L4 6 Z" fill="#ffe0a3"/>' +
      '<path d="M13 8 L22 -4 L21 12 Z" fill="#ffe0a3"/>' +
      '<circle cx="-5" cy="24" r="3.4" fill="#253346"/>' +
      '<circle cx="12" cy="24" r="3.4" fill="#253346"/>' +
      '<circle cx="-6" cy="23" r="1.1" fill="#ffffff"/>' +
      '<circle cx="11" cy="23" r="1.1" fill="#ffffff"/>' +
      '<path d="M2 31 Q4 35 9 31" fill="none" stroke="#70411f" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M-4 35 L7 35 L2 45 Z" fill="#fff4ca"/>' +
      '<path d="M20 -5 L25 6 L37 7 L28 15 L31 28 L20 21 L9 28 L12 15 L3 7 L15 6 Z" fill="#ffe475" stroke="#d19a2d" stroke-width="2"/>' +
      '</g>';
  }

  function populateSelectors() {
    var i;
    var option;
    for (i = 1; i <= TOTAL_WEEKS; i += 1) {
      option = document.createElement("option");
      option.value = String(i);
      option.innerHTML = "Week " + i;
      dom.weekSelect.appendChild(option);
    }
    for (i = 1; i <= DAYS_PER_WEEK; i += 1) {
      option = document.createElement("option");
      option.value = String(i);
      option.innerHTML = "Day " + i;
      dom.daySelect.appendChild(option);
    }
  }

  function syncSelectors() {
    var info = getWeekDay(play.sessionIndex);
    dom.weekSelect.value = String(info.week);
    dom.daySelect.value = String(info.day);
  }

  function renderParentStats() {
    var knownCount = countObjectKeys(saved.knownWords);
    var completeCount = countObjectKeys(saved.completed);
    dom.parentStats.innerHTML =
      '<strong>Progress</strong><br>' +
      'Completed quests: ' + completeCount + ' of ' + TOTAL_SESSIONS + '<br>' +
      'Words read correctly: ' + knownCount + '<br>' +
      'Vocabulary pool: ' + countVocabulary() + ' words<br>' +
      'Review days happen every 5th quest.';
  }

  function countObjectKeys(obj) {
    var count = 0;
    var key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        count += 1;
      }
    }
    return count;
  }

  function countVocabulary() {
    var seen = {};
    var count = 0;
    var t;
    var i;
    for (t = 0; t < WORD_BANKS.length; t += 1) {
      for (i = 0; i < WORD_BANKS[t].length; i += 1) {
        if (!seen[WORD_BANKS[t][i].key]) {
          seen[WORD_BANKS[t][i].key] = true;
          count += 1;
        }
      }
    }
    return count;
  }

  function toggleParentPanel(show) {
    if (show) {
      syncSelectors();
      renderParentStats();
      dom.parentPanel.hidden = false;
    } else {
      dom.parentPanel.hidden = true;
    }
  }

  function goToSelectedDay() {
    var week = parseInt(dom.weekSelect.value, 10);
    var day = parseInt(dom.daySelect.value, 10);
    play.sessionIndex = clampSession((week - 1) * DAYS_PER_WEEK + (day - 1));
    play.roundIndex = 0;
    saved.sessionIndex = play.sessionIndex;
    saveProgress();
    toggleParentPanel(false);
    render();
  }

  function resetGame() {
    var ok = window.confirm("Reset all saved progress for this device?");
    if (!ok) {
      return;
    }
    saved = { sessionIndex: 0, soundOn: true, knownWords: {}, completed: {} };
    play.sessionIndex = 0;
    play.roundIndex = 0;
    saveProgress();
    toggleParentPanel(false);
    render();
  }

  function setupEvents() {
    dom.challengeArea.addEventListener("click", function (event) {
      var target = event.target;
      play.voiceStarted = true;
      if (target && target.id === "continueQuest") {
        play.sessionIndex = saved.sessionIndex;
        play.roundIndex = 0;
        render();
        return;
      }
      if (target && target.id === "replayQuest") {
        play.roundIndex = 0;
        render();
        return;
      }
      handleOptionClick(event);
    }, false);

    dom.hearButton.addEventListener("click", speakCurrent, false);
    dom.nextButton.addEventListener("click", nextRound, false);
    dom.soundToggle.addEventListener("click", function () {
      saved.soundOn = !saved.soundOn;
      saveProgress();
      updateHeader();
      if (saved.soundOn) {
        playSuccessSound();
      }
    }, false);
    dom.parentToggle.addEventListener("click", function () {
      toggleParentPanel(true);
    }, false);
    dom.closePanel.addEventListener("click", function () {
      toggleParentPanel(false);
    }, false);
    dom.goToDay.addEventListener("click", goToSelectedDay, false);
    dom.resetGame.addEventListener("click", resetGame, false);
  }

  populateSelectors();
  setupEvents();
  render();
}());
