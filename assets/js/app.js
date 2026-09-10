(() => {
  const $ = (id) => document.getElementById(id);
  const fileInput = $("fileInput");
  const previewWrap = $("previewWrap");
  const imagePreview = $("imagePreview");
  const resultSection = $("resultSection");
  const sampleSource = $("sampleSource");
  const toast = $("toast");

  let selectedMode = "explain";
  let selectedLang = "English";
  let usingSample = false;
  let sampleUsed = false;

  const sampleResults = {
    English: {
      summary: "This message claims that your bank KYC has expired and pressures you to open a shortened link immediately. That is a common scam pattern. A genuine bank message should be verified through the bank's official app, website or customer-care number.",
      steps: [
        "Do not open the link in the message.",
        "Do not enter your OTP, UPI PIN, card CVV or password anywhere.",
        "Open your bank's official app yourself and check for any KYC notice.",
        "If you are still unsure, call the number printed on your bank card or official website."
      ],
      reply: "I will verify this directly through the bank's official app or customer-care channel. I will not use the link in this message."
    },
    Hindi: {
      summary: "इस संदेश में कहा गया है कि आपका बैंक KYC समाप्त हो गया है और तुरंत एक छोटे लिंक पर क्लिक करने का दबाव डाला गया है। यह ठगी में अक्सर दिखाई देने वाला संकेत है। बैंक की जानकारी हमेशा आधिकारिक ऐप, वेबसाइट या कस्टमर केयर से जांचें।",
      steps: [
        "संदेश में दिए गए लिंक को न खोलें।",
        "OTP, UPI PIN, CVV या पासवर्ड कभी साझा न करें।",
        "बैंक का आधिकारिक ऐप खुद खोलकर KYC सूचना जांचें।",
        "संदेह होने पर कार्ड या आधिकारिक वेबसाइट पर दिए नंबर से बैंक को कॉल करें।"
      ],
      reply: "मैं इस जानकारी की पुष्टि बैंक के आधिकारिक ऐप या कस्टमर केयर से करूंगा। मैं इस संदेश के लिंक का उपयोग नहीं करूंगा।"
    },
    Hinglish: {
      summary: "Message bol raha hai ki aapka bank KYC expire ho gaya hai aur turant short link open karne ka pressure de raha hai. Yeh scam messages mein common warning sign hai. Bank ki information sirf official app, website ya customer-care se verify karein.",
      steps: [
        "Message wala link open mat karein.",
        "OTP, UPI PIN, CVV ya password kabhi share mat karein.",
        "Bank ka official app khud open karke KYC notice check karein.",
        "Doubt ho to card ya official website par diya bank number use karein."
      ],
      reply: "Main is request ko bank ke official app ya customer-care se verify karunga. Main message ke link ka use nahi karunga."
    }
  };

  const genericResults = {
    explain: {
      heading: "Here’s the simple meaning",
      risk: "CHECK FIRST",
      riskClass: "warn",
      summary: "This offline prototype can preview your screenshot, but the live AI analysis is not connected yet. In the live version, SamjhaDo will read the screen and explain the important part in simple language.",
      steps: [
        "Check the sender, amount, date and any deadline shown on the screenshot.",
        "Avoid clicking unknown links until the sender is verified.",
        "Use the official app or website when money or account access is involved."
      ],
      reply: "Thanks. I’m checking this through the official channel before taking any action."
    },
    scam: {
      heading: "Scam check preview",
      risk: "VERIFY",
      riskClass: "warn",
      summary: "The live version will look for urgency, suspicious links, requests for credentials, impersonation and unusual payment instructions.",
      steps: [
        "Do not share OTP, PIN, CVV or password.",
        "Verify the sender independently.",
        "Use the official website or app instead of links inside suspicious messages."
      ],
      reply: "I will verify this request through the official channel before proceeding."
    },
    reply: {
      heading: "Reply-writing preview",
      risk: "READY",
      riskClass: "safe",
      summary: "The live version will understand the screenshot and create a short reply that matches the situation and language you selected.",
      steps: [
        "Check that names and amounts are correct.",
        "Remove any unnecessary personal information.",
        "Read the message once before sending."
      ],
      reply: "Thanks for the message. I’ve noted the details. I’ll verify the information and get back to you shortly."
    },
    error: {
      heading: "Error-help preview",
      risk: "TECH ISSUE",
      riskClass: "safe",
      summary: "The live version will read the visible error message, identify the likely cause and suggest the easiest troubleshooting steps first.",
      steps: [
        "Note the exact error code or message.",
        "Retry once after checking your internet connection.",
        "Restart the affected app or browser before changing advanced settings."
      ],
      reply: "Hi, I’m seeing this error while trying to complete the action. Please check the issue and advise the next step."
    }
  };

  function setMode(mode) {
    selectedMode = mode;
    document.querySelectorAll(".quick-mode").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });
    const labels = {
      explain: "Explain my screenshot",
      scam: "Check this screenshot",
      reply: "Write a reply",
      error: "Help me fix this"
    };
    $("analyzeBtn").textContent = labels[mode];
  }

  document.querySelectorAll(".quick-mode").forEach(btn => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  document.querySelectorAll(".lang-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedLang = btn.dataset.lang;
      document.querySelectorAll(".lang-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      previewWrap.classList.remove("hidden");
      usingSample = false;
    };
    reader.readAsDataURL(file);
  });

  $("removeImageBtn").addEventListener("click", () => {
    fileInput.value = "";
    imagePreview.removeAttribute("src");
    previewWrap.classList.add("hidden");
  });

  ["heroTryBtn", "bottomTryBtn"].forEach(id => {
    $(id).addEventListener("click", () => {
      $("quickTry").scrollIntoView({behavior:"smooth", block:"center"});
      setTimeout(() => $("sampleBtn").focus({preventScroll:true}), 450);
    });
  });

  $("sampleBtn").addEventListener("click", () => {
    usingSample = true;
    setMode("scam");
    runAnalysis(true);
  });

  function renderResult(data, showSample = false) {
    $("resultHeading").textContent = data.heading || "SamjhaDo result";
    const badge = $("riskBadge");
    badge.textContent = data.risk || "RESULT";
    badge.className = "risk-badge " + (data.riskClass || "safe");

    $("resultSummary").textContent = data.summary;
    const steps = $("resultSteps");
    steps.innerHTML = "";
    data.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      steps.appendChild(li);
    });
    $("resultReply").textContent = data.reply;

    sampleSource.classList.toggle("hidden", !showSample);
    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function runAnalysis(fromSample = false) {
    const btn = $("analyzeBtn");
    if (!fromSample && !fileInput.files[0]) {
      showToast("Upload a screenshot or use the free sample");
      return;
    }

    btn.disabled = true;
    const old = btn.textContent;
    btn.textContent = "Samjha raha hoon...";

    setTimeout(() => {
      if (fromSample || usingSample) {
        const langData = sampleResults[selectedLang];
        renderResult({
          heading: selectedLang === "Hindi" ? "यह संदेश संदिग्ध लगता है" :
                   selectedLang === "Hinglish" ? "Yeh message suspicious lag raha hai" :
                   "This message looks suspicious",
          risk: "HIGH RISK",
          riskClass: "danger",
          ...langData
        }, true);
        sampleUsed = true;
        $("freeUsedNotice").classList.remove("hidden");
      } else {
        renderResult(genericResults[selectedMode], false);
        $("freeUsedNotice").classList.add("hidden");
      }
      btn.disabled = false;
      btn.textContent = old;
    }, 550);
  }

  $("analyzeBtn").addEventListener("click", () => runAnalysis(false));

  $("copyBtn").addEventListener("click", async () => {
    const text = $("resultReply").textContent;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Reply copied");
    } catch {
      showToast("Select and copy the reply");
    }
  });

  $("languageBtn").addEventListener("click", () => {
    showToast("English, हिंदी and Hinglish are available in the test card");
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  // Test login modal
  const modal = $("loginModal");
  function openLogin() {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    $("loginStepOne").classList.remove("hidden");
    $("loginStepTwo").classList.add("hidden");
    $("loginSuccess").classList.add("hidden");
    setTimeout(() => $("mobileInput").focus(), 80);
  }
  function closeLogin() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  $("loginBtn").addEventListener("click", openLogin);
  $("closeLoginBtn").addEventListener("click", closeLogin);
  $("doneLoginBtn").addEventListener("click", closeLogin);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLogin();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeLogin();
  });

  $("sendOtpBtn").addEventListener("click", () => {
    const mobile = $("mobileInput").value.replace(/\D/g, "");
    if (mobile.length !== 10) {
      showToast("Enter a valid 10-digit mobile number");
      return;
    }
    $("loginStepOne").classList.add("hidden");
    $("loginStepTwo").classList.remove("hidden");
    setTimeout(() => $("otpInput").focus(), 80);
  });

  $("changeNumberBtn").addEventListener("click", () => {
    $("loginStepTwo").classList.add("hidden");
    $("loginStepOne").classList.remove("hidden");
  });

  $("verifyOtpBtn").addEventListener("click", () => {
    if ($("otpInput").value.trim() !== "123456") {
      showToast("For this test, use OTP 123456");
      return;
    }
    $("loginStepTwo").classList.add("hidden");
    $("loginSuccess").classList.remove("hidden");
    const loginBtn = $("loginBtn");
    loginBtn.textContent = "Demo User";
    loginBtn.classList.add("logged-in");
    showToast("Test login successful");
  });
})();
