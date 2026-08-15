import React from "react";
import { Globe } from "lucide-react";

export const TRANSLATIONS = {
  EN: {
    appTitle: "Nagpur Traffic Alert & Citizen Reporting",
    tagline: "Report traffic issues directly to Nagpur Traffic Police Division",
    reportIssueBtn: "Report Traffic Issue (Under 60s)",
    trackIssueBtn: "Track My Complaint Status",
    recentReports: "Live Community Traffic Reports",
    selectCategory: "1. Select Issue Category",
    categoryJam: "Traffic Jam Gridlock",
    categoryAccident: "Accident / Hazard",
    categoryRash: "Rash Driving",
    categoryParking: "Illegal Parking",
    selectLocation: "2. Pin Location on Nagpur Map",
    addDetails: "3. Issue Description & Evidence",
    photoLabel: "Attach Photo / Video Evidence",
    submitBtn: "Submit Complaint to Police",
    trackingTitle: "Track Your Traffic Complaint",
    enterTrackingId: "Enter Tracking ID (e.g. NGP-TRF-2026-8942)",
    statusReceived: "Received by System",
    statusAssigned: "Assigned to Patrol Officer",
    statusResolved: "Resolved On-Site",
    voted: "Citizens Supported This Issue"
  },
  HI: {
    appTitle: "नागपुर ट्रैफिक अलर्ट एवं नागरिक रिपोर्टिंग",
    tagline: "नागपुर ट्रैफिक पुलिस विभाग को सीधे ट्रैफिक समस्याओं की सूचना दें",
    reportIssueBtn: "ट्रैफिक समस्या रिपोर्ट करें (६० सेकंड में)",
    trackIssueBtn: "मेरी शिकायत की स्थिति ट्रैक करें",
    recentReports: "लाइव नागरिक ट्रैफिक रिपोर्ट",
    selectCategory: "१. समस्या श्रेणी चुनें",
    categoryJam: "भीषण ट्रैफिक जाम",
    categoryAccident: "दुर्घटना / खतरा",
    categoryRash: "तेज / खतरनाक ड्राइविंग",
    categoryParking: "अवैध पार्किंग",
    selectLocation: "२. नागपुर नक्शे पर लोकेशन पिन करें",
    addDetails: "३. समस्या विवरण एवं साक्ष्य",
    photoLabel: "फोटो / वीडियो साक्ष्य संलग्न करें",
    submitBtn: "पुलिस को शिकायत भेजें",
    trackingTitle: "अपनी ट्रैफिक शिकायत ट्रैक करें",
    enterTrackingId: "ट्रैकिंग आईडी दर्ज करें (उदा. NGP-TRF-2026-8942)",
    statusReceived: "सिस्टम द्वारा प्राप्त",
    statusAssigned: "गश्ती अधिकारी को आवंटित",
    statusResolved: "स्थल पर समाधान किया गया",
    voted: "नागरिकों ने इसका समर्थन किया"
  },
  MR: {
    appTitle: "नागपूर ट्रॅफिक अलर्ट व नागरिक तक्रार निवारण",
    tagline: "नागपूर ट्रॅफिक पोलीस विभागाला थेट ट्रॅफिक समस्यांची माहिती द्या",
    reportIssueBtn: "ट्रॅफिक समस्या नोंदवा (६० सेकंदात)",
    trackIssueBtn: "माझ्या तक्रारीची स्थिती ट्रॅक करा",
    recentReports: "थेट नागरिक ट्रॅफिक अहवाल",
    selectCategory: "१. समस्येचा प्रकार निवडा",
    categoryJam: "तीव्र ट्रॅफिक जॅम",
    categoryAccident: "अपघात / धोकादायक ठिकाण",
    categoryRash: "बेदरकार ड्रायव्हिंग",
    categoryParking: "बेकायदेशीर पार्किंग",
    selectLocation: "२. नागपूर नकाशावर ठिकाण पिन करा",
    addDetails: "३. तपशील व पुरावा",
    photoLabel: "फोटो / व्हिडिओ पुरावा जोडा",
    submitBtn: "पोलिसांना तक्रार पाठवा",
    trackingTitle: "तुमची ट्रॅफिक तक्रार ट्रॅक करा",
    enterTrackingId: "ट्रॅकिंग आयडी टाका (उदा. NGP-TRF-2026-8942)",
    statusReceived: "सिस्टमद्वारे प्राप्त",
    statusAssigned: "गस्त अधिकाऱ्याकडे सोपवले",
    statusResolved: "घटनास्थळी निवारण झाले",
    voted: "नागरिकांनी पाठिंबा दिला"
  }
};

export default function LanguageSelector({ currentLang, onSelectLang }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(255,255,255,0.08)", padding: "0.2rem 0.5rem", borderRadius: "0.375rem" }}>
      <Globe style={{ width: "14px", height: "14px", color: "#94A3B8" }} />
      {[
        { code: "EN", label: "English" },
        { code: "HI", label: "हिंदी" },
        { code: "MR", label: "मराठी" }
      ].map((lang) => (
        <button
          key={lang.code}
          onClick={() => onSelectLang(lang.code)}
          style={{
            background: currentLang === lang.code ? "#3B82F6" : "transparent",
            color: currentLang === lang.code ? "#FFF" : "#94A3B8",
            border: "none",
            borderRadius: "0.2rem",
            padding: "0.15rem 0.4rem",
            fontSize: "0.72rem",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
