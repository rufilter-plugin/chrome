chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading" && tab.url) {
        const url = new URL(tab.url);

        // Перевіряємо, чи це сторінка пошуку Google
        if (url.hostname.includes("google") && url.pathname === "/search") {
            chrome.storage.sync.get(
                ["languageFilter", "option1", "option2", "option3", "option4", "customSites"],
                (settings) => {
                    const query = url.searchParams.get("q") || "";
                    const originalUrl = url.toString();

                    // Розділяємо слова запиту та фільтри
                    const queryTokens = query.split(" ");
                    const baseWords = [];
                    const filters = new Set();

                    queryTokens.forEach((token) => {
                        if (token.startsWith("-site:") || token.startsWith("-intext:")) {
                            filters.add(token); // Додаємо фільтри до Set (унікальні)
                        } else {
                            baseWords.push(token); // Дозволяємо дублювання звичайних слів
                        }
                    });

                    // Обробляємо мовний фільтр
                    let lrValue = null;
                    switch (settings.languageFilter) {
                        case "uk_en":
                            lrValue = "lang_uk|lang_en";
                            url.searchParams.set("lr", lrValue);
                            break;
                        case "exclude_ru":
                            lrValue = "-lang_ru";
                            url.searchParams.set("lr", lrValue);
                            break;
                        case "none":
                            // Якщо вибрано "Do not apply filter", залишаємо lr як є
                            break;
                        default:
                            url.searchParams.delete("lr");
                            break;
                    }

                    // Додаємо нові фільтри, якщо вони потрібні
                    if (settings.option1) {
                        filters.add("-site:.ru");
                    }

                    if (settings.option2) {
                        filters.add("-site:ru.wikipedia.org");
                    }

                    if (settings.option3) {
                        filters.add("-intext:и");
                    }

                    if (settings.option4 && settings.customSites) {
                        const customSites = settings.customSites
                        .split(",")
                        .map((site) => site.trim())
                        .filter(Boolean);
                        customSites.forEach((site) => {
                            filters.add(`-site:${site}`);
                        });
                    }

                    // Формуємо новий запит
                    const newQuery = [...baseWords, ...filters].join(" ");
                    if (newQuery !== query) {
                        url.searchParams.set("q", newQuery);
                    }

                    // Перевіряємо, чи змінився URL, і оновлюємо вкладку
                    const updatedUrl = url.toString();
                    if (originalUrl !== updatedUrl) {
                        chrome.tabs.update(tabId, { url: updatedUrl });
                    }
                }
            );
        }
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: "popup.html" });
});
