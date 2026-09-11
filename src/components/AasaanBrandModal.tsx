import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Heart,
  BookOpen,
  Award,
  GraduationCap,
  Scroll,
  FileQuestion,
  Layers,
  ChevronRight,
  Share2,
  Check,
  Flame,
} from "lucide-react";
import { AasaanLogo } from "./AasaanLogo.tsx";

interface AasaanBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuestionPaper?: () => void;
  onOpenRubric?: () => void;
  onOpenSyllabusPlanner?: () => void;
  onOpenVault?: () => void;
  onFocusForm?: () => void;
}

interface TamilQuote {
  authorTamil: string;
  authorEng: string;
  roleTamil: string;
  roleEng: string;
  quoteTamil: string;
  quoteEng: string;
  context: string;
}

const TAMIL_QUOTES: TamilQuote[] = [
  {
    authorTamil: "திருவள்ளுவர்",
    authorEng: "Thiruvalluvar",
    roleTamil: "தெய்வப் புலவர் • திருக்குறள்",
    roleEng: "Divine Tamil Sage • Couplet 391",
    quoteTamil: "கற்க கசடறக் கற்பவை கற்றபின்\nநிற்க அதற்குத் தக.",
    quoteEng: "Learn thoroughly and without flaw whatever is to be learned; having learned, let your conduct strictly abide by it.",
    context: "கல்வி அதிகாரம் (Chapter on Learning) — The gold standard of pedagogy and ethical education.",
  },
  {
    authorTamil: "ஔவையார்",
    authorEng: "Avvaiyar",
    roleTamil: "தமிழ்ப் பிராட்டி • கொன்றை வேந்தன்",
    roleEng: "Venerable Tamil Philosopher",
    quoteTamil: "எண்ணும் எழுத்தும் கண் எனத் தகும்.\nஓதாமல் ஒருநாளும் இருக்க வேண்டாம்.",
    quoteEng: "Numeracy and literacy are like one's two eyes. Never let a single day pass without learning.",
    context: "Foundational instruction for young minds across millennia.",
  },
  {
    authorTamil: "பெருந்தலைவர் காமராஜர்",
    authorEng: "K. Kamaraj",
    roleTamil: "கல்விக் கண் திறந்த பெருந்தலைவர்",
    roleEng: "Architect of Free Universal Schooling & Mid-Day Meals",
    quoteTamil: "பசியோடு இருக்கும் குழந்தையால் படிக்க முடியாது; பள்ளிக்கூடம் தேடி பிள்ளைகள் வர வேண்டும் என்றால் உணவு வேண்டும், கட்டணமில்லா கல்வி வேண்டும்!",
    quoteEng: "A hungry child cannot concentrate on books. If children are to reach schools, we must provide food and free education!",
    context: "Opened 12,000+ village schools and pioneered the revolutionary Mid-Day Meal Scheme in Tamil Nadu.",
  },
  {
    authorTamil: "டாக்டர் ஏ.பி.ஜே. அப்துல் கலாம்",
    authorEng: "Dr. A.P.J. Abdul Kalam",
    roleTamil: "ராமேஸ்வரத்தின் மைந்தன் • பாரத ரத்னா",
    roleEng: "11th President of India & Visionary Scientist",
    quoteTamil: "கற்பித்தல் என்பது ஒரு மிக உயர்ந்த உன்னதப் பணி. அது ஒரு மனிதனின் நற்குணத்தையும், அறிவையும், எதிர்காலத்தையும் வடிவமைக்கிறது. என்னை ஒரு நல்ல ஆசிரியராக உலகம் நினைவு கூர்ந்தால், அதுவே எனக்கு மிகப்பெரிய பெருமை!",
    quoteEng: "Teaching is a very noble profession that shapes the character, caliber, and future of an individual. If people remember me as a good teacher, that will be the biggest honor.",
    context: "Inspiring millions of students across Tamil Nadu and the globe.",
  },
  {
    authorTamil: "மகாகவி சுப்பிரமணிய பாரதியார்",
    authorEng: "Mahakavi Bharathiyar",
    roleTamil: "விடுதலைப் புலவர் • தேசிய கவி",
    roleEng: "Pioneering Nationalist Poet & Visionary",
    quoteTamil: "கல்வி சிறந்த தமிழ்நாடு — புகழ் கம்பன் பிறந்த தமிழ்நாடு!\nபயிற்றுப் பல்கல்வி தந்து — இந்தப் பாரை உயர்த்திட வேண்டும்!",
    quoteEng: "Tamil Nadu, supreme in learning, the land of Kamban! By imparting multifaceted education to all, we shall elevate this world!",
    context: "A call for modern, inclusive, universal scientific and humanistic education.",
  },
  {
    authorTamil: "டாக்டர் சர்வபள்ளி ராதாகிருஷ்ணன்",
    authorEng: "Dr. S. Radhakrishnan",
    roleTamil: "திருத்தணி மைந்தன் • ஆசிரியர் தின நாயகன்",
    roleEng: "Second President of India • Teachers' Day Inspiration",
    quoteTamil: "ஆசிரியர்களே நாட்டின் மிகச்சிறந்த மனங்களை உருவாக்குகிறார்கள். உண்மையான ஆசிரியர்கள் நமக்காக சுயமாக சிந்திக்கும் சக்தியைத் தருகிறார்கள்.",
    quoteEng: "Teachers should be the best minds in the country. A true teacher helps us think for ourselves.",
    context: "September 5th is celebrated across India as National Teachers' Day in his honor.",
  },
];

export const AasaanBrandModal: React.FC<AasaanBrandModalProps> = ({
  isOpen,
  onClose,
  onOpenQuestionPaper,
  onOpenRubric,
  onOpenSyllabusPlanner,
  onOpenVault,
  onFocusForm,
}) => {
  const [salutesCount, setSalutesCount] = useState<number>(() => {
    const saved = localStorage.getItem("aasaan_salutes");
    return saved ? parseInt(saved, 10) : 108;
  });
  const [hasSaluted, setHasSaluted] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % TAMIL_QUOTES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQuote = TAMIL_QUOTES[activeQuoteIndex];

  const handleSalute = () => {
    const next = salutesCount + 1;
    setSalutesCount(next);
    setHasSaluted(true);
    localStorage.setItem("aasaan_salutes", next.toString());
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0f1424] text-slate-100 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden my-6">
        {/* Top Gold & Velvet Accent Header Bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />

        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10">
          {/* Header Brand Hero with Tamil Crest */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-4">
              <AasaanLogo size="lg" showTagline={false} interactive={false} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                    ஆசான் (AASAAN)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ஆசிரியர் தளம்
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  தமிழ் மற்றும் இந்திய ஆசிரியர்களுக்கான உன்னத கற்பித்தல் அரங்கம்
                </p>
              </div>
            </div>

            {/* Quick Share / Link copy */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition self-end sm:self-auto"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">இணைப்பு நகலெடுக்கப்பட்டது</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>பகிர் (Share)</span>
                </>
              )}
            </button>
          </div>

          {/* Core Tamil Pedagogy Philosophy (திருக்குறள் & தமிழ் மரபு) */}
          <div className="bg-gradient-to-br from-amber-950/40 via-[#1a1429] to-[#121829] border border-amber-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
                  தமிழ் கல்வி மரபு • Classical Pedagogy
                </span>
              </div>
              <span className="text-[11px] text-amber-400/80 font-serif">
                திருக்குறள் 391 &amp; 392
              </span>
            </div>

            <div className="space-y-3">
              {/* Couplet 391 */}
              <div className="bg-black/30 p-3 rounded-lg border-l-2 border-amber-400">
                <p className="font-serif text-sm sm:text-base text-amber-200 font-semibold leading-relaxed">
                  "கற்க கசடறக் கற்பவை கற்றபின்
                  <br />
                  நிற்க அதற்குத் தக."
                </p>
                <p className="text-xs text-slate-300 mt-1.5 italic">
                  — பழுதின்றி கற்றுணர்தலும், கற்ற விழுமியங்களின்படி மாணவர்கள் தன் வாழ்க்கையை அமைத்துக் கொள்ள வழிநடத்துவதுமே ஆசானின் திருத்தொண்டாகும்.
                </p>
              </div>

              {/* Couplet 392 */}
              <div className="bg-black/30 p-3 rounded-lg border-l-2 border-yellow-500">
                <p className="font-serif text-sm sm:text-base text-amber-200 font-semibold leading-relaxed">
                  "எண்ணென்ப ஏனை எழுத்தென்ப இவ்விரண்டும்
                  <br />
                  கண்ணென்ப வாழும் உயிர்க்கு."
                </p>
                <p className="text-xs text-slate-300 mt-1.5 italic">
                  — மனித உயிர்களுக்கு கணிதமும் (எண்), மொழியறிவும் (எழுத்து) இரண்டு கண்கள் போன்றவை.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Quotes Carousel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Scroll className="w-3.5 h-3.5 text-amber-400" />
                <span>வழிகாட்டும் சான்றோர்கள் சிந்தனை ({activeQuoteIndex + 1}/{TAMIL_QUOTES.length})</span>
              </div>
              <div className="flex items-center gap-1">
                {TAMIL_QUOTES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveQuoteIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeQuoteIndex ? "w-5 bg-amber-400" : "w-1.5 bg-slate-700 hover:bg-slate-500"
                    }`}
                    aria-label={`Show quote ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="min-h-[105px] flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100 whitespace-pre-line leading-relaxed">
                  "{currentQuote.quoteTamil}"
                </p>
                <p className="text-xs text-slate-400 italic mt-1 leading-normal">
                  "{currentQuote.quoteEng}"
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-300">{currentQuote.authorTamil}</span>
                  <span className="text-slate-400 ml-1.5">({currentQuote.authorEng})</span>
                  <span className="text-slate-400 text-[11px] block">{currentQuote.roleTamil}</span>
                </div>
                <button
                  onClick={() => setActiveQuoteIndex((prev) => (prev + 1) % TAMIL_QUOTES.length)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <span>அடுத்தது</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Teacher Salute Interactive Counter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-900/30 via-slate-900 to-amber-900/30 border border-amber-500/20">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Heart className={`w-4 h-4 ${hasSaluted ? "text-rose-500 fill-rose-500 animate-ping" : "text-rose-400"}`} />
                <span className="text-xs font-bold text-slate-200">
                  ஆசிரியர்களுக்கு நமது நல்வணக்கம் (Salute Educators)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                மாணவர்களை உருவாக்கும் ஆசிரியர்களின் தன்னலமற்ற உழைப்பிற்கு மரியாதை செலுத்துவோம்.
              </p>
            </div>

            <button
              onClick={handleSalute}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-lg ${
                hasSaluted
                  ? "bg-emerald-600 text-white border border-emerald-400"
                  : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 border border-amber-300 transform active:scale-95"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{hasSaluted ? "வணக்கம் செலுத்தப்பட்டது!" : "வணக்கம் ஆசிரியரே! 🙏"}</span>
              <span className="px-1.5 py-0.5 rounded bg-black/20 text-[11px]">
                {salutesCount.toLocaleString()}
              </span>
            </button>
          </div>

          {/* Quick Academic Launchpad */}
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-2">
              ஆசான் சிறப்புக் கருவிகள் (Quick Academic Launchpad)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onFocusForm?.();
                }}
                className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                    பாடம் தயாரிப்பு
                  </div>
                  <div className="text-[10px] text-slate-400">Lesson Blueprints</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenQuestionPaper?.();
                }}
                className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <FileQuestion className="w-4 h-4 text-purple-400" />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition" />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                    வினாத்தாள்
                  </div>
                  <div className="text-[10px] text-slate-400">Question Paper Bank</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenRubric?.();
                }}
                className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                    CCE மதிப்பீடுகள்
                  </div>
                  <div className="text-[10px] text-slate-400">Assessment Rubrics</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenSyllabusPlanner?.();
                }}
                className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-left transition flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                    பாடத்திட்டம்
                  </div>
                  <div className="text-[10px] text-slate-400">30-Week Syllabus</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>ஆசான் • Aasaan Pedagogy Suite</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition text-xs"
          >
            தொடங்குக (Continue)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AasaanBrandModal;
