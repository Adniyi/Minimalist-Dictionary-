import { WordEntry } from '../types';

export const OFFLINE_LEXICON: Record<string, WordEntry> = {
  serendipity: {
    word: 'serendipity',
    phonetic: '/ˌsɛr.ənˈdɪp.ɪ.ti/',
    phonetics: [
      { text: '/ˌsɛr.ənˈdɪp.ɪ.ti/', accent: 'US' },
      { text: '/ˌsɛr.ənˈdɪp.ɪ.ti/', accent: 'UK' },
    ],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
            example: 'A fortunate stroke of serendipity brought the two collaborators together at the conference.',
            synonyms: ['chance', 'fluke', 'good fortune', 'providence', 'blessing'],
            antonyms: ['misfortune', 'bad luck'],
          },
          {
            definition: 'The faculty of making desirable discoveries by accident.',
            example: 'Scientific discovery often hinges on genuine serendipity accompanied by sharp observation.',
            synonyms: ['happy accident', 'luck'],
            antonyms: [],
          },
        ],
        synonyms: ['happy accident', 'fluke', 'providence', 'windfall'],
        antonyms: ['calamity', 'misfortune'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/serendipity'],
    provider: 'offline_lexicon',
    providerNote: 'Pre-indexed in offline lexicon for instant zero-network lookup.',
  },
  ephemeral: {
    word: 'ephemeral',
    phonetic: '/ɪˈfɛm.ər.əl/',
    phonetics: [
      { text: '/ɪˈfɛm.ər.əl/', accent: 'General' },
    ],
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Lasting for a very short time; transitory; fleeting.',
            example: 'The ephemeral bloom of cherry blossoms draws millions of admirers each spring.',
            synonyms: ['transient', 'fleeting', 'short-lived', 'evanescent', 'fugitive'],
            antonyms: ['permanent', 'enduring', 'eternal', 'perpetual'],
          },
          {
            definition: 'Living or lasting only for a day, as certain insects or plants.',
            example: 'Ephemera insects spend months underwater only to enjoy an ephemeral adult life of 24 hours.',
            synonyms: ['short-lived'],
            antonyms: ['perennial'],
          },
        ],
        synonyms: ['fleeting', 'transitory', 'momentary'],
        antonyms: ['permanent', 'everlasting'],
      },
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'Something that is transitory or lasts for only a brief period, such as print collectibles.',
            example: 'The library preserves rare 19th-century ephemera including theatre playbills and tickets.',
            synonyms: ['collectibles', 'memorabilia'],
            antonyms: [],
          },
        ],
        synonyms: [],
        antonyms: [],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/ephemeral'],
    provider: 'offline_lexicon',
  },
  resilient: {
    word: 'resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    phonetics: [
      { text: '/rɪˈzɪl.jənt/', accent: 'General' },
    ],
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Able to withstand or recover quickly from difficult conditions, adversity, or shocks.',
            example: 'Local communities demonstrated remarkably resilient spirits in rebuilding after the storm.',
            synonyms: ['tough', 'hardy', 'adaptable', 'buoyant', 'strong'],
            antonyms: ['fragile', 'vulnerable', 'brittle'],
          },
          {
            definition: 'Able to recoil or spring back into shape after bending, stretching, or being compressed.',
            example: 'The mattress is manufactured with highly resilient natural latex foam.',
            synonyms: ['elastic', 'flexible', 'pliable'],
            antonyms: ['rigid', 'stiff'],
          },
        ],
        synonyms: ['tough', 'tenacious', 'flexible'],
        antonyms: ['fragile', 'delicate'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/resilient'],
    provider: 'offline_lexicon',
  },
  petrichor: {
    word: 'petrichor',
    phonetic: '/ˈpɛt.rɪ.kɔːr/',
    phonetics: [
      { text: '/ˈpɛt.rɪ.kɔːr/', accent: 'US' },
    ],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A pleasant, distinctive earthy smell that frequently accompanies the first rain after a long period of warm, dry weather.',
            example: 'As the storm clouds broke overhead, the calming scent of petrichor filled the summer air.',
            synonyms: ['earthy scent', 'rain scent'],
            antonyms: [],
          },
        ],
        synonyms: ['rain scent'],
        antonyms: [],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/petrichor'],
    provider: 'offline_lexicon',
  },
  ubiquitous: {
    word: 'ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    phonetics: [
      { text: '/juːˈbɪk.wɪ.təs/', accent: 'General' },
    ],
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Present, appearing, or found everywhere simultaneously; omnipresent.',
            example: 'Smartphones and mobile internet connectivity have become ubiquitous across modern urban society.',
            synonyms: ['omnipresent', 'pervasive', 'universal', 'worldwide'],
            antonyms: ['rare', 'scarce', 'seldom'],
          },
        ],
        synonyms: ['pervasive', 'omnipresent'],
        antonyms: ['rare'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/ubiquitous'],
    provider: 'offline_lexicon',
  },
  solitude: {
    word: 'solitude',
    phonetic: '/ˈsɒl.ɪ.tjuːd/',
    phonetics: [
      { text: '/ˈsɒl.ɪ.tjuːd/', accent: 'UK' },
      { text: '/ˈsɑː.lə.tuːd/', accent: 'US' },
    ],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The state or situation of being alone, especially by choice and leading to peaceful reflection.',
            example: 'She savored the peaceful solitude of her morning walks through the quiet mountain pine forest.',
            synonyms: ['seclusion', 'privacy', 'peace', 'isolation', 'retreat'],
            antonyms: ['company', 'crowd', 'companionship'],
          },
          {
            definition: 'A lonely, uninhabited, or secluded place.',
            example: 'He built a small wooden cabin in the tranquil solitudes of the northern wilderness.',
            synonyms: ['wilderness', 'retreat'],
            antonyms: ['metropolis'],
          },
        ],
        synonyms: ['seclusion', 'peacefulness', 'aloneness'],
        antonyms: ['loneliness', 'crowding'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/solitude'],
    provider: 'offline_lexicon',
  },
  minimalist: {
    word: 'minimalist',
    phonetic: '/ˈmɪn.ɪ.məl.ɪst/',
    phonetics: [
      { text: '/ˈmɪn.ɪ.məl.ɪst/', accent: 'General' },
    ],
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Relating to a style or technique characterized by extreme spareness and simplicity.',
            example: 'The architect created a minimalist interior with clean lines, neutral tones, and abundant light.',
            synonyms: ['uncluttered', 'spare', 'simple', 'austere', 'understated'],
            antonyms: ['ornate', 'extravagant', 'cluttered'],
          },
          {
            definition: 'Advocating moderate or minimal action or policy.',
            example: 'A minimalist regulatory approach was favored to spur rapid technological innovation.',
            synonyms: ['restrained'],
            antonyms: ['interventionist'],
          },
        ],
        synonyms: ['simple', 'clean', 'spare'],
        antonyms: ['ornate', 'baroque'],
      },
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A person who advocates or practices minimalism in art, design, or lifestyle.',
            example: 'As a devoted minimalist, he owned fewer than one hundred carefully chosen personal possessions.',
            synonyms: ['ascetic', 'purist'],
            antonyms: ['collector', 'maximalist'],
          },
        ],
        synonyms: [],
        antonyms: ['maximalist'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/minimalist'],
    provider: 'offline_lexicon',
  },
  dictionary: {
    word: 'dictionary',
    phonetic: '/ˈdɪk.ʃən.ər.i/',
    phonetics: [
      { text: '/ˈdɪk.ʃən.ər.i/', accent: 'UK' },
      { text: '/ˈdɪk.ʃə.nɛr.i/', accent: 'US' },
    ],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'A reference book or electronic resource that lists the words of a language and gives their meaning, grammar, or translation.',
            example: 'Whenever you encounter an unfamiliar term in historical literature, check the dictionary.',
            synonyms: ['lexicon', 'vocabulary', 'glossary', 'wordbook'],
            antonyms: [],
          },
          {
            definition: 'Computing: An associative array or map data structure consisting of key-value pairs.',
            example: 'Python dictionaries allow constant-time O(1) lookup of definitions and cached terms.',
            synonyms: ['hash map', 'associative array', 'key-value store'],
            antonyms: [],
          },
        ],
        synonyms: ['lexicon', 'glossary', 'thesaurus'],
        antonyms: [],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/dictionary'],
    provider: 'offline_lexicon',
  },
  eloquent: {
    word: 'eloquent',
    phonetic: '/ˈɛl.ə.kwənt/',
    phonetics: [
      { text: '/ˈɛl.ə.kwənt/', accent: 'General' },
    ],
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Fluent or persuasive in speaking or writing; vividly expressive.',
            example: 'The keynote speaker delivered an eloquent address that moved the audience to a standing ovation.',
            synonyms: ['articulate', 'fluent', 'silver-tongued', 'expressive', 'poignant'],
            antonyms: ['inarticulate', 'tongue-tied', 'unconvincing'],
          },
          {
            definition: 'Clearly expressing or indicating something without words.',
            example: 'A prolonged pause and an eloquent shrug conveyed his disagreement more vividly than words.',
            synonyms: ['expressive', 'meaningful', 'suggestive'],
            antonyms: [],
          },
        ],
        synonyms: ['articulate', 'poetic', 'rhetorical'],
        antonyms: ['inarticulate'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/eloquent'],
    provider: 'offline_lexicon',
  },
  empathy: {
    word: 'empathy',
    phonetic: '/ˈɛm.pə.θi/',
    phonetics: [
      { text: '/ˈɛm.pə.θi/', accent: 'General' },
    ],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The ability to understand and share the feelings, thoughts, or experiences of another person.',
            example: 'Great leadership and constructive conflict resolution require genuine empathy and active listening.',
            synonyms: ['compassion', 'understanding', 'sensitivity', 'fellow feeling', 'affinity'],
            antonyms: ['apathy', 'callousness', 'indifference'],
          },
        ],
        synonyms: ['compassion', 'attunement', 'warmth'],
        antonyms: ['cruelty', 'indifference'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/empathy'],
    provider: 'offline_lexicon',
  },
  integrity: {
    word: 'integrity',
    phonetic: '/ɪnˈtɛɡ.rɪ.ti/',
    phonetics: [
      { text: '/ɪnˈtɛɡ.rɪ.ti/', accent: 'General' },
    ],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The quality of being honest and having strong moral principles that you refuse to change.',
            example: 'He is widely respected across all political parties as a leader of unimpeachable integrity.',
            synonyms: ['honesty', 'probity', 'uprightness', 'honor', 'rectitude'],
            antonyms: ['dishonesty', 'corruption', 'deceit'],
          },
          {
            definition: 'The state of being whole, undivided, or structurally sound.',
            example: 'Engineers thoroughly inspected the structural integrity of the suspension bridge after the tremors.',
            synonyms: ['soundness', 'robustness', 'wholeness', 'unity'],
            antonyms: ['fragility', 'division', 'deterioration'],
          },
        ],
        synonyms: ['moral fiber', 'righteousness', 'wholeness'],
        antonyms: ['corruption', 'duplicity'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/integrity'],
    provider: 'offline_lexicon',
  },
  hello: {
    word: 'hello',
    phonetic: '/həˈloʊ/',
    phonetics: [
      { text: '/həˈloʊ/', accent: 'US' },
      { text: '/hɛˈləʊ/', accent: 'UK' },
    ],
    meanings: [
      {
        partOfSpeech: 'interjection',
        definitions: [
          {
            definition: 'Used as a greeting or to begin a conversation.',
            example: 'Hello! It is wonderful to meet you today.',
            synonyms: ['hi', 'greetings', 'welcome', 'hey'],
            antonyms: ['goodbye', 'farewell'],
          },
          {
            definition: 'An expression of surprise or an exclamation to attract attention.',
            example: 'Hello! What do we have here?',
            synonyms: ['hark', 'look'],
            antonyms: [],
          },
        ],
        synonyms: ['salutations', 'hi', 'howdy'],
        antonyms: ['bye', 'farewell'],
      },
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'An utterance of "hello"; a greeting.',
            example: 'She gave me a warm and cheerful hello across the lobby.',
            synonyms: ['greeting', 'welcome'],
            antonyms: ['farewell'],
          },
        ],
        synonyms: [],
        antonyms: [],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/hello'],
    provider: 'offline_lexicon',
  },
  zenith: {
    word: 'zenith',
    phonetic: '/ˈzɛn.ɪθ/',
    phonetics: [
      { text: '/ˈzɛn.ɪθ/', accent: 'UK' },
      { text: '/ˈziː.nɪθ/', accent: 'US' },
    ],
    meanings: [
      {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'The time at which something is most powerful or successful; pinnacle.',
            example: 'The Roman Empire was arguably at the zenith of its territorial expansion during Trajan’s reign.',
            synonyms: ['pinnacle', 'apex', 'culmination', 'acme', 'climax', 'peak'],
            antonyms: ['nadir', 'bottom', 'trough'],
          },
          {
            definition: 'Astronomy: The point in the sky or celestial sphere directly above an observer.',
            example: 'At high noon in the tropics, the sun reaches directly into the zenith.',
            synonyms: ['apex'],
            antonyms: ['nadir'],
          },
        ],
        synonyms: ['peak', 'summit', 'high point'],
        antonyms: ['nadir'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/zenith'],
    provider: 'offline_lexicon',
  },
  luminous: {
    word: 'luminous',
    phonetic: '/ˈluː.mɪ.nəs/',
    phonetics: [
      { text: '/ˈluː.mɪ.nəs/', accent: 'General' },
    ],
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Full of or shedding light; bright or shining, especially in the dark.',
            example: 'The dial of the vintage diving watch had luminous hands that glowed soft emerald green underwater.',
            synonyms: ['radiant', 'gleaming', 'shining', 'brilliant', 'incandescent'],
            antonyms: ['dark', 'dim', 'gloomy', 'opaque'],
          },
          {
            definition: 'Very clear, lucid, and easy to understand.',
            example: 'Her luminous exposition of quantum electrodynamics illuminated an otherwise daunting subject.',
            synonyms: ['lucid', 'clear', 'enlightening'],
            antonyms: ['obscure', 'convoluted'],
          },
        ],
        synonyms: ['radiant', 'glowing', 'effulgent'],
        antonyms: ['murky', 'somber'],
      },
    ],
    sourceUrls: ['https://en.wiktionary.org/wiki/luminous'],
    provider: 'offline_lexicon',
  }
};

export const POPULAR_WORDS = [
  'serendipity',
  'ephemeral',
  'petrichor',
  'resilient',
  'ubiquitous',
  'solitude',
  'minimalist',
  'dictionary',
  'eloquent',
  'empathy',
  'integrity',
  'zenith',
  'luminous',
  'hello'
];
