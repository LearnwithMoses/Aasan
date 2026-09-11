export interface TextbookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  nativeTitle?: string;
  unitOrTerm: string;
  curriculum: "Tamil Nadu State Board" | "CBSE / NCERT" | "ICSE" | string;
  grade: string;
  subject: string;
  keySubtopics: string[];
  learningOutcomes: string[];
  suggestedObjectives: string;
  pdfSourceUrl: string;
  pdfSourceTitle: string;
  pageRange?: string;
}

export const TEXTBOOK_CHAPTERS: TextbookChapter[] = [
  // ==========================================
  // TAMIL NADU STATE BOARD (SAMACHEER KALVI) - CLASS 10 TAMIL
  // ==========================================
  {
    id: "tn-10-tam-1",
    chapterNumber: 1,
    title: "இயல் 1: அன்னை மொழியே (தமிழ் சொல்வளம் & இலக்கணம்)",
    nativeTitle: "இயல் 1: மொழி - அன்னை மொழியே, தமிழ் சொல்வளம், இரட்டுற மொழிதல்",
    unitOrTerm: "இயல் 1 (பருவம் 1)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Tamil",
    keySubtopics: [
      "அன்னை மொழியே - பாவலரேறு பெருஞ்சித்திரனார்",
      "தமிழ் சொல்வளம் - தேவநேயப் பாவாணர்",
      "இரட்டுற மொழிதல் (சிலேடை) - சந்தக்கவிமணி தமிழழகனார்",
      "இலக்கணம்: எழுத்து, சொல் (சார்பெழுத்து, தொழிற்பெயர், வினையாலணையும் பெயர்)",
    ],
    learningOutcomes: [
      "தமிழ்த்தாயின் தொன்மையையும் மாண்பையும் உணர்ந்து போற்றுதல்",
      "தமிழ் மொழியின் தாவர உறுப்புப் பெயர் வளங்களை அறிதல்",
      "எழுத்து மற்றும் சொல் இலக்கண வகைகளைத் தெளிவாக இனம் காணுதல்",
    ],
    suggestedObjectives:
      "மாணவர்கள் அன்னை மொழியே பாடலின் நயங்களை உணர்ந்து ஒப்புவிக்கவும்; தேவநேயப் பாவாணரின் தமிழ் சொல்வளச் சான்றுகளைத் தொகுத்துரைக்கவும்; எழுத்து மற்றும் சொல் இலக்கண வேறுபாடுகளைத் துல்லியமாக விவரிக்கவும் செய்தல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 1 - 22",
  },
  {
    id: "tn-10-tam-2",
    chapterNumber: 2,
    title: "இயல் 2: காற்றே வா (இயற்கை - சூழியல் & தொகைநிலைத் தொடர்கள்)",
    nativeTitle: "இயல் 2: இயற்கை, சூழியல் - காற்றே வா, கேட்கிறதா என் குரல், முல்லைப்பாட்டு",
    unitOrTerm: "இயல் 2 (பருவம் 1)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Tamil",
    keySubtopics: [
      "காற்றே வா - மகாகவி பாரதியார்",
      "கேட்கிறதா என் குரல்! - காற்று தன் வரலாற்றைக் கூறுதல்",
      "முல்லைப்பாட்டு - நப்பூதனார் (பத்துப்பாட்டு)",
      "புயலிலே ஒரு தோணி - ப. சிங்காரம்",
      "இலக்கணம்: தொகைநிலைத் தொடர்கள் (வேற்றுமை, வினை, பண்பு, உவமை, உம்மை, அன்மொழித்தொகை)",
    ],
    learningOutcomes: [
      "இயற்கை மற்றும் காற்றின் இன்றியமையாமையை உணர்ந்து சுற்றுச்சூழல் விழிப்புணர்வு பெறுதல்",
      "முல்லை நிலத்தின் இயற்கை காட்சிகளையும் விருந்தோம்பல் மரபையும் அறிதல்",
      "ஆறு வகை தொகைநிலைத் தொடர்களைத் தொடர்களில் இனம் கண்டு எழுதுதல்",
    ],
    suggestedObjectives:
      "மாணவர்கள் பாரதியாரின் காற்றே வா கவிதையின் நயத்தை விளக்குதல்; காற்று மாசடைவதைத் தடுக்கும் வழிகளைப் பட்டியலிடுதல்; தொகைநிலைத் தொடர்களின் ஆறு வகைகளையும் சான்றுகளுடன் பகுத்தாய்தல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 23 - 48",
  },
  {
    id: "tn-10-tam-3",
    chapterNumber: 3,
    title: "இயல் 3: விருந்து போற்றுதும் (பண்பாடு - காசி காண்டம் & தொகாநிலைத் தொடர்)",
    nativeTitle: "இயல் 3: பண்பாடு - விருந்து போற்றுதும், காசி காண்டம், மலைபடுகடாம்",
    unitOrTerm: "இயல் 3 (பருவம் 1)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Tamil",
    keySubtopics: [
      "விருந்து போற்றுதும்! - தமிழரின் விருந்தோம்பல் மரபு",
      "காசி காண்டம் - அதிவீரராம பாண்டியர்",
      "மலைபடுகடாம் (கூத்தராற்றுப்படை) - பெருங்கௌசிகனார்",
      "கோபல்லபுரத்து மக்கள் - கி. ராஜநாராயணன்",
      "இலக்கணம்: தொகாநிலைத் தொடர்கள் (ஒன்பது வகைகள்)",
      "வாழ்வியல்: திருக்குறள் (ஒழுக்கமுடைமை, மெய்யுணர்தல், பெரியாரைத் துணைக் கோடல்)",
    ],
    learningOutcomes: [
      "தமிழர்களின் இல்லற விருந்தோம்பல் பண்பாட்டின் பெருமையை மதித்தல்",
      "சங்க இலக்கிய நயங்களையும் கூத்தராற்றுப்படை வர்ணனைகளையும் சுவைத்தல்",
      "தொகாநிலைத் தொடரின் ஒன்பது வகைகளையும் தொடரமைப்பில் பிழையின்றி கையாளுதல்",
    ],
    suggestedObjectives:
      "தமிழரின் விருந்தோம்பல் நெறிமுறைகளை சங்க இலக்கியச் சான்றுகளுடன் விளக்குதல்; தொகாநிலைத் தொடரின் ஒன்பது வகைகளையும் கண்டறிந்து தொடர்களை உருவாக்குதல்; திருக்குறள் வாழ்வியல் நெறிகளை நடைமுறைப்படுத்துதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 49 - 74",
  },
  {
    id: "tn-10-tam-4",
    chapterNumber: 4,
    title: "இயல் 4: செயற்கை நுண்ணறிவு & நான்காம் தமிழ் (அறிவியல், தொழில்நுட்பம்)",
    nativeTitle: "இயல் 4: அறிவியல், தொழில்நுட்பம் - செயற்கை நுண்ணறிவு, பெருமாள் திருமொழி, பரிபாடல்",
    unitOrTerm: "இயல் 4 (பருவம் 2)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Tamil",
    keySubtopics: [
      "செயற்கை நுண்ணறிவு (AI) - நான்காம் தமிழின் புது வரவு",
      "பெருமாள் திருமொழி - குலசேகர ஆழ்வார்",
      "பரிபாடல் (விண்வெளித் தோற்றம்) - கீரந்தையார்",
      "விண்ணைத் தாண்டிய தன்னம்பிக்கை - ஸ்டீபன் ஹாக்கிங் வாழ்க்கை வரலாறு",
      "இலக்கணம்: பொது இலக்கணம் (திணை, பால், இடம், வழு, வழாநிலை, வழுவமைதி)",
    ],
    learningOutcomes: [
      "நவீன அறிவியல் மற்றும் செயற்கை நுண்ணறிவின் வளர்ச்சியில் தமிழ் பயன்பாட்டை அறிதல்",
      "பண்டையத் தமிழரின் வானியல் மற்றும் அண்டவியல் ஞானத்தைப் பரிபாடல் வழி உணர்தல்",
      "வழு, வழாநிலை மற்றும் ஐந்து வகை வழுவமைதிகளைத் தெளிவாக இனம் காணுதல்",
    ],
    suggestedObjectives:
      "செயற்கை நுண்ணறிவின் அன்றாடப் பயன்பாடுகளையும் எதிர்காலப் போக்குகளையும் விவரித்தல்; பரிபாடலில் கூறப்படும் பெருவெடிப்புக் கொள்கையை ஒப்புநோக்குதல்; வழுவமைதித் தொடர்களை அமைத்து உரையாடுதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 75 - 100",
  },
  {
    id: "tn-10-tam-5",
    chapterNumber: 5,
    title: "இயல் 5: மணற்கேணி (மொழிபெயர்ப்புக் கல்வி, நீதி வெண்பா & திருவிளையாடற் புராணம்)",
    nativeTitle: "இயல் 5: கல்வி - மொழிபெயர்ப்புக் கல்வி, நீதி வெண்பா, திருவிளையாடற் புராணம்",
    unitOrTerm: "இயல் 5 (பருவம் 2)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Tamil",
    keySubtopics: [
      "மொழிபெயர்ப்புக் கல்வி - பிறமொழி அறிவு மற்றும் கலைப்பரிமாற்றம்",
      "நீதி வெண்பா - கா.ப. செய்குதம்பிப் பாவலர் (சதாவதானி)",
      "திருவிளையாடற் புராணம் (இடைக்காடன் பிணக்குத் தீர்த்த படலம்) - பரஞ்சோதி முனிவர்",
      "புதிய நம்பிக்கை - மேரி மெக்லியோட் பெத்யூன் வாழ்க்கை வரலாறு",
      "இலக்கணம்: வினா வகை (6), விடை வகை (8), பொருள்கோள் (8 வகைகள்)",
    ],
    learningOutcomes: [
      "மொழிபெயர்ப்பின் முக்கியத்துவத்தை உணர்ந்து மொழியாக்கத் திறன் பெறுதல்",
      "சதாவதானக் கலையின் சிறப்பையும் நீதி வெண்பாவின் அறக்கருத்துகளையும் அறிதல்",
      "அறுவகை வினாக்களையும் எண்வகை விடைகளையும் எட்டு வகை பொருள்கோள்களையும் பகுத்தாய்தல்",
    ],
    suggestedObjectives:
      "மொழிபெயர்ப்பின் இன்றியமையாமையை கட்டுரையாக வடிவமைத்தல்; வினா மற்றும் விடை வகைகளை அன்றாட உரையாடல்களில் கண்டறிதல்; ஆற்றுநீர்ப் பொருள்கோள் முதல் அடிமறி மாற்றுப் பொருள்கோள் வரையிலான எட்டு வகைகளை விளக்குதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 101 - 128",
  },
  {
    id: "tn-10-tam-6",
    chapterNumber: 6,
    title: "இயல் 6: நிகழ்கலை & சிலப்பதிகாரம் (கலை, அழகியல், புதுமைகள்)",
    nativeTitle: "இயல் 6: கலை - நிகழ்கலை, பூத்தொடுத்தல், முத்துக்குமாரசுவாமி பிள்ளைத்தமிழ், சிலப்பதிகாரம்",
    unitOrTerm: "இயல் 6 (பருவம் 2)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Tamil",
    keySubtopics: [
      "நிகழ்கலை (நாட்டுப்புறக் கலைகள் - கரகாட்டம், காவடியாட்டம், மயிலாட்டம், தோற்பாவைக்கூத்து)",
      "பூத்தொடுத்தல் - உமா மகேஸ்வரி",
      "முத்துக்குமாரசுவாமி பிள்ளைத்தமிழ் (செங்கீரைப் பருவம்) - குமரகுருபரர்",
      "சிலப்பதிகாரம் (மருவூர்ப்பாக்க வணிக வீதி) - இளங்கோவடிகள்",
      "இலக்கணம்: அகப்பொருள் இலக்கணம் (முதல் பொருள், கருப்பொருள், உரிப்பொருள்)",
    ],
    learningOutcomes: [
      "தமிழக நாட்டுப்புற நிகழ்கலைகளின் பாரம்பரியச் சிறப்புகளை உணர்தல்",
      "பூம்புகார் மருவூர்ப்பாக்க நகர அமைப்பையும் வணிகச் செழிப்பையும் சுவைத்தல்",
      "ஐந்திணைக்குரிய முதல், கரு, உரிப்பொருள்களைத் துல்லியமாக அட்டவணைப்படுத்துதல்",
    ],
    suggestedObjectives:
      "நாட்டுப்புறக் கலைகளை ஆவணப்படுத்தும் திறனை வளர்த்தல்; பிள்ளைத்தமிழின் பருவங்களை வகைப்படுத்துதல்; அகப்பொருள் இலக்கணக் கோட்பாடுகளைப் பிழையின்றி பயன்படுத்துதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 129 - 158",
  },
  {
    id: "tn-10-tam-7",
    chapterNumber: 7,
    title: "இயல் 7: சிற்றகல் ஒளி & மெய்க்கீர்த்தி (நாகரிகம், தொழில், வணிகம்)",
    nativeTitle: "இயல் 7: நாகரிகம் - சிற்றகல் ஒளி (ம.பொ.சி), ஏர் புதிதா?, மெய்க்கீர்த்தி, சிலப்பதிகாரம்",
    unitOrTerm: "இயல் 7 (பருவம் 3)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Tamil",
    keySubtopics: [
      "சிற்றகல் ஒளி - சிலம்புச் செல்வர் ம.பொ. சிவஞானம் தன்வரலாறு",
      "ஏர் புதிதா? (வேளாண் மேன்மை) - கு.ப. ராஜகோபாலன்",
      "மெய்க்கீர்த்தி - இரண்டாம் இராசராச சோழன்",
      "மங்கையராய்ப் பிறப்பதற்கே (எம்.எஸ். சுப்புலட்சுமி, பாலசரஸ்வதி, கிருஷ்ணம்மாள் ஜெகந்நாதன்)",
      "இலக்கணம்: புறப்பொருள் இலக்கணம் (வெட்சி முதல் பெருந்திணை வரை 12 திணைகள்)",
    ],
    learningOutcomes: [
      "தமிழக எல்லைப் போராட்ட வரலாற்றையும் ம.பொ.சியின் தியாகத்தையும் உணர்தல்",
      "சோழர் கால வரலாற்று ஆவணமாகத் திகழும் மெய்க்கீர்த்திகளைப் புரிந்துகொள்ளுதல்",
      "புறப்பொருள் வெண்பாமாலையின் 12 திணைகளையும் அடையாளங்காணுதல்",
    ],
    suggestedObjectives:
      "மாணவர்கள் எல்லைப் போராட்ட முக்கியத்துவத்தை விவாதித்தல்; சோழர் மெய்க்கீர்த்தியின் இலக்கிய அமைப்பை விளக்குதல்; புறத்திணைகளின் பன்னிரு நிலைகளையும் போர்க்காலப் பண்புகளையும் விவரித்தல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 159 - 188",
  },
  {
    id: "tn-10-tam-8",
    chapterNumber: 8,
    title: "இயல் 8: ஞானம் & காலக்கணிதம் (அறம், தத்துவம், சிந்தனை)",
    nativeTitle: "இயல் 8: அறம், தத்துவம் - ஞானம், காலக்கணிதம் (கண்ணதாசன்), இராமானுசர் நாடகம்",
    unitOrTerm: "இயல் 8 (பருவம் 3)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Tamil",
    keySubtopics: [
      "ஞானம் - தீசோ வேணுகோபாலன்",
      "காலக்கணிதம் - கவியரசு கண்ணதாசன்",
      "இராமானுசர் (நாடகம்) - சமத்துவப் புரட்சியாளர்",
      "இலக்கணம்: பா-வகை, அலகிடுதல் (வெண்பா, ஆசிரியப்பா, வாய்ப்பாடு)",
      "வாழ்வியல்: திருக்குறள் (அமைச்சு, பொருள்செயல்வகை, கூடாநட்பு, பேதைமை)",
    ],
    learningOutcomes: [
      "கண்ணதாசனின் கவிதை ஆளுமையையும் காலக்கணிதத்தின் கம்பீரத்தையும் உணர்தல்",
      "இராமானுசரின் மனிதநேயச் சமத்துவப் புரட்சியைப் போற்றுதல்",
      "வெண்பா, ஆசிரியப்பாவின் இலக்கணங்களை அறிந்து சீர் பிரித்து அலகிடுதல்",
    ],
    suggestedObjectives:
      "காலக்கணிதம் கவிதையின் முக்கிய வரிகளை விளக்குதல்; செய்யுள் அடிகளைச் சீர் பிரித்து நேரசை, நிரையசை வாய்ப்பாடு காணுதல்; திருக்குறள் அறக்கருத்துகளை வாழ்க்கைச் சூழல்களோடு பொருத்துதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 189 - 216",
  },
  {
    id: "tn-10-tam-9",
    chapterNumber: 9,
    title: "இயல் 9: சித்தாளு & தேம்பாவணி (மனிதநேயம் & அணி இலக்கணம்)",
    nativeTitle: "இயல் 9: மனிதநேயம் - சித்தாளு, தேம்பாவணி, ஒருவன் இருக்கிறான், அணி இலக்கணம்",
    unitOrTerm: "இயல் 9 (பருவம் 3)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Tamil",
    keySubtopics: [
      "சித்தாளு - நாகூர் ரூமி (எளிய மனிதர்களின் உழைப்பு)",
      "தேம்பாவணி (மகனுக்குத் தாய் உரைத்த அறிவுரை) - வீரமாமுனிவர்",
      "ஒருவன் இருக்கிறான் - கு. அழகிரிசாமி",
      "அணி இலக்கணம்: உவமையணி, உருவக அணி, வேற்றுமை அணி, தற்குறிப்பேற்ற அணி, பின்வருநிலையணி",
    ],
    learningOutcomes: [
      "கட்டடத் தொழிலாளர்களின் உழைப்பை மதிக்கும் மனிதநேயப் பார்வை பெறுதல்",
      "வீரமாமுனிவரின் தமிழ் இலக்கியப் பங்களிப்பையும் தேம்பாவணி காப்பிய நயத்தையும் சுவைத்தல்",
      "அணிகளின் இலக்கண விதிகளையும் செய்யுளில் அமைந்துள்ள அணிகளையும் பிரித்தறிதல்",
    ],
    suggestedObjectives:
      "உழைப்பாளர்களின் மேன்மையை உணர்த்தும் கவிதை படைத்தல்; தேம்பாவணி காப்பியச் சுவையை விவரித்தல்; தற்குறிப்பேற்ற அணி, வேற்றுமை அணிகளைச் சான்றுகளுடன் விளக்குதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 217 - 245",
  },

  // ==========================================
  // TAMIL NADU SAMACHEER KALVI - CLASS 10 SCIENCE
  // ==========================================
  {
    id: "tn-10-sci-1",
    chapterNumber: 1,
    title: "Unit 1: இயக்க விதிகள் (Laws of Motion)",
    nativeTitle: "அலகு 1: இயக்க விதிகள் (Laws of Motion - Newton's Laws)",
    unitOrTerm: "இயற்பியல் (Physics)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "நிலைமம் மற்றும் அதன் வகைகள் (Inertia of rest, motion, direction)",
      "நியூட்டனின் முதல் இயக்க விதி மற்றும் விசை",
      "நியூட்டனின் இரண்டாம் விதி (விசையின் சமன்பாடு F = ma)",
      "உந்தம் மற்றும் நேர்க்கோட்டு உந்த மாறாக் கோட்பாடு",
      "நியூட்டனின் மூன்றாம் விதி மற்றும் ராக்கெட் ஏவுதல் கோட்பாடு",
      "ஈர்ப்பியல் மாறிலி மற்றும் ஈர்ப்பு முடுக்கம் (g vs G)",
    ],
    learningOutcomes: [
      "நியூட்டனின் மூன்று இயக்க விதிகளையும் நடைமுறைச் சூழல்களோடு ஒப்பிடுதல்",
      "நேர்க்கோட்டு உந்த மாறாக் கோட்பாட்டின் அடிப்படையில் கணக்குகளைத் தீர்த்தல்",
      "ராக்கெட் ஏவுதலில் உந்த மாறாக் கொள்கையின் பயன்பாட்டை விளக்குதல்",
    ],
    suggestedObjectives:
      "மாணவர்கள் நியூட்டனின் இயக்க விதிகளைத் துல்லியமாக வரையறுக்கவும்; விசை மற்றும் உந்தக் கணக்கீடுகளைத் தீர்க்கவும்; ராக்கெட் செலுத்தப்படும் அறிவியல் தத்துவத்தை விளக்கவும் பயிற்சி அளித்தல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 1 - 15",
  },
  {
    id: "tn-10-sci-2",
    chapterNumber: 2,
    title: "Unit 2: ஒளியியல் (Optics)",
    nativeTitle: "அலகு 2: ஒளியியல் (Optics - Refraction, Lenses & Vision Defects)",
    unitOrTerm: "இயற்பியல் (Physics)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "ஒளியின் ஒளிவிலகல் மற்றும் ஸ்நெல் விதி (Snell's Law)",
      "லென்சுகளின் வகைகள் மற்றும் கதிர் வரைபடங்கள் (Ray diagrams)",
      "லென்சு சமன்பாடு மற்றும் குறியீட்டு மரபுகள் (1/v - 1/u = 1/f)",
      "மனிதக் கண் கட்டமைப்பு மற்றும் பார்வை குறைபாடுகள் (கிட்டப்பார்வை, தூரப்பார்வை)",
      "நுண்ணோக்கிகள் மற்றும் தொலைநோக்கிகள்",
    ],
    learningOutcomes: [
      "குவி லென்சு மற்றும் குழி லென்சுகளின் கதிர் வரைபடங்களை துல்லியமாக வரைதல்",
      "லென்சு சூத்திரத்தைப் பயன்படுத்தி பிம்பத்தின் தூரம் மற்றும் உருப்பெருக்கம் கணக்கிடுதல்",
      "மயோபியா மற்றும் ஹைப்பர்மெட்ரோபியா குறைபாடுகளை நீக்கும் லென்சுகளைக் குறிப்பிடுதல்",
    ],
    suggestedObjectives:
      "ஒளிவிலகல் விதிகளைச் சோதனைகள் மூலம் நிரூபித்தல்; லென்சு வரைபடங்களை அளவுடன் வரைதல்; கண் குறைபாடுகளுக்கான திருத்தங்களை விளக்கப்படங்கள் மூலம் விளக்குதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 16 - 32",
  },
  {
    id: "tn-10-sci-4",
    chapterNumber: 4,
    title: "Unit 4: மின்னோட்டவியல் (Electricity)",
    nativeTitle: "அலகு 4: மின்னோட்டவியல் (Electricity - Ohm's Law & Circuits)",
    unitOrTerm: "இயற்பியல் (Physics)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "மின்னோட்டம், மின்னழுத்தம் மற்றும் மின்னழுத்த வேறுபாடு",
      "ஓம் விதி (Ohm's Law V = IR) மற்றும் மின்தடை",
      "மின்தடை எண்கள் (Resistivity) மற்றும் மின்கடத்து எண்",
      "மின்தடையாக்கிகளின் தொடரிணைப்பு மற்றும் பக்கவிணைப்பு",
      "ஜூல் வெப்ப விதி (Joule's Heating Effect H = I²Rt) மற்றும் மின் திறன்",
      "வீட்டு மின்சுற்றுகள், எல்.இ.டி விளக்குகள்",
    ],
    learningOutcomes: [
      "ஓம் விதியைச் சோதித்தறிந்து V-I வரைபடம் வரைதல்",
      "தொடர் மற்றும் பக்க இணைப்புகளில் தொகுபயன் மின்தடையைக் கணக்கிடுதல்",
      "மின்சாதனங்களின் மின்னாற்றல் நுகர்வு மற்றும் கட்டணக் கணக்கீடுகளைச் செய்தல்",
    ],
    suggestedObjectives:
      "ஓம் விதியை வரையறுத்து வரைபடம் வரைதல்; தொடர் மற்றும் பக்க இணைப்புச் சுற்றுகளின் வேறுபாடுகளை அட்டவணைப்படுத்துதல்; ஜூல் வெப்ப விளைவின் அன்றாடப் பயன்பாடுகளைப் பட்டியலிடுதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 43 - 58",
  },
  {
    id: "tn-10-sci-7",
    chapterNumber: 7,
    title: "Unit 7: அணுக்களும் மூலக்கூறுகளும் (Atoms and Molecules)",
    nativeTitle: "அலகு 7: அணுக்களும் மூலக்கூறுகளும் (Mole Concept & Avogadro Hypothesis)",
    unitOrTerm: "வேதியியல் (Chemistry)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "நவீன அணுக்கொள்கை (Modern Atomic Theory)",
      "ஒப்பு அணு நிறை மற்றும் ஒப்பு மூலக்கூறு நிறை",
      "மோல் கருத்து (Mole Concept - 6.023 x 10²³ துகள்கள்)",
      "அவகாட்ரோ கருதுகோள் மற்றும் அதன் பயன்பாடுகள்",
      "வாயுக்களின் மோலார் பருமன் மற்றும் சதவீத இயைபு",
    ],
    learningOutcomes: [
      "நவீன அணுக்கொள்கையின் சிறப்பு அம்சங்களை விவரித்தல்",
      "வேதிச் சேர்மங்களின் மூலக்கூறு நிறையை கணக்கிடுதல்",
      "மோல் தத்துவத்தைப் பயன்படுத்தி நிறையை மோல்களாகவும் மோல்களை துகள்களாகவும் மாற்றுதல்",
    ],
    suggestedObjectives:
      "அவகாட்ரோ கருதுகோளின் பயன்பாடுகளைத் தெளிவாக விளக்குதல்; மோல் கணக்குகளைப் பிழையின்றி தீர்த்தல்; ஒப்பு மூலக்கூறு நிறைக்கும் ஆவி அடர்த்திக்கும் இடையேயான தொடர்பை வருவித்தல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 91 - 106",
  },
  {
    id: "tn-10-sci-12",
    chapterNumber: 12,
    title: "Unit 12: தாவர உள்ளமைப்பியல் மற்றும் தாவர செயலியல் (Plant Anatomy & Physiology)",
    nativeTitle: "அலகு 12: தாவர உள்ளமைப்பியல் & செயலியல் (Xylem, Phloem & Photosynthesis)",
    unitOrTerm: "உயிரியல் (Biology)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "திசு தொகுப்புகள் (தோல் திசு, புறப்பகுதி திசு, வாஸ்குலார் திசு தொகுப்பு)",
      "ஒருவிதையிலை மற்றும் இருவிதையிலை வேர், தண்டின் உள்ளமைப்பு",
      "பசுங்கணிகத்தின் அமைப்பு மற்றும் ஒளிச்சேர்க்கை (ஒளி வினை & இருள் வினை)",
      "சுவாசித்தல்: காற்றில்லா சுவாசம் மற்றும் காற்று சுவாசம் (கிளைக்காலிசிஸ், கிரப்ஸ் சுழற்சி)",
    ],
    learningOutcomes: [
      "தாவர உள்ளமைப்பின் குறுக்குவெட்டுத் தோற்றங்களை வரைந்து பாகங்களைக் குறித்தல்",
      "ஒளிச்சேர்க்கையின் ஒளி சார்ந்த மற்றும் ஒளி சாரா வினைகளை ஒப்பிடுதல்",
      "மைட்டோகாண்ட்ரியாவின் அமைப்பையும் சுவாசித்தலின் படிகளையும் விவரித்தல்",
    ],
    suggestedObjectives:
      "இருவிதையிலை மற்றும் ஒருவிதையிலை வேரின் உள்ளமைப்பு வேறுபாடுகளை வரைபடத்துடன் விளக்குதல்; ஒளிச்சேர்க்கையின் முக்கியத்துவத்தை ஆய்வுகள் மூலம் நிரூபித்தல்; காற்று சுவாசத்தின் ஆற்றல் சமன்பாட்டை எழுதுதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 172 - 188",
  },
  {
    id: "tn-10-sci-16",
    chapterNumber: 16,
    title: "Unit 16: தாவர மற்றும் விலங்கு ஹார்மோன்கள் (Plant & Animal Hormones)",
    nativeTitle: "அலகு 16: தாவர மற்றும் விலங்கு ஹார்மோன்கள் (Endocrine System)",
    unitOrTerm: "உயிரியல் (Biology)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "தாவர ஹார்மோன்கள்: ஆக்சின்கள், ஜிப்ரல்லின்கள், சைட்டோகைனின்கள்",
      "வளர்ச்சி அடக்கி ஹார்மோன்கள்: எத்திலீன், அப்சிசிக் அமிலம்",
      "மனித நாளமில்லாச் சுரப்பிகள்: பிட்யூட்டரி, தைராய்டு, பாராதைராய்டு",
      "கணையம் (இன்சுலின், குளூக்கோகான்) மற்றும் அட்ரினல் சுரப்பி (அவசர கால ஹார்மோன்)",
      "நாளமில்லாச் சுரப்பிக் குறைபாடுகள் (நீரிழிவு, முன் கழுத்துக் கழலை)",
    ],
    learningOutcomes: [
      "தாவர ஹார்மோன்களின் வாழ்வியல் விளைவுகளை அட்டவணைப்படுத்துதல்",
      "பிட்யூட்டரி சுரப்பியின் தலைமைக் கட்டுப்பாட்டுப் பணிகளைப் பாராட்டுதல்",
      "இன்சுலின் பற்றாக்குறையால் ஏற்படும் நீரிழிவு நோயின் காரணங்களையும் தடுப்பு முறைகளையும் அறிதல்",
    ],
    suggestedObjectives:
      "தாவர ஹார்மோன்களின் பயன்களை விவரித்தல்; தைராய்டு சுரப்பி ஹார்மோன்களின் முக்கியத்துவத்தை விளக்குதல்; அட்ரினலின் அவசரகால செயல்பாடுகளை மனித உடலியலோடு ஒப்பிடுதல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 228 - 242",
  },

  // ==========================================
  // CBSE / NCERT - CLASS 10 SCIENCE
  // ==========================================
  {
    id: "cbse-10-sci-1",
    chapterNumber: 1,
    title: "Chapter 1: Chemical Reactions and Equations",
    nativeTitle: "Chemical Reactions, Balancing, Types & Redox Reactions",
    unitOrTerm: "Unit I: Chemical Substances - Nature and Behaviour",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "Chemical equation representation and Law of Conservation of Mass",
      "Step-by-step balancing of skeletal chemical equations (Hit and trial method)",
      "Types of Chemical Reactions: Combination, Decomposition (Thermal, Electrolytic, Photolytic)",
      "Displacement and Double Displacement (Precipitation) Reactions",
      "Oxidation, Reduction, Oxidising Agent, Reducing Agent and Redox Reactions",
      "Corrosion of metals and Rancidity of fats/oils and prevention",
    ],
    learningOutcomes: [
      "Balance multi-element chemical equations with state symbols accurately",
      "Classify observed experimental reactions into combination, displacement or decomposition",
      "Identify the substance oxidized and reduced in industrial redox processes",
    ],
    suggestedObjectives:
      "Students will demonstrate the law of conservation of mass by balancing chemical equations; predict products of double displacement precipitation reactions; identify daily life effects of oxidation like corrosion and rancidity.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jesc1=1-13",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 1 - 16",
  },
  {
    id: "cbse-10-sci-2",
    chapterNumber: 2,
    title: "Chapter 2: Acids, Bases and Salts",
    nativeTitle: "Acids, Bases, Indicators, pH Scale & Important Salts",
    unitOrTerm: "Unit I: Chemical Substances - Nature and Behaviour",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "Chemical properties of acids and bases (Reaction with metals, carbonates, metal oxides)",
      "Common ions produced in aqueous solution (H+ / H3O+ and OH-)",
      "Concept of pH scale, universal indicator, and importance of pH in everyday life",
      "Family of salts, water of crystallization (Plaster of Paris, Gypsum, Blue Vitriol)",
      "Manufacture and uses of Sodium Hydroxide (Chlor-alkali), Bleaching Powder, Baking Soda, Washing Soda",
    ],
    learningOutcomes: [
      "Explain the neutralizing mechanism and electrical conductivity of acids and bases in water",
      "Interpret pH values in soil, tooth decay, digestive system, and acid rain",
      "State chemical formula, preparation equation, and 3 industrial uses of commercial salts",
    ],
    suggestedObjectives:
      "Define acids and bases using hydrogen/hydroxide ion production; analyze the role of pH in physiological homeostasis; write balanced equations for the preparation of bleaching powder, baking soda, and plaster of Paris.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jesc1=2-13",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 17 - 36",
  },
  {
    id: "cbse-10-sci-4",
    chapterNumber: 4,
    title: "Chapter 4: Carbon and Its Compounds",
    nativeTitle: "Covalent Bonding, Versatile Nature of Carbon, IUPAC & Reactions",
    unitOrTerm: "Unit I: Chemical Substances - Nature and Behaviour",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "Covalent bonding in carbon compounds and electron dot structures (CH4, CO2, H2O, N2)",
      "Versatile nature of carbon: Catenation, tetravalency, isomerism",
      "Homologous series, functional groups (Halogen, Alcohol, Aldehyde, Ketone, Carboxylic acid)",
      "IUPAC nomenclature of saturated and unsaturated hydrocarbons",
      "Chemical properties: Combustion, Oxidation, Addition (Hydrogenation), Substitution",
      "Ethanol and Ethanoic Acid properties, Esterification and Saponification reaction of soaps",
    ],
    learningOutcomes: [
      "Draw electron dot structures and structural isomers of alkanes, alkenes, and alkynes",
      "Formulate IUPAC names for organic compounds containing up to 4 carbon atoms",
      "Differentiate between soaps and synthetic detergents with micelle cleaning mechanism",
    ],
    suggestedObjectives:
      "Explain why carbon forms covalent bonds rather than ionic bonds; illustrate the cleansing action of soap through micelle formation; write reactions for esterification, saponification, and alkaline KMnO4 oxidation.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jesc1=4-13",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 58 - 79",
  },
  {
    id: "cbse-10-sci-5",
    chapterNumber: 5,
    title: "Chapter 5: Life Processes",
    nativeTitle: "Nutrition, Respiration, Transportation & Excretion in Humans & Plants",
    unitOrTerm: "Unit II: World of Living",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "Autotrophic nutrition: Photosynthesis events, stomatal mechanism, chlorophyll necessity",
      "Heterotrophic nutrition: Amoeba phagocytosis and human alimentary canal digestive enzymes",
      "Respiration: Aerobic vs anaerobic pathway of glucose breakdown in cytoplasm/mitochondria",
      "Human respiratory system and gaseous exchange in alveoli",
      "Transportation in humans: Structure of heart, double circulation, blood pressure, lymphatic system",
      "Transportation in plants: Xylem (ascent of sap/transpiration pull) and Phloem (translocation)",
      "Excretion: Nephron structure and urine formation (Filtration, reabsorption, secretion)",
    ],
    learningOutcomes: [
      "Sequence the 3 stages of glucose breakdown in the presence and absence of oxygen",
      "Trace the path of blood through chambers and major vessels during double circulation",
      "Diagram the structure of a nephron and explain how selective reabsorption occurs",
    ],
    suggestedObjectives:
      "Diagram and label the human digestive and circulatory systems; trace the biochemical pathway of glycolysis and Krebs cycle; explain the physiological significance of double circulation and nephron filtration.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jesc1=5-13",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 80 - 105",
  },
  {
    id: "cbse-10-sci-9",
    chapterNumber: 9,
    title: "Chapter 9: Light - Reflection and Refraction",
    nativeTitle: "Spherical Mirrors, Refraction, Snell's Law, Lens Formula & Power",
    unitOrTerm: "Unit III: Natural Phenomena",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "Spherical mirrors: Concave and Convex mirrors, center of curvature, focus, focal length",
      "Ray diagrams for image formation by concave and convex mirrors",
      "Mirror formula (1/v + 1/u = 1/f) and linear magnification with Cartesian sign convention",
      "Refraction of light through rectangular glass slab and lateral displacement",
      "Laws of refraction, refractive index, optical density, and relative refractive index",
      "Image formation by convex and concave lenses with ray diagrams",
      "Lens formula (1/v - 1/u = 1/f), magnification and power of lens (P = 1/f in meters)",
    ],
    learningOutcomes: [
      "Construct accurate ray diagrams showing nature, position, and size of images",
      "Solve numerical problems using mirror and lens formulas applying sign conventions",
      "Calculate refractive index and power of corrective lenses in dioptres",
    ],
    suggestedObjectives:
      "Construct ray diagrams for all object positions with concave mirrors and convex lenses; calculate image distance, height, and magnification using Cartesian conventions; calculate focal length from lens power.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jesc1=9-13",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 149 - 176",
  },
  {
    id: "cbse-10-sci-11",
    chapterNumber: 11,
    title: "Chapter 11: Electricity",
    nativeTitle: "Ohm's Law, Resistance Factors, Series-Parallel Circuits & Power",
    unitOrTerm: "Unit IV: Effects of Current",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Science",
    keySubtopics: [
      "Electric current (I = Q/t), potential difference (V = W/Q), and circuit diagrams",
      "Ohm's law verification and mathematical expression V = IR",
      "Factors affecting resistance of a conductor (Length, area of cross section, resistivity ρ)",
      "Resistors in series: Derivation of equivalent resistance Rs = R1 + R2 + R3",
      "Resistors in parallel: Derivation of equivalent resistance 1/Rp = 1/R1 + 1/R2 + 1/R3",
      "Joule's law of heating (H = I²Rt) and practical heating appliances (Fuse, electric iron)",
      "Electric power (P = VI = I²R = V²/R) and commercial unit of electrical energy (1 kWh = 3.6 x 10⁶ J)",
    ],
    learningOutcomes: [
      "Verify Ohm's law experimentally and calculate resistance from slope of V-I graph",
      "Calculate equivalent resistance and individual branch currents in mixed network circuits",
      "Calculate electrical energy consumption in kilowatt-hours and commercial utility cost",
    ],
    suggestedObjectives:
      "State Ohm's law with graphical representation; derive equivalent resistance formulas for series and parallel resistor networks; solve multi-branch circuit problems calculating current, voltage drop, and power dissipated.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jesc1=11-13",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 189 - 209",
  },

  // ==========================================
  // CBSE / NCERT - CLASS 10 MATHEMATICS
  // ==========================================
  {
    id: "cbse-10-math-1",
    chapterNumber: 1,
    title: "Chapter 1: Real Numbers",
    nativeTitle: "Fundamental Theorem of Arithmetic & Proof of Irrationality",
    unitOrTerm: "Unit I: Number Systems",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Mathematics",
    keySubtopics: [
      "The Fundamental Theorem of Arithmetic (Unique prime factorization)",
      "Finding HCF and LCM of integers using prime factorization method",
      "Relationship between HCF, LCM and product of two numbers: HCF(a,b) x LCM(a,b) = a x b",
      "Revisiting irrational numbers: Proof by contradiction that √2, √3, √5, 3 + 2√5 are irrational",
    ],
    learningOutcomes: [
      "Compute HCF and LCM of multi-digit integers using prime factor trees",
      "Execute formal proofs by contradiction establishing the irrationality of surds",
      "Apply number theory properties to solve real-world word problems",
    ],
    suggestedObjectives:
      "Decompose composite numbers into unique prime factor products; apply the fundamental theorem of arithmetic to find LCM and HCF; construct formal mathematical contradiction proofs for irrationality.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jemh1=1-14",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 1 - 12",
  },
  {
    id: "cbse-10-math-3",
    chapterNumber: 3,
    title: "Chapter 3: Pair of Linear Equations in Two Variables",
    nativeTitle: "Graphical, Substitution, Elimination Methods & Consistency",
    unitOrTerm: "Unit II: Algebra",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Mathematics",
    keySubtopics: [
      "Standard form of linear equations: a1x + b1y + c1 = 0 and a2x + b2y + c2 = 0",
      "Graphical method of solution and geometric interpretations (Intersecting, Parallel, Coincident)",
      "Conditions for consistency and inconsistency based on coefficient ratios (a1/a2, b1/b2, c1/c2)",
      "Algebraic methods: Substitution method step-by-step",
      "Algebraic methods: Elimination by equating coefficients method",
      "Word problems on ages, speed-distance-time, fractions, and two-digit numbers",
    ],
    learningOutcomes: [
      "Determine whether a pair of equations has unique, infinite, or no solution by inspecting ratios",
      "Solve simultaneous linear systems using algebraic elimination and substitution",
      "Translate word scenarios into linear equations and verify the computed solutions",
    ],
    suggestedObjectives:
      "Analyze coefficient ratios to classify linear systems as consistent, inconsistent, or dependent; solve simultaneous equations using algebraic methods; model real-life contextual scenarios into solvable systems.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jemh1=3-14",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 26 - 49",
  },
  {
    id: "cbse-10-math-8",
    chapterNumber: 8,
    title: "Chapter 8: Introduction to Trigonometry",
    nativeTitle: "Trigonometric Ratios, Values of Specific Angles & Identities",
    unitOrTerm: "Unit V: Trigonometry",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Mathematics",
    keySubtopics: [
      "Trigonometric ratios of acute angles in a right-angled triangle (sin, cos, tan, cot, sec, cosec)",
      "Trigonometric ratios table for specific angles: 0°, 30°, 45°, 60°, 90°",
      "Fundamental Pythagorean Trigonometric Identities: sin²θ + cos²θ = 1",
      "Identities: 1 + tan²θ = sec²θ and 1 + cot²θ = cosec²θ",
      "Rigorous proofs of trigonometric expressions and identities using algebraic simplification",
    ],
    learningOutcomes: [
      "Evaluate complex trigonometric expressions for standard angles without calculator",
      "Prove complex trigonometric identities by manipulating LHS to RHS using algebraic identities",
      "Compute unknown side lengths and angles in right triangles using trigonometric definitions",
    ],
    suggestedObjectives:
      "Define the six trigonometric ratios in terms of right triangle sides; recall and apply standard angle values (0° to 90°); establish formal algebraic proofs for fundamental trigonometric identities.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jemh1=8-14",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 113 - 131",
  },
  {
    id: "cbse-10-math-12",
    chapterNumber: 12,
    title: "Chapter 12: Surface Areas and Volumes",
    nativeTitle: "Surface Area & Volume of Combinations of Solids",
    unitOrTerm: "Unit VI: Mensuration",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Mathematics",
    keySubtopics: [
      "Review of formulas for Cuboid, Cube, Cylinder, Cone, Sphere, and Hemisphere",
      "Surface area of combinations of solids (e.g. cylinder with hemispherical ends, toy cone on hemisphere)",
      "Volume of combinations of solids (e.g. ice-cream cone, gulab jamun cylinder-hemisphere problem)",
      "Conversion of solid from one shape to another (Melting and recasting problems)",
    ],
    learningOutcomes: [
      "Deconstruct composite 3D objects into standard geometric components",
      "Calculate total external surface area avoiding duplicate shared internal faces",
      "Calculate conservation of volume during industrial melting, recasting, and canal water flow",
    ],
    suggestedObjectives:
      "Formulate expressions for total surface area and volume of composite solids; compute material requirements and costs for engineered shapes; solve multi-step melting and recasting numerical challenges.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jemh1=12-14",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 164 - 180",
  },
  {
    id: "cbse-10-math-13",
    chapterNumber: 13,
    title: "Chapter 13: Statistics",
    nativeTitle: "Mean, Median & Mode of Grouped Data",
    unitOrTerm: "Unit VII: Statistics and Probability",
    curriculum: "CBSE / NCERT",
    grade: "Class 10",
    subject: "Mathematics",
    keySubtopics: [
      "Mean of grouped data: Direct Method (Σfi·xi / Σfi)",
      "Mean of grouped data: Assumed Mean Method (a + Σfi·di / Σfi)",
      "Mean of grouped data: Step-deviation Method (a + [Σfi·ui / Σfi] x h)",
      "Mode of grouped data: Formula Mode = l + [(f1 - f0) / (2f1 - f0 - f2)] x h",
      "Median of grouped data: Cumulative frequency table and formula Median = l + [((n/2) - cf) / f] x h",
      "Empirical relationship between measures of central tendency: 3 Median = Mode + 2 Mean",
    ],
    learningOutcomes: [
      "Select and execute the optimal method for computing mean based on magnitude of data",
      "Calculate modal class and mode using continuous class boundaries",
      "Construct cumulative frequency tables and determine median and missing frequency values",
    ],
    suggestedObjectives:
      "Compute mean using direct and assumed mean methods; calculate mode and median for continuous frequency distributions; solve problems involving missing frequencies given mean or median.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?jemh1=13-14",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 181 - 204",
  },

  // ==========================================
  // CBSE / NCERT - CLASS 9 SCIENCE
  // ==========================================
  {
    id: "cbse-9-sci-5",
    chapterNumber: 5,
    title: "Chapter 5: The Fundamental Unit of Life",
    nativeTitle: "Cell Structure, Organelles, Mitosis & Meiosis",
    unitOrTerm: "Unit II: Organisation in the Living World",
    curriculum: "CBSE / NCERT",
    grade: "Class 9",
    subject: "Science",
    keySubtopics: [
      "Cell discovery by Robert Hooke and cell theory by Schleiden & Schwann",
      "Plasma membrane structure, diffusion, and osmosis in hypotonic/hypertonic solutions",
      "Cell wall in plant cells, plasmolysis, and turgidity",
      "Nucleus structure, chromatin, chromosomes, DNA, and genes",
      "Cytoplasm and cell organelles: Endoplasmic Reticulum (RER/SER), Golgi Apparatus, Lysosomes ('Suicide bags')",
      "Mitochondria ('Powerhouse of cell') and Plastids (Chloroplasts, Chromoplasts, Leucoplasts)",
      "Vacuoles in plant and animal cells and differences between plant and animal cells",
    ],
    learningOutcomes: [
      "Explain the behavior of cells in hypotonic, isotonic, and hypertonic solutions",
      "Diagram the ultra-structure of plant and animal cells with organelle labels",
      "Differentiate between prokaryotic and eukaryotic cellular architectures",
    ],
    suggestedObjectives:
      "Students will prepare temporary mounts of onion peel and cheek cells; analyze the role of selective permeability of the plasma membrane; explain functions of cellular organelles like mitochondria, lysosomes, and chloroplasts.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?iesc1=5-12",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 56 - 67",
  },
  {
    id: "cbse-9-sci-7",
    chapterNumber: 7,
    title: "Chapter 7: Motion",
    nativeTitle: "Speed, Velocity, Acceleration, Graphs & Equations of Motion",
    unitOrTerm: "Unit III: Motion, Force and Work",
    curriculum: "CBSE / NCERT",
    grade: "Class 9",
    subject: "Science",
    keySubtopics: [
      "Distance vs Displacement with scalar and vector distinctions",
      "Uniform and non-uniform motion along a straight line",
      "Speed and Velocity: Average speed and instantaneous velocity",
      "Acceleration: Uniform, non-uniform, positive, and negative (retardation)",
      "Distance-time graphs and Velocity-time graphs (Area under v-t graph = displacement)",
      "Derivation of three equations of motion by graphical method: v = u + at, s = ut + 1/2 at², v² = u² + 2as",
      "Uniform circular motion and centripetal acceleration",
    ],
    learningOutcomes: [
      "Interpret distance-time and velocity-time graphs for various kinematic states",
      "Derive the 3 kinematic equations of motion graphically with precision",
      "Solve kinematic word problems for free fall and vehicular acceleration",
    ],
    suggestedObjectives:
      "Differentiate between distance and displacement; derive kinematic equations of motion using velocity-time graphs; calculate acceleration, velocity, and distance from experimental or graph data.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?iesc1=7-12",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 93 - 113",
  },

  // ==========================================
  // CBSE / NCERT - CLASS 12 PHYSICS
  // ==========================================
  {
    id: "cbse-12-phy-1",
    chapterNumber: 1,
    title: "Chapter 1: Electric Charges and Fields",
    nativeTitle: "Coulomb's Law, Electric Dipole & Gauss's Theorem",
    unitOrTerm: "Unit I: Electrostatics",
    curriculum: "CBSE / NCERT",
    grade: "Class 12",
    subject: "Physics",
    keySubtopics: [
      "Electric charges: Quantization, conservation, and additivity",
      "Coulomb's Law in vector form and principle of superposition",
      "Electric field due to point charge and system of charges",
      "Electric field lines: Properties and configurations",
      "Electric Dipole: Torque in uniform field, field on axial and equatorial lines",
      "Electric flux and Gauss's Law: Statement, proof, and symmetry conditions",
      "Applications of Gauss's Law: Infinitely long straight wire, infinite plane sheet, spherical shell",
    ],
    learningOutcomes: [
      "Derive electric field intensity on axial and equatorial lines of an electric dipole",
      "Apply Gauss's law to derive fields for line charges and planar charge distributions",
      "Calculate net forces and field strengths for discrete charge geometries",
    ],
    suggestedObjectives:
      "State and apply Coulomb's Law in vector notation; derive electric field expressions for an electric dipole; use Gauss's theorem to calculate electric fields for symmetric charge geometries.",
    pdfSourceUrl: "https://ncert.nic.in/textbook.php?leph1=1-8",
    pdfSourceTitle: "NCERT Official Textbook Portal (ncert.nic.in)",
    pageRange: "Pages 1 - 42",
  },

  // ==========================================
  // TAMIL NADU SAMACHEER KALVI - CLASS 12 TAMIL
  // ==========================================
  {
    id: "tn-12-tam-1",
    chapterNumber: 1,
    title: "இயல் 1: உயிரினும் ஓம்பப்படும் (இளந்தமிழே & தன்னேரில்லாத தமிழ்)",
    nativeTitle: "இயல் 1: மொழி - இளந்தமிழே (சிற்பி பாலசுப்பிரமணியம்), தமிழின் சிறப்புகள்",
    unitOrTerm: "இயல் 1 (12-ஆம் வகுப்பு)",
    curriculum: "Tamil Nadu State Board",
    grade: "Class 12",
    subject: "Tamil",
    keySubtopics: [
      "இளந்தமிழே - கவிஞர் சிற்பி பாலசுப்பிரமணியம்",
      "தமிழ் மொழியின் நடை அழகியல் - தி.சு. நடராசன்",
      "தன்னேரில்லாத தமிழ் - தண்டியலங்கார உரை மேற்கோள் பாடல்",
      "தம்பி நெல்லையப்பருக்கு - பாரதியார் கடிதங்கள்",
      "இலக்கணம்: தமிழாய் எழுதுவோம் (சொல்லமைதி, சந்திப் பிழைகள்)",
    ],
    learningOutcomes: [
      "தமிழ்க் கவிதைகளின் நவீன வடிவ அழகியலை உணர்ந்து போற்றுதல்",
      "பாரதியாரின் தேசியப் பார்வையும் கடித இலக்கிய உத்தியும் அறிதல்",
      "சந்திப் பிழைகள் மற்றும் ஒற்றுப் பிழைகளின்றி தூய தமிழில் எழுதும் திறன் பெறுதல்",
    ],
    suggestedObjectives:
      "சிற்பி பாலசுப்பிரமணியத்தின் கவிதை நயங்களை விளக்குதல்; பாரதியாரின் கடித இலக்கியக் கருத்துகளைத் தொகுத்துரைத்தல்; சந்திப் பிழைகளை நீக்கி வாக்கியங்களைச் சீரமைத்தல்.",
    pdfSourceUrl: "https://tnschools.gov.in/textbooks",
    pdfSourceTitle: "Tamil Nadu Textbook Corporation (tnschools.gov.in)",
    pageRange: "பக்கங்கள் 1 - 24",
  },
];

/**
 * Filter and search textbook chapters with intelligent fallback
 */
export function getTextbookChapters(
  curriculum?: string,
  grade?: string,
  subject?: string,
  searchTerm?: string
): TextbookChapter[] {
  let list = TEXTBOOK_CHAPTERS;

  if (curriculum) {
    const normCurric = curriculum.toLowerCase();
    list = list.filter((item) => {
      if (normCurric.includes("tamil") || normCurric.includes("samacheer")) {
        return item.curriculum === "Tamil Nadu State Board";
      }
      if (normCurric.includes("cbse") || normCurric.includes("ncert")) {
        return item.curriculum === "CBSE / NCERT";
      }
      return true;
    });
  }

  if (grade) {
    const normGrade = grade.toLowerCase();
    const matches = list.filter((item) => item.grade.toLowerCase() === normGrade);
    if (matches.length > 0) {
      list = matches;
    }
  }

  if (subject) {
    const normSub = subject.toLowerCase();
    const subMatches = list.filter((item) => {
      const itSub = item.subject.toLowerCase();
      return (
        itSub === normSub ||
        itSub.includes(normSub) ||
        normSub.includes(itSub) ||
        (normSub.includes("math") && itSub.includes("math")) ||
        (normSub.includes("sci") && itSub.includes("sci")) ||
        (normSub.includes("tam") && itSub.includes("tam"))
      );
    });
    if (subMatches.length > 0) {
      list = subMatches;
    }
  }

  if (searchTerm && searchTerm.trim()) {
    const q = searchTerm.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.nativeTitle && c.nativeTitle.toLowerCase().includes(q)) ||
        c.unitOrTerm.toLowerCase().includes(q) ||
        c.keySubtopics.some((s) => s.toLowerCase().includes(q)) ||
        c.learningOutcomes.some((o) => o.toLowerCase().includes(q))
    );
  }

  return list;
}
