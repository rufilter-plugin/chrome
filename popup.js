document.addEventListener("DOMContentLoaded", () => {
    // Локалізація текстів
    document.title = chrome.i18n.getMessage("extensionName");
    document.querySelector("h1").textContent = chrome.i18n.getMessage("extensionName");
    document.querySelector(".instructions").textContent = chrome.i18n.getMessage("instructions");
    document.getElementById("searchExplanation").textContent = chrome.i18n.getMessage("searchExclusionsExplanation");
    document.getElementById("langExplanation").textContent = chrome.i18n.getMessage("languageFilterExplanation");

    // Оновлення текстів для груп
    document.querySelector("fieldset.language-filter legend").textContent = chrome.i18n.getMessage("languageFilterGroup");
    document.querySelector("fieldset.search-exclusions legend").textContent = chrome.i18n.getMessage("searchExclusionsGroup");

    // Оновлення текстів для радіокнопок
    document.getElementById("labelLanguageFilterNone").textContent = chrome.i18n.getMessage("languageFilterNone");
    document.getElementById("labelLanguageFilterUkEn").textContent = chrome.i18n.getMessage("languageFilterUkEn");
    document.getElementById("labelLanguageFilterExcludeRu").textContent = chrome.i18n.getMessage("languageFilterExcludeRu");

    // Оновлення текстів для чекбоксів
    document.getElementById("labelOption1").textContent = chrome.i18n.getMessage("option1");
    document.getElementById("labelOption2").textContent = chrome.i18n.getMessage("option2");
    document.getElementById("labelOption3").textContent = chrome.i18n.getMessage("option3");
    document.getElementById("labelOption4").textContent = chrome.i18n.getMessage("option4");

    // Оновлення плейсхолдера для кастомних доменів
    document.getElementById("customSites").placeholder = chrome.i18n.getMessage("customSitesPlaceholder");

    // Оновлення текстів для tooltip
    document.querySelector("fieldset.language-filter .tooltip-text").textContent = chrome.i18n.getMessage("languageFilterExplanationTooltip");
    document.querySelector("fieldset.search-exclusions .tooltip-text").textContent = chrome.i18n.getMessage("searchExclusionsExplanationTooltip");

    // Tooltip для радіокнопок
    document.querySelector("#labelLanguageFilterNone + .tooltip-icon .tooltip-text").textContent = chrome.i18n.getMessage("languageFilterNoneTooltip");
    document.querySelector("#labelLanguageFilterUkEn + .tooltip-icon .tooltip-text").textContent = chrome.i18n.getMessage("languageFilterUkEnTooltip");
    document.querySelector("#labelLanguageFilterExcludeRu + .tooltip-icon .tooltip-text").textContent = chrome.i18n.getMessage("languageFilterExcludeRuTooltip");

    // Tooltip для чекбоксів
    document.querySelector("#labelOption1 + .tooltip-icon .tooltip-text").textContent = chrome.i18n.getMessage("option1Tooltip");
    document.querySelector("#labelOption2 + .tooltip-icon .tooltip-text").textContent = chrome.i18n.getMessage("option2Tooltip");
    document.querySelector("#labelOption3 + .tooltip-icon .tooltip-text").textContent = chrome.i18n.getMessage("option3Tooltip");
    document.querySelector("#labelOption4 + .tooltip-icon .tooltip-text").textContent = chrome.i18n.getMessage("option4Tooltip");

    // Ініціалізація елементів
    const languageFilterRadios = Array.from(document.getElementsByName("languageFilter"));
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");
    const option3 = document.getElementById("option3");
    const option4 = document.getElementById("option4");
    const customSites = document.getElementById("customSites");

    // Завантаження збережених налаштувань
    chrome.storage.sync.get(
        ["option1", "option2", "option3", "option4", "languageFilter", "customSites"],
        (settings) => {
            option1.checked = settings.option1 || false;
            option2.checked = settings.option2 || false;
            option3.checked = settings.option3 || false;
            option4.checked = settings.option4 || false;
            customSites.value = settings.customSites || "";

            const selectedLanguageFilter = settings.languageFilter || "uk_en";
            languageFilterRadios.forEach((radio) => {
                if (radio.value === selectedLanguageFilter) {
                    radio.checked = true;
                }
            });
        }
    );

    // Автоматичне збереження налаштувань
    option1.addEventListener("change", () => {
        chrome.storage.sync.set({ option1: option1.checked });
    });
    option2.addEventListener("change", () => {
        chrome.storage.sync.set({ option2: option2.checked });
    });
    option3.addEventListener("change", () => {
        chrome.storage.sync.set({ option3: option3.checked });
    });
    option4.addEventListener("change", () => {
        chrome.storage.sync.set({ option4: option4.checked });
    });
    languageFilterRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            if (radio.checked) {
                chrome.storage.sync.set({ languageFilter: radio.value });
            }
        });
    });
    customSites.addEventListener("input", () => {
        chrome.storage.sync.set({ customSites: customSites.value });
    });
});

// Перевірка і встановлення значень за замовчуванням
chrome.storage.sync.get(["languageFilter"], (settings) => {
    if (!settings.languageFilter) {
        chrome.storage.sync.set({ languageFilter: "uk_en" }); // Встановлення опції за замовчуванням
    }
});
