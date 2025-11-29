
import { translations } from "./src/lib/i18n/translations";

console.log("Testing i18n...");

const enBadge = translations.en["home.hero.badge"];
const haBadge = translations.ha["home.hero.badge"];

console.log(`English Badge: ${enBadge}`);
console.log(`Hausa Badge: ${haBadge}`);

if (haBadge === "Buɗaɗɗen Tushe") {
    console.log("SUCCESS: Hausa translation found.");
} else {
    console.log("FAILURE: Hausa translation NOT found.");
}

const haAboutTitle = translations.ha["about.title"];
console.log(`Hausa About Title: ${haAboutTitle}`);
