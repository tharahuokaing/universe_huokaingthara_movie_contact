document.addEventListener("DOMContentLoaded", () => {
    const langToggleBtn = document.getElementById("langToggleBtn");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const searchInput = document.getElementById("contactSearch");
    const pillButtons = document.querySelectorAll(".pill-btn");
    const deskCards = document.querySelectorAll(".desk-card");
    const pickTopicButtons = document.querySelectorAll(".pick-topic-btn");
    const topicSelect = document.getElementById("topicSelect");
    const contactForm = document.getElementById("filmContactForm");
    const receiptModal = document.getElementById("receiptModal");
    const closeReceiptBtn = document.getElementById("closeReceiptBtn");
    const copyReceiptBtn = document.getElementById("copyReceiptBtn");
    const htmlRoot = document.documentElement;

    let currentLang = "both"; // 'km', 'en', or 'both'
    let activeFilter = "all";
    let latestRef = "";

    // 1. Language Toggle (Khmer / English / Both)
    if (langToggleBtn) {
        langToggleBtn.addEventListener("click", () => {
            if (currentLang === "both") {
                currentLang = "km";
                document.querySelectorAll(".km").forEach(el => el.style.display = "inline-block");
                document.querySelectorAll(".en").forEach(el => el.style.display = "none");
                langToggleBtn.innerText = "🇰🇭 ភាសាខ្មែរ";
            } else if (currentLang === "km") {
                currentLang = "en";
                document.querySelectorAll(".km").forEach(el => el.style.display = "none");
                document.querySelectorAll(".en").forEach(el => el.style.display = "inline-block");
                langToggleBtn.innerText = "🇬🇧 English";
            } else {
                currentLang = "both";
                document.querySelectorAll(".km").forEach(el => el.style.display = "");
                document.querySelectorAll(".en").forEach(el => el.style.display = "");
                langToggleBtn.innerText = "🇰🇭 / EN";
            }
        });
    }

    // 2. Dark / Light Theme Toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = htmlRoot.getAttribute("data-theme");
            if (currentTheme === "dark") {
                htmlRoot.setAttribute("data-theme", "light");
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                htmlRoot.setAttribute("data-theme", "dark");
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        });
    }

    // 3. Combined Filter & Search
    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        deskCards.forEach(card => {
            const cat = card.getAttribute("data-cat");
            const text = card.textContent.toLowerCase();
            const matchCat = activeFilter === "all" || cat === activeFilter;
            const matchQuery = !query || text.includes(query);

            if (matchCat && matchQuery) {
                card.classList.remove("hidden-card");
            } else {
                card.classList.add("hidden-card");
            }
        });
    }

    pillButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            pillButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeFilter = btn.getAttribute("data-filter");
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    // 4. Select Inquiry Topic & Scroll to Form
    pickTopicButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const topic = btn.getAttribute("data-topic");
            if (topicSelect) {
                const matched = Array.from(topicSelect.options).find(opt => opt.value === topic);
                if (matched) topicSelect.value = topic;
            }
            const formBox = document.getElementById("contactFormBox");
            if (formBox) formBox.scrollIntoView({ behavior: "smooth" });
        });
    });

    // 5. Submit Form & Show Receipt
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("fullName").value.trim();
            const contact = document.getElementById("contactInfo").value.trim();
            const topic = document.getElementById("topicSelect").value;
            const film = document.getElementById("movieTitle").value.trim() || "General";
            const msg = document.getElementById("messageBox").value.trim();
            latestRef = "UHT-FILM-" + Math.floor(100000 + Math.random() * 900000);

            document.getElementById("receiptContent").innerHTML = `
                <p><strong>Reference:</strong> ${latestRef}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Contact:</strong> ${contact}</p>
                <p><strong>Topic:</strong> ${topic}</p>
                <p><strong>Film Title:</strong> ${film}</p>
                <p><strong>Message:</strong> ${msg}</p>
            `;

            if (copyReceiptBtn) {
                copyReceiptBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Ref';
            }
            receiptModal.classList.remove("hidden");
            contactForm.reset();
        });
    }

    if (copyReceiptBtn) {
        copyReceiptBtn.addEventListener("click", () => {
            if (!latestRef) return;
            navigator.clipboard?.writeText(latestRef).catch(() => {});
            copyReceiptBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        });
    }

    if (closeReceiptBtn) {
        closeReceiptBtn.addEventListener("click", () => {
            receiptModal.classList.add("hidden");
        });
    }

    if (receiptModal) {
        receiptModal.addEventListener("click", (e) => {
            if (e.target === receiptModal) {
                receiptModal.classList.add("hidden");
            }
        });
    }
});
