import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';
import { AIChatMessage, GrievanceCategory } from '../../types/civic';
import { useLanguage } from '../../context/LanguageContext';
import { NavigationTab } from '../Header';

interface AIAssistantPageProps {
  onNavigate: (tab: NavigationTab, params?: any) => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: t('ai.welcomeMsg'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Department of Administrative Reforms and Public Grievances (DARPG)',
      reviewDate: 'January 2026',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Update initial welcome message when language changes if only welcome is present
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'msg-welcome') {
        return [
          {
            id: 'msg-welcome',
            sender: 'assistant',
            content: t('ai.welcomeMsg'),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'Department of Administrative Reforms and Public Grievances (DARPG)',
            reviewDate: 'January 2026',
          },
        ];
      }
      return prev;
    });
  }, [language, t]);

  const supportedPromptsMap: Record<string, string[]> = {
    en: [
      'How long does PWD take to fix a dangerous pothole?',
      'What is the procedure for drinking water contamination?',
      'What to do if electric transformer is sparking?',
      'Rules for stray dog menace and Animal Birth Control',
    ],
    hi: [
      'पीडब्ल्यूडी को खतरनाक गड्ढे की मरम्मत में कितना समय लगता है?',
      'पीने के पानी के दूषित होने पर क्या प्रक्रिया है?',
      'यदि ट्रांसफार्मर में चिंगारी निकल रही है तो क्या करें?',
      'आवारा कुत्तों और नसबंदी (ABC) के सरकारी नियम क्या हैं?',
    ],
    te: [
      'ప్రమాదకరమైన గుంతను పరిష్కరించడానికి PWDకి ఎంత సమయం పడుతుంది?',
      'తాగునీరు కలుషితమైతే అనుసరించాల్సిన విధానం ఏమిటి?',
      'విద్యుత్ ట్రాన్స్‌ఫార్మర్‌లో స్పార్కింగ్ వస్తుంటే ఏమి చేయాలి?',
      'వీధి కుక్కల సమస్య మరియు జంతు జననాల నియంత్రణ (ABC) నిబంధనలు ఏమిటి?',
    ],
    kn: [
      'ಅಪಾಯಕಾರಿ ಗುಂಡಿಯನ್ನು ಸರಿಪಡಿಸಲು PWD ಎಷ್ಟು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ?',
      'ಕುಡಿಯುವ ನೀರು ಕಲುಷಿತಗೊಂಡಾಗ ಅನುಸರಿಸಬೇಕಾದ ಪ್ರಕ್ರಿಯೆ ಏನು?',
      'ವಿದ್ಯುತ್ ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್‌ನಲ್ಲಿ ಕಿಡಿ ಹೊಮ್ಮುತ್ತಿದ್ದರೆ ಏನು ಮಾಡಬೇಕು?',
      'ಬೀದಿ ನಾಯಿಗಳ ಹಾವಳಿ ಮತ್ತು ಸಂತಾನ ನಿಯಂತ್ರಣ ನಿಯಮಗಳು ಯಾವುವು?',
    ],
    ta: [
      'ஆபத்தான குழியை சீரமைக்க PWD எவ்வளவு காலம் எடுத்துக்கொள்ளும்?',
      'குடிநீர் அசுத்தமடைந்தால் பின்பற்ற வேண்டிய நடைமுறை என்ன?',
      'மின் மின்மாற்றியில் தீப்பொறி பறந்தால் என்ன செய்ய வேண்டும்?',
      'தெரு நாய்கள் தொல்லை மற்றும் விலங்கு பிறப்பு கட்டுப்பாட்டு விதிகள் என்ன?',
    ],
  };

  const unsupportedPromptsMap: Record<string, string[]> = {
    en: [
      'Can you provide legal representation in court for my trial?',
      'What stocks or mutual funds should I invest in for high returns?',
    ],
    hi: [
      'क्या आप अदालत में मेरे मुकदमे के लिए कानूनी प्रतिनिधित्व कर सकते हैं?',
      'उच्च रिटर्न के लिए मुझे किन शेयरों या म्यूचुअल फंड में निवेश करना चाहिए?',
    ],
    te: [
      'కోర్టులో నా విచారణ కోసం మీరు న్యాయవాదిగా ప్రాతినిధ్యం వహించగలరా?',
      'ఎక్కువ లాభాల కోసం నేను ఏ షేర్లు లేదా మ్యూచువల్ ఫండ్స్‌లో పెట్టుబడి పెట్టాలి?',
    ],
    kn: [
      'ನ್ಯಾಯಾಲಯದಲ್ಲಿ ನನ್ನ ವಿಚಾರಣೆಗೆ ನೀವು ಕಾನೂನು ಪ್ರಾತಿನಿಧ್ಯ ನೀಡಬಹುದೇ?',
      'ಹೆಚ್ಚಿನ ಆದಾಯಕ್ಕಾಗಿ ನಾನು ಯಾವ ಷೇರುಗಳು ಅಥವಾ ಮ್ಯೂಚುಯಲ್ ಫಂಡ್‌ಗಳಲ್ಲಿ ಹೂಡಿಕೆ ಮಾಡಬೇಕು?',
    ],
    ta: [
      'நீதிமன்றத்தில் எனது வழக்கிற்கு சட்ட பிரதிநிதித்துவம் வழங்க முடியுமா?',
      'அதிக வருமானத்திற்கு நான் எந்த பங்குகள் அல்லது மியூச்சுவல் ஃபண்டுகளில் முதலீடு செய்ய வேண்டும்?',
    ],
  };

  const supportedPrompts = supportedPromptsMap[language] || supportedPromptsMap.en;
  const unsupportedPrompts = unsupportedPromptsMap[language] || unsupportedPromptsMap.en;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMessage: AIChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          lang: language,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('API server returned error');
      }

      const data = await res.json();

      const aiReply: AIChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        content: data.reply || 'Here is the relevant citizen charter information for your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'CPGRAMS Citizen Charter & Indian Municipal Standards',
        reviewDate: data.reviewDate || 'January 2026',
        suggestedAction: data.suggestedCategory
          ? {
              label: `${t('citizen.lodgeFirst')}: ${data.suggestedCategory}`,
              category: data.suggestedCategory as GrievanceCategory,
              department: data.suggestedDepartment,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback message
      const errorReply: AIChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        content: t('ai.disclaimerText'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'DARPG Citizen Charter 2025-2026',
        reviewDate: 'January 2026',
        suggestedAction: {
          label: t('citizen.lodgeFirst'),
          category: 'Roads & Infrastructure',
        },
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        content: t('ai.welcomeMsg'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Department of Administrative Reforms and Public Grievances (DARPG)',
        reviewDate: 'January 2026',
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {t('ai.title')}
            </h1>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            {t('ai.subtitle')}
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs font-semibold text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('ai.clearChat')}</span>
        </button>
      </div>

      {/* Distinction Between General Guidance and Official Decisions Disclaimer */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">{t('ai.disclaimerTitle')}</strong> {t('ai.disclaimerText')} For formal legal adjudication or court representation, contact the <strong>National Legal Services Authority (NALSA)</strong> at toll-free helpline <strong>15100</strong>.
        </div>
      </div>

      {/* Suggested Query Chips (Common Services & Policy Boundaries) */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('ai.commonQuestions')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {supportedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 hover:border-teal-300 px-3 py-1.5 rounded-xl shadow-xs transition text-left cursor-pointer active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>{t('ai.outOfScope')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unsupportedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-rose-50/70 hover:bg-rose-100/80 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl shadow-xs transition text-left cursor-pointer active:scale-95"
                title="Click to test boundary handling and disclaimer response"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col h-[560px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-teal-600 text-white shadow-teal-600/20'
                  }`}
                >
                  {isUser ? 'YOU' : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1.5 max-w-[85%]">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none space-y-2.5'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {m.content}
                    </div>

                    {/* Source & Review Date Tag for Assistant */}
                    {!isUser && m.source && (
                      <div className="pt-2.5 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1 text-slate-600 font-medium">
                          <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{t('ai.sourceLabel')} <strong className="text-slate-700">{m.source}</strong></span>
                        </div>
                        {m.reviewDate && (
                          <div className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{t('ai.reviewedLabel')} {m.reviewDate}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Suggested Action Button inside Bubble */}
                    {!isUser && m.suggestedAction && (
                      <div className="pt-2">
                        <button
                          onClick={() =>
                            onNavigate('submit', {
                              category: m.suggestedAction?.category,
                              department: m.suggestedAction?.department,
                            })
                          }
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
                        >
                          <span>{m.suggestedAction.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Message Footer (Time & Copy) */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className="hover:text-slate-600 transition flex items-center gap-0.5 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-teal-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-xs text-slate-500 font-medium">{t('ai.consulting')}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Box */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t('ai.inputPlaceholder')}
              className="flex-1 py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t('ai.sendBtn')}</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Server-side AI with curated knowledge base • Instant Redressal</span>
            <span className="hidden sm:inline">Model: gemini-3.8-flash</span>
          </div>
        </div>
      </div>
    </div>
  );
};

