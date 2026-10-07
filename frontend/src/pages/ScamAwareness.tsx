import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  QrCode,
  Link2,
  PhoneCall,
  Monitor,
  ArrowDownLeft,
  RotateCcw,
  KeyRound,
  FileCheck,
  Store,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ScamAwareness: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<number>(0);

  const scams = [
    {
      id: 0,
      title: 'Fake UPI QR Codes (QR Replacement & Overstickers)',
      icon: QrCode,
      summary: 'Scammers paste fraudulent printed QR codes over legitimate merchant counter displays or share malicious QR images over WhatsApp.',
      howItWorks: 'The victim intends to pay a shopkeeper or receive money for an online listing (e.g. OLX). The victim scans the QR code, which triggers a debit transaction directly to the fraudster’s mule account.',
      warningSigns: [
        'A QR sticker pasted loosely over the original merchant board',
        'Buyer on marketplace insisting on sending you a QR code to "receive payment"',
        'Merchant display name on UPI app doesn’t match the physical store name',
      ],
      whatNotToDo: [
        'NEVER scan a QR code to "receive" or "accept" funds',
        'Never scan a QR code sent over WhatsApp or SMS from an unknown buyer',
      ],
      howToVerify: 'Always check the payee name displayed on your banking app screen before entering your UPI PIN.',
      whatToDoIfScammed: 'Immediately report the transaction in your UPI app, block the bank account via customer care, and file a cybercrime report on 1930 / cybercrime.gov.in.',
    },
    {
      id: 1,
      title: 'Fake Payment Links (Phishing & Typosquatting)',
      icon: Link2,
      summary: 'Deceptive SMS or WhatsApp links masquerading as electricity bills, lottery rewards, or courier delivery fees.',
      howItWorks: 'The victim clicks an urgent link like `ebill-sbi-pay.xyz` asking for a nominal ₹5 or ₹10 fee. The spoofed page captures banking details or triggers a high-value collect request.',
      warningSigns: [
        'Domain names ending in .xyz, .top, or containing hyphens (e.g., sbi-update-kyc.com)',
        'Messages threatening service disconnection at midnight unless paid immediately',
        'Unverified sender IDs in SMS headers',
      ],
      whatNotToDo: [
        'Do not click shortened URLs (bit.ly, tinyurl) claiming to be from banks or utility providers',
        'Do not make payments on websites without valid HTTPS certificates',
      ],
      howToVerify: 'Use PayGuard’s UPI & Link Scanner or navigate directly to the utility board’s official website.',
      whatToDoIfScammed: 'Contact your bank fraud desk immediately to freeze internet banking and hotlist all cards.',
    },
    {
      id: 2,
      title: 'Fake Customer-Care Numbers (SEO Poisoning)',
      icon: PhoneCall,
      summary: 'Cybercriminals create fake Google Maps listings and fake blogs with scammer phone numbers labeled as official support.',
      howItWorks: 'A user facing a delayed refund searches Google for "Swiggy Customer Care" or "PhonePe Helpline". The number connects to a fraudster who tricks the victim into making a test transfer.',
      warningSigns: [
        'Customer care numbers listed as personal 10-digit mobile numbers (+91-98...) rather than toll-free 1800 numbers',
        'Support executive demanding that you download remote screen-sharing software',
        'Support asking for your UPI PIN to process a pending refund',
      ],
      whatNotToDo: [
        'Never trust search engine results or Google Maps business listings for bank contact numbers',
        'Never share any OTP or screen visibility with a helpline caller',
      ],
      howToVerify: 'Only dial contact numbers found inside the official verified mobile application.',
      whatToDoIfScammed: 'Notify the genuine bank support desk and register an FIR with local cyber police.',
    },
    {
      id: 3,
      title: 'Screen-Sharing & Remote Access Scams',
      icon: Monitor,
      summary: 'Victims are instructed to install AnyDesk, TeamViewer, or RustDesk under the guise of technical troubleshooting.',
      howItWorks: 'Once installed, the fraudster views the victim’s phone screen in real time. When the victim opens their banking app, the scammer observes credentials, OTPs, and UPI PINs.',
      warningSigns: [
        'Caller insisting you download a specific utility app from the Play Store',
        'Caller asking for a 9-digit session code displayed on your screen',
        'Claims of "server synchronization" or "network debugging"',
      ],
      whatNotToDo: [
        'Never grant screen sharing permission to anyone claiming to be bank or e-commerce support',
        'Never open banking apps while a screen sharing session is active',
      ],
      howToVerify: 'Banks will NEVER ask customers to install remote desktop applications.',
      whatToDoIfScammed: 'Immediately uninstall the application, disconnect Wi-Fi / Mobile data, and lock banking access from another device.',
    },
    {
      id: 4,
      title: 'Collect-Request Traps (Reverse Vishing)',
      icon: ArrowDownLeft,
      summary: 'Fraudsters send a UPI "Collect Request" disguised as a credit notification or prize payout.',
      howItWorks: 'The fraudster says: "I have initiated your ₹10,000 lottery transfer; just click accept and enter your PIN". When the victim clicks Accept and types their PIN, money is deducted instead of added.',
      warningSigns: [
        'Notification on PhonePe/GPay saying "Pay ₹..." when you were expecting to receive money',
        'Caller instructing you to enter your PIN to receive funds',
      ],
      whatNotToDo: [
        'GOLDEN RULE: YOU NEVER ENTER A UPI PIN TO RECEIVE MONEY',
        'Never accept collect requests from unknown VPA addresses',
      ],
      howToVerify: 'To receive money on UPI, the sender only requires your UPI ID or phone number. No authorization is required on your side.',
      whatToDoIfScammed: 'Decline all pending requests and dispute the unauthorized debit via NPCI portal.',
    },
    {
      id: 5,
      title: 'Refund & Cash-Back Bait Scams',
      icon: RotateCcw,
      summary: 'Fake messages claiming unclaimed cashback scratch cards or accidental overpayments.',
      howItWorks: 'Victims receive a notification claiming they won a ₹1,999 cashback. Clicking the link opens a disguised transaction intent that initiates an outgoing transfer.',
      warningSigns: [
        'Scratch cards received via WhatsApp links or third-party websites',
        'Promises of high cash prizes for answering simple 3-question surveys',
      ],
      whatNotToDo: [
        'Do not click "Claim Reward" buttons on unfamiliar websites',
        'Do not believe unsolicited cashback announcements',
      ],
      howToVerify: 'Genuine cashbacks from Google Pay or PhonePe are automatically credited to your bank account without manual approvals.',
      whatToDoIfScammed: 'Report the URL to national cyber reporting cells.',
    },
    {
      id: 6,
      title: 'OTP Interception & Forwarding Traps',
      icon: KeyRound,
      summary: 'Tricking victims into revealing One-Time Passwords or dialing MMI forwarding codes (*21*...).',
      howItWorks: 'Scammers claim an OTP is needed to "cancel an unauthorized order" or trick the victim into dialing a call-forwarding string that forwards incoming OTP SMS to the scammer.',
      warningSigns: [
        'Caller asking you to dial codes beginning with *401* or *21*',
        'Caller asking for a "verification code" sent to your SMS',
      ],
      whatNotToDo: [
        'Never disclose OTP to anyone, including bank managers or police',
        'Never dial USSD forwarding codes instructed by callers',
      ],
      howToVerify: 'Read the full text of the SMS: It always states "DO NOT SHARE THIS OTP WITH ANYONE".',
      whatToDoIfScammed: 'Dial ##002# to cancel all call and SMS forwardings immediately.',
    },
    {
      id: 7,
      title: 'Fake KYC Update & Account Suspension Warnings',
      icon: FileCheck,
      summary: 'Threats that your SIM card, PAN card, or bank account will be blocked within 24 hours.',
      howItWorks: 'Scammers send panic-inducing SMS: "Dear Customer, your SBI YONO account will be deactivated today. Update PAN immediately at link...". The link harvests credentials.',
      warningSigns: [
        'Urgent deadline (e.g. "within 2 hours")',
        'Unregistered mobile numbers used to send official-looking bank SMS',
      ],
      whatNotToDo: [
        'Do not submit PAN or Aadhaar copies on unverified websites',
        'Do not panic or rush into compliance',
      ],
      howToVerify: 'Visit your nearest bank branch or check official net banking messages.',
      whatToDoIfScammed: 'Notify the bank’s grievance cell and change net banking passwords immediately.',
    },
    {
      id: 8,
      title: 'Remote-Access APK / Malicious App Downloads',
      icon: Monitor,
      summary: 'Side-loading malicious Android APK files masked as payment apps, banking updates, or courier tracking tools.',
      howItWorks: 'Scammer sends a file like `sbi_rewards_update.apk`. Once installed, it asks for SMS permissions, intercepts all two-factor authentication codes, and hides its app icon.',
      warningSigns: [
        'Sender insisting you download and install an APK file directly',
        'Prompts asking to enable "Install from Unknown Sources"',
      ],
      whatNotToDo: [
        'Never install APK files received via WhatsApp, Telegram, or SMS',
        'Never grant SMS or Accessibility service permissions to untrusted tools',
      ],
      howToVerify: 'Only install applications through the official Google Play Store or Apple App Store.',
      whatToDoIfScammed: 'Boot phone in Safe Mode, uninstall the malicious app, or perform a full factory reset.',
    },
    {
      id: 9,
      title: 'Fake Merchant Portals & Cloned E-Commerce Stores',
      icon: Store,
      summary: 'Copycat shopping websites offering branded goods at 90% discounts (e.g., iPhone 15 for ₹8,999).',
      howItWorks: 'Victims enter payment information on a fake gateway that steals their money while no goods are ever dispatched.',
      warningSigns: [
        'Prices too good to be true (e.g. 80-90% discount on luxury electronics)',
        'Only prepaid UPI payment accepted (Cash on Delivery disabled)',
        'No physical address, GST number, or verifiable contact details on the site',
      ],
      whatNotToDo: [
        'Never make advance UPI payments to unknown social media stores without buyer protection',
      ],
      howToVerify: 'Check store reviews, search domain age on Whois, and verify GST registration on the GST portal.',
      whatToDoIfScammed: 'Report the scammer’s UPI handle to NPCI and file a complaint on the National Consumer Helpline.',
    },
  ];

  const current = scams[selectedTopic];
  const Icon = current.icon;

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 text-xs font-mono font-semibold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>National Financial Literacy & Defensive Cyber Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
          UPI & Digital Payment Scam Awareness Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2">
          Comprehensive breakdown of 10 modern payment scam vectors, psychology of manipulation, and defensive verification protocols.
        </p>
      </div>

      {/* Main Interactive Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar: Topic Selector */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200 space-y-1.5 h-fit">
          <div className="text-[10px] font-mono uppercase text-slate-500 px-3 pb-2 border-b border-slate-800 light:border-slate-200">
            Select Scam Topic (10 Vectors)
          </div>
          {scams.map((scam) => {
            const ScamIcon = scam.icon;
            const isSelected = selectedTopic === scam.id;
            return (
              <button
                key={scam.id}
                onClick={() => setSelectedTopic(scam.id)}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-blue-600/20 text-cyan-400 font-bold border border-blue-500/30 glow-blue'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <ScamIcon className="w-4 h-4 shrink-0" />
                <span className="line-clamp-1">{scam.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content: Comprehensive Breakdown Card */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-card border border-blue-500/20 shadow-2xl space-y-6">
          <div className="flex items-start gap-4 pb-4 border-b border-slate-800 light:border-slate-200">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                Threat Vector #0{current.id + 1}
              </span>
              <h2 className="text-xl font-bold text-white light:text-slate-900 mt-0.5">
                {current.title}
              </h2>
              <p className="text-xs text-slate-300 light:text-slate-600 mt-1 leading-relaxed">
                {current.summary}
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
              1. Mechanics: How the Attack Unfolds
            </h3>
            <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed bg-slate-900/60 light:bg-slate-100 p-3.5 rounded-xl border border-slate-800 light:border-slate-300">
              {current.howItWorks}
            </p>
          </div>

          {/* Warning Signs */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>2. Critical Warning Signs:</span>
            </h3>
            <ul className="space-y-1.5 text-xs">
              {current.warningSigns.map((w, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 light:text-amber-900 flex items-start gap-2"
                >
                  <span className="font-bold shrink-0">⚠️</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What NOT to Do */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold mb-2 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>3. What NOT To Do:</span>
            </h3>
            <ul className="space-y-1.5 text-xs">
              {current.whatNotToDo.map((d, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 light:text-rose-900 flex items-start gap-2"
                >
                  <span className="font-bold shrink-0">✕</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to Verify & What to do if scammed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 light:text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>How to Verify Genuine Flow:</span>
              </div>
              <p className="text-[11px] leading-relaxed pt-1">{current.howToVerify}</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 light:text-blue-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-cyan-400">
                <ShieldAlert className="w-4 h-4" />
                <span>What To Do If Scammed:</span>
              </div>
              <p className="text-[11px] leading-relaxed pt-1">{current.whatToDoIfScammed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
