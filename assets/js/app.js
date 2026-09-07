const fileInput = document.getElementById("fileInput");
const previewWrap = document.getElementById("previewWrap");
const imagePreview = document.getElementById("imagePreview");
const removeImageBtn = document.getElementById("removeImageBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultSection = document.getElementById("resultSection");
const toast = document.getElementById("toast");

let selectedMode = "explain";
let selectedLang = "English";

document.querySelectorAll(".action-card").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".action-card").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMode = btn.dataset.mode;
  });
});

document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedLang = btn.dataset.lang;
  });
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    imagePreview.src = e.target.result;
    previewWrap.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

removeImageBtn.addEventListener("click", () => {
  fileInput.value = "";
  imagePreview.src = "";
  previewWrap.classList.add("hidden");
});

const sampleData = {
  explain: {
    heading: "Here’s what it means",
    risk: "LOW RISK",
    riskClass: "safe",
    summary: "This appears to be a payment-related message. The transaction may have been initiated but the final confirmation is unclear.",
    steps: [
      "Check your bank or wallet transaction history first.",
      "Do not repeat the payment until you confirm whether money was deducted.",
      "Keep the transaction reference number available.",
      "Contact the merchant or service provider if the status does not update."
    ],
    reply: "Hi, I made a payment but the transaction status is still unclear. Please check and confirm whether the payment was received."
  },
  scam: {
    heading: "Scam check result",
    risk: "SUSPICIOUS",
    riskClass: "warn",
    summary: "This message shows warning signs often seen in scams, such as urgency, a payment request, or a link that may not match the official service.",
    steps: [
      "Do not click the link or share OTP, PIN, CVV or password.",
      "Verify the sender using the official website or app.",
      "Search the exact domain name before opening it.",
      "If money is involved, contact the bank or service provider directly."
    ],
    reply: "I will verify this request through the official channel before taking any action."
  },
  reply: {
    heading: "Ready-to-send reply",
    risk: "LOW RISK",
    riskClass: "safe",
    summary: "SamjhaDo can turn confusing or emotional messages into a clear, polite response.",
    steps: [
      "Review the reply before sending.",
      "Remove personal information that is not necessary.",
      "Keep the message short and specific."
    ],
    reply: "Thanks for the message. I’ve noted the details. Please give me a little time to verify this and I’ll respond with the correct information."
  },
  error: {
    heading: "Possible fix",
    risk: "TECH ISSUE",
    riskClass: "safe",
    summary: "This looks like a common technical or payment error. The exact live version will inspect the screenshot text and identify the likely cause.",
    steps: [
      "Retry once after checking your internet connection.",
      "Close and reopen the app or browser.",
      "Clear temporary cache if the issue continues.",
      "Take note of any error code before contacting support."
    ],
    reply: "Hi, I’m seeing an error while trying to complete this action. I’ve retried it once. Please check the error and advise the next step."
  }
};

function translateDemo(text, lang) {
  if (lang === "English") return text;
  if (lang === "Hindi") {
    return "डेमो: लाइव संस्करण में यही उत्तर सरल हिंदी में दिखाई देगा। " + text;
  }
  return "Demo: Live version mein yahi answer simple Hinglish mein milega. " + text;
}

analyzeBtn.addEventListener("click", () => {
  if (!fileInput.files[0]) {
    alert("Please upload a screenshot first.");
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Samjha raha hoon...";

  setTimeout(() => {
    const data = sampleData[selectedMode];
    document.getElementById("resultHeading").textContent = data.heading;
    const badge = document.getElementById("riskBadge");
    badge.textContent = data.risk;
    badge.className = "risk-badge " + data.riskClass;
    document.getElementById("resultSummary").textContent = translateDemo(data.summary, selectedLang);

    const steps = document.getElementById("resultSteps");
    steps.innerHTML = "";
    data.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = translateDemo(step, selectedLang);
      steps.appendChild(li);
    });

    document.getElementById("resultReply").textContent = translateDemo(data.reply, selectedLang);
    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({behavior:"smooth"});
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "SamjhaDo ✨";
  }, 650);
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const txt = document.getElementById("resultReply").textContent;
  try {
    await navigator.clipboard.writeText(txt);
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1500);
  } catch {
    alert(txt);
  }
});

document.getElementById("unlockBtn").addEventListener("click", () => {
  alert("Razorpay checkout will be connected in the live version. Demo price: ₹9.");
});

document.getElementById("languageBtn").addEventListener("click", () => {
  alert("V1 interface language switcher placeholder. Analysis language buttons are already functional in demo mode.");
});
