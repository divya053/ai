export interface PolicyChunk {
  id: string;
  documentId: string;
  title: string;
  category: string;
  section: string;
  text: string;
  sourceUrl: string;
  accessedDate: string;
  keywords: string[];
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  sourceUrl: string;
  accessedDate: string;
}

const POLICIES_RAW: PolicyDocument[] = [
  {
    id: "amazon-returns",
    title: "Amazon Return Policy",
    category: "returns_refunds",
    sourceUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=GKM69DUUYKQWKWX7",
    accessedDate: "2026-03-27",
    content: `Amazon Return Policy

Most items purchased from Amazon.com can be returned within 30 days of receipt of shipment. 
Items must be in new and unworn condition and in original packaging.

STANDARD RETURNS:
- Items sold by Amazon.com can be returned within 30 days of the delivery date.
- Refunds are issued to the original payment method within 3-5 business days after the return is received and processed.
- Free return shipping is available for most items via UPS, USPS, or Kohl's drop-off.

NON-RETURNABLE ITEMS (Final Sale):
- Downloadable software products
- Online subscriptions that have already been activated
- Gift cards and prepaid cards
- Hazardous materials
- Items sold as Warehouse Deals that are marked as "Final Sale"

PERISHABLE ITEMS:
- Fresh food, grocery items, and perishables cannot be returned.
- If you receive a damaged or defective perishable item, contact customer service within 30 days for a refund. You do not need to return the item.
- Proof of damage (photo) may be required.

HYGIENE AND PERSONAL CARE ITEMS:
- Health and personal care items cannot be returned if opened/used.
- Unopened hygiene items may be returned within 30 days.

APPAREL AND SHOES:
- Clothing and shoes must be unworn, unwashed, and have original tags attached.
- Items showing signs of wear are not eligible for return.
- Prime Wardrobe items follow separate try-before-you-buy policies.

ELECTRONICS:
- Electronics must be returned within 30 days in original packaging with all accessories.
- TVs, major appliances, and items over $1000 may require special handling.
- Damaged electronics may be eligible for immediate replacement.

MARKETPLACE SELLER ITEMS:
- Items sold by third-party marketplace sellers follow the seller's individual return policies.
- Sellers must offer at minimum a 30-day return window matching Amazon's standard policy.
- For seller disputes, Amazon's A-to-Z Guarantee provides additional protection.
- Seller policies may be stricter for certain categories (e.g., Final Sale items sold by marketplace sellers).

OPENED vs UNOPENED:
- Factory-sealed items returned opened may be subject to a restocking fee up to 20%.
- Software once opened is non-returnable.`
  },
  {
    id: "amazon-refunds",
    title: "Amazon Refund Policy and Processing",
    category: "returns_refunds",
    sourceUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=GDCHLQ5KEQQ2YBBZ",
    accessedDate: "2026-03-27",
    content: `Amazon Refund Policy

REFUND TIMELINE:
- Credit card refunds: 3-5 business days after return processed
- Debit card refunds: up to 10 business days
- Amazon Gift Card refunds: 2-3 hours after return processed
- Prepaid Visa / Mastercard: up to 30 days
- PayPal: 3-5 business days

PARTIAL REFUNDS:
- Items returned after 30 days of delivery may only be eligible for a partial refund.
- Items that are damaged, missing parts, or not in original condition may receive a reduced refund.
- Restocking fees of up to 20% may apply for certain items (TVs, projectors, electronics).
- Open-box returns may receive reduced refund amount based on condition.

FULL REFUNDS (NO RETURN REQUIRED):
- Items that arrive damaged or defective may receive a full refund without return.
- Perishable and grocery items that arrive damaged qualify for no-return refund.
- Items that are materially different from the listing.

REFUND METHOD:
- Refunds are issued to the original payment method.
- Amazon credit may be offered as an alternative in some cases.
- For cash purchases (Amazon Cash), refunds go to the same account.

GIFT RETURNS:
- If you received an item as a gift, you can return it for an Amazon Gift Card balance equal to the item's value.
- The gift purchaser will NOT be notified of the return.

KEEP ITEM POLICY:
- Amazon may issue a refund and allow you to keep the item if the return cost exceeds the item value.
- This is determined on a case-by-case basis and is not guaranteed.
- Do not count on this policy — items must be returned unless explicitly told otherwise.`
  },
  {
    id: "amazon-cancellation",
    title: "Amazon Order Cancellation Policy",
    category: "cancellations",
    sourceUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=G5UN8QMF7HRLBDX3",
    accessedDate: "2026-03-27",
    content: `Amazon Order Cancellation Policy

CANCELLATION WINDOW:
- Orders can typically be cancelled within 30 minutes of placement, before the order enters the shipping process.
- After the cancellation window, orders that have shipped cannot be cancelled and must go through the return process.
- Pre-order cancellations are available anytime before the release date.

DIGITAL ORDERS:
- Digital content orders (eBooks, Music, Video, Apps) can be cancelled within 7 days of purchase if not downloaded or streamed.
- Once downloaded or accessed, digital orders cannot be cancelled.

MARKETPLACE SELLER ORDERS:
- For seller-fulfilled orders, contact the seller directly to request cancellation.
- Sellers have up to 48 hours to respond to cancellation requests.
- Amazon cannot cancel seller-fulfilled orders on the seller's behalf.

SUBSCRIPTION CANCELLATIONS:
- Amazon Prime and Subscribe & Save subscriptions can be cancelled at any time.
- No cancellation fees for subscription services.
- Unused subscription periods are not refunded unless within 3 business days of charge date.

PARTIALLY SHIPPED ORDERS:
- If an order contains multiple items, you can cancel unshipped items individually.
- Already-shipped items must go through the return process.

EFFECT ON PAYMENT:
- Cancelled orders before shipment: full refund within 3-5 business days.
- If charged before cancellation processes, refund issued within standard refund timeline.`
  },
  {
    id: "amazon-shipping",
    title: "Amazon Shipping and Delivery Policy",
    category: "shipping",
    sourceUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=GZXCR4MWLV6YJNBE",
    accessedDate: "2026-03-27",
    content: `Amazon Shipping and Delivery Policy

STANDARD SHIPPING:
- Standard shipping: 4-5 business days after dispatch.
- Expedited shipping: 2-3 business days.
- Priority shipping: Next business day.
- FREE standard shipping on orders over $25 for most items.

PRIME SHIPPING:
- Prime members get FREE Two-Day Shipping on millions of items.
- Same-Day Delivery available in select metro areas for orders placed by noon.
- Prime One-Day Delivery available on eligible items.

LATE DELIVERY:
- If your order is late, check the tracking page first.
- For Prime guaranteed delivery dates that are missed, contact customer service for a refund of any shipping fees charged.
- Amazon is not responsible for delays caused by extreme weather, carrier disruptions, or other events outside Amazon's control.
- Marketplace seller shipping delays are the seller's responsibility.

LOST PACKAGES:
- If your package is marked as delivered but not received:
  1. Check with neighbors, building management, and safe locations around your property.
  2. Wait 48 hours — packages are sometimes marked delivered before actual delivery.
  3. Contact customer service after 48 hours if still not found.
  4. Amazon will investigate and issue a replacement or refund if the package is confirmed lost.
- For high-value items, a police report may be required before Amazon processes a lost package claim.

UNDELIVERABLE PACKAGES:
- If a package is returned as undeliverable (wrong address, unclaimed, etc.):
  - You will receive a refund minus original shipping costs.
  - Amazon does not refund original shipping for undeliverable packages due to incorrect address.

INTERNATIONAL SHIPPING:
- Available to select countries via Amazon Global.
- Customs, import taxes, and duties are the customer's responsibility.
- Return shipping for international orders may not be covered.

ADDRESS CHANGES:
- Shipping address can be changed before the order ships.
- After shipment, address changes are not possible — contact the carrier directly.

SELLER-FULFILLED ORDERS:
- Shipping speeds and costs vary by seller.
- Estimated delivery dates are provided at checkout.
- For delays, contact the seller directly through your orders page.`
  },
  {
    id: "amazon-promotions",
    title: "Amazon Promotional Terms and Coupon Policy",
    category: "promotions",
    sourceUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=G9CQKFKJGD4KZ9BX",
    accessedDate: "2026-03-27",
    content: `Amazon Promotional Terms and Conditions

COUPONS:
- Coupons can be applied at checkout for eligible items.
- One coupon per item per order (cannot stack coupons on the same item).
- Coupons expire on the date shown — expired coupons cannot be reinstated.
- Coupons are non-transferable and cannot be exchanged for cash.
- Returns of coupon-purchased items are refunded at the post-discount price paid.

LIGHTNING DEALS:
- Lightning deals are time-limited and quantity-limited promotions.
- Items must be added to cart and purchased before the deal expires.
- Reserved (in cart) items that are not purchased within the reservation window are returned to the deal pool.
- No price adjustments — if you missed the deal, you pay the standard price.

PRIME DAY / SALE EVENTS:
- Prime Day deals are exclusively for Prime members.
- Price adjustments are NOT offered after purchasing — buy during the sale or pay regular price.
- Prime Day deals cannot be combined with other coupons unless explicitly stated.

PRICE MATCH POLICY:
- Amazon does NOT offer price matching for competitor prices.
- If Amazon lowers the price of an item you purchased within 30 days: Amazon does not automatically issue a price adjustment for non-digital items. Contact customer service; adjustments are at Amazon's discretion.
- Price adjustments are not guaranteed and are an exception, not a policy.

PROMOTIONAL CREDIT:
- Promotional credits issued by Amazon expire on the date shown.
- Credits are non-transferable and cannot be combined with other promotions unless stated.
- Promotional credits do not apply to taxes, shipping, or third-party marketplace orders unless specified.

REFER A FRIEND:
- Referral bonuses are credited after the referred user makes their first qualifying purchase.
- Referral credits expire within 90 days of issuance.

FRAUD / ABUSE:
- Amazon may cancel orders or remove promotions if abuse or fraud is detected.
- Creating multiple accounts to exploit promotions is against Amazon's terms and may result in account suspension.`
  },
  {
    id: "amazon-disputes",
    title: "Amazon Dispute Resolution — Damaged, Incorrect, and Missing Items",
    category: "disputes",
    sourceUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=GLSTABFYTX4TS4NH",
    accessedDate: "2026-03-27",
    content: `Amazon Dispute Resolution for Damaged, Incorrect, and Missing Items

DAMAGED ITEMS:
- If an item arrives damaged, report it within 30 days of delivery.
- Customers may be asked to provide photo evidence of the damage.
- Options: replacement (if in stock), full refund (return not required in most cases), or partial refund for minor cosmetic damage.
- Perishable items: full refund, no return required, report within 30 days.

INCORRECT ITEMS:
- If you receive the wrong item, contact customer service within 30 days.
- Amazon will send the correct item or issue a full refund.
- You may be asked to return the incorrect item at no charge.
- "Wrong item" claims are reviewed; repeat claims may trigger additional verification.

MISSING ITEMS FROM MULTI-ITEM ORDERS:
- If your package arrives but items are missing:
  1. Check if items shipped separately (multiple tracking numbers).
  2. Contact customer service with your order number.
  3. Amazon will investigate and reship missing items or issue a refund.
- For high-value missing items, Amazon may require additional verification.

MISSING PACKAGE (PACKAGE NOT DELIVERED):
- See Shipping Policy for lost package procedures.

A-TO-Z GUARANTEE (MARKETPLACE ORDERS):
- Amazon's A-to-Z Guarantee protects customers when buying from third-party sellers.
- File an A-to-Z claim if:
  - You did not receive your order
  - Item is materially different from what was described
  - Seller refuses to issue a refund or replace the item within the return window
- Claims must be filed within 90 days of the maximum estimated delivery date.
- Amazon will refund up to the full purchase price including shipping.

DOUBLE CHARGED / PAYMENT ISSUES:
- Duplicate charges are resolved within 3-5 business days once reported.
- For unauthorized charges, contact Amazon and your bank immediately.
- Disputed charges may require a bank investigation alongside Amazon's process.

PARTIALLY DAMAGED ORDERS (ITEM ACCEPTABLE BUT NOT PERFECT):
- Amazon may offer a partial refund (concession) for minor issues.
- Concessions are at Amazon's discretion and not guaranteed.
- Accepting a partial refund does not prevent further escalation if the issue persists.`
  },
  {
    id: "ebay-returns",
    title: "eBay Return Policy and Money Back Guarantee",
    category: "returns_refunds",
    sourceUrl: "https://www.ebay.com/help/buying/returns-refunds/ebay-money-back-guarantee?id=4041",
    accessedDate: "2026-03-27",
    content: `eBay Money Back Guarantee and Return Policy

EBAY MONEY BACK GUARANTEE (MBG):
- eBay's Money Back Guarantee covers purchases when items don't arrive, are damaged, or are not as described.
- Buyers must open a case within 30 days of the actual or latest estimated delivery date.

SELLER RETURN POLICIES:
- Each seller sets their own return policy (No Returns, 30-day, or 60-day returns).
- Sellers who accept returns must honor the policy shown on the listing.
- For "No Returns" sellers: eBay Money Back Guarantee still applies if the item is not as described.

ITEM NOT AS DESCRIBED:
- If an item arrives materially different from the listing (wrong size, broken, counterfeit, etc.):
  - Buyer can open an "Item not as described" case regardless of seller return policy.
  - Seller must issue a full refund or send a replacement.
  - If seller doesn't respond within 3 business days, eBay may step in.

REGIONAL DIFFERENCES (EU / UK):
- EU and UK buyers have additional consumer protection rights under local law.
- EU: Right of withdrawal within 14 days for most purchases without reason (statutory right).
- UK: Similar 14-day cooling-off period under Consumer Contracts Regulations.
- These statutory rights supersede the seller's stated return policy for consumer purchases.

FINAL SALE ON EBAY:
- Items marked "No Returns" by sellers are considered final sale.
- However, Money Back Guarantee still applies for SNAD (Significantly Not As Described) cases.
- Cannot return "no returns" items for change-of-mind reasons.

OPENED/USED ITEMS:
- Used items sold as "Used" condition cannot be returned for being used.
- If condition is misrepresented, SNAD applies.
- New items returned open may receive reduced refund.

MARKETPLACE COMPLEXITY:
- eBay is a marketplace — sellers are independent; eBay mediates disputes.
- C2C (Consumer to Consumer) sales have fewer protections than B2C.
- Business sellers must comply with consumer protection laws in their region.`
  },
  {
    id: "shopify-general",
    title: "General E-commerce Merchant Return and Refund Best Practices",
    category: "returns_refunds",
    sourceUrl: "https://www.shopify.com/blog/return-policy",
    accessedDate: "2026-03-27",
    content: `General E-commerce Return and Refund Standards

STANDARD INDUSTRY PRACTICES:
- Standard return window: 30 days from delivery.
- Items must be in original condition, unaltered, with original packaging.
- Proof of purchase required.

EXCEPTION CATEGORIES (common across e-commerce):
- Final Sale items: Non-returnable, explicitly marked as such at purchase.
- Personalized/Custom items: Non-returnable (made to order for the buyer).
- Hygiene items (underwear, swimwear, earrings): Non-returnable once opened/worn.
- Perishable goods: Non-returnable, but refundable if damaged on arrival.
- Digital products: Non-returnable after download/activation.
- Hazardous materials: Cannot be returned via mail.

CONDITION REQUIREMENTS:
- Apparel: Unworn, unwashed, tags attached.
- Electronics: Unopened or in original packaging with all accessories.
- Home goods: No signs of use or damage beyond original condition.

RESTOCKING FEES:
- Maximum restocking fee: typically 15-20% of item price.
- Should be disclosed upfront at time of purchase.
- Not applicable for defective/damaged item returns.

REFUND METHODS:
- Original payment method is standard.
- Store credit may be offered as alternative.
- Cash refunds for cash purchases.

SELLER OBLIGATIONS:
- Must clearly disclose return policy before purchase.
- Must process valid returns promptly (typically within 7 business days).
- Cannot refuse return for item significantly not as described.

CONSUMER RIGHTS (US):
- No federal law mandates a return policy in the US.
- State laws may provide additional protections.
- FTC requires clear disclosure of return policy.
- Credit card chargebacks available as last resort.`
  },
  {
    id: "etsy-policy",
    title: "Etsy Seller Policies and Consumer Protections",
    category: "returns_refunds",
    sourceUrl: "https://www.etsy.com/legal/policy/returns-and-exchanges/239187475099",
    accessedDate: "2026-03-27",
    content: `Etsy Return and Exchange Policies

ETSY'S ROLE:
- Etsy is a marketplace. Individual sellers set their own return policies.
- Etsy's Purchase Protection program covers buyers when items don't arrive or are not as described.

HANDMADE / CUSTOM ITEMS:
- Custom and personalized orders are generally non-returnable.
- Sellers should explicitly state this in their policies.
- If an item is significantly not as described, Etsy Purchase Protection applies regardless.

VINTAGE ITEMS:
- Vintage items (20+ years old) are sold "as is" unless misrepresented.
- Normal wear and patina consistent with age is expected and not grounds for return.

DIGITAL DOWNLOADS:
- Digital download items are non-refundable once downloaded.
- If a file is corrupted or not as described, buyer can open a case.

ETSY PURCHASE PROTECTION:
- Covers buyers if items don't arrive or are significantly not as described.
- Buyers must open a case within 100 days of the estimated delivery date.
- Resolution: full refund or replacement.

SELLER NON-RESPONSE:
- If a seller doesn't respond to a case within 48 hours, Etsy may intervene.
- Etsy may issue a refund on the seller's behalf.

REGIONAL PROTECTIONS:
- EU sellers must comply with EU consumer protection laws.
- 14-day right of withdrawal for most purchases from EU-based sellers.`
  },
  {
    id: "fraud-policy",
    title: "E-commerce Fraud Prevention and Account Security Policy",
    category: "disputes",
    sourceUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=GDFU3JS5AL6SYHRD",
    accessedDate: "2026-03-27",
    content: `Fraud Prevention and Account Security

UNAUTHORIZED ACCOUNT ACCESS:
- If you suspect your account has been compromised, change your password immediately.
- Contact customer service to report unauthorized access.
- Review recent orders and report any orders you did not place.
- Two-factor authentication (2FA) is strongly recommended.

UNAUTHORIZED CHARGES:
- Report unauthorized charges to Amazon customer service immediately.
- Also notify your bank/credit card company to dispute the charge.
- Amazon will investigate and issue a refund for confirmed unauthorized transactions.
- Investigation may take 3-5 business days.

FRAUD RED FLAGS:
- Orders to addresses not associated with your account.
- Orders placed from unusual geographic locations or IP addresses.
- Multiple failed payment attempts.
- Phishing emails asking for account credentials — Amazon will never ask for your password via email.

IDENTITY THEFT:
- If your identity has been stolen, file a report with the FTC at IdentityTheft.gov.
- Contact Amazon to flag your account for enhanced review.
- Law enforcement report may be required for high-value fraud claims.

SELLER FRAUD:
- Counterfeit or inauthentic items: Report to Amazon for full refund and investigation.
- Fake tracking numbers: A-to-Z Guarantee applies.
- Sellers misrepresenting items: SNAD claim through A-to-Z Guarantee.

CHARGEBACK POLICY:
- Filing a credit card chargeback without contacting Amazon first is a violation of Amazon's terms.
- Amazon prefers to resolve disputes directly.
- Abusing chargebacks may result in account restrictions.

SENSITIVE DATA PROTECTION:
- Amazon does not store full credit card numbers.
- Payment information is encrypted and PCI-DSS compliant.
- Amazon will never send full payment details via email.`
  },
  {
    id: "amazon-final-sale",
    title: "Amazon Final Sale and Non-Returnable Items Policy",
    category: "returns_refunds",
    sourceUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=G4S2JNAP5HLDQ5G3",
    accessedDate: "2026-03-27",
    content: `Final Sale and Non-Returnable Items

FINAL SALE DEFINITION:
- Items marked as "Final Sale" or "Non-Returnable" at the time of purchase.
- These items cannot be returned for any reason except manufacturer defect or significant misrepresentation.
- Final Sale items include: clearance merchandise, last-chance deals, some Warehouse Deals.

NON-RETURNABLE CATEGORIES (regardless of final sale marking):
1. Downloadable software once activated
2. Online subscriptions once activated
3. Gift cards and prepaid cards
4. Opened computer software, DVDs, Blu-ray discs, CDs, and video games
5. Items that are hazardous or cannot be shipped
6. Live plants and insects
7. Grocery, gourmet food items (perishables)
8. Some health and personal care items (if opened)
9. Custom engraved or personalized items
10. Loose gemstones

DEFECTIVE FINAL SALE ITEMS:
- Even Final Sale items may be eligible for a refund if they arrive defective or broken.
- The item must be reported within 30 days of delivery.
- Amazon will review on a case-by-case basis — not guaranteed.
- Customer must provide evidence of defect.

MARKETPLACE SELLER FINAL SALE:
- Marketplace sellers may have their own final sale designations.
- Third-party final sale items still covered by A-to-Z Guarantee for SNAD cases.
- Seller's final sale policy must be disclosed before purchase.

IMPORTANT NOTICE:
- Purchasing a Final Sale item indicates acceptance that the item cannot be returned.
- Final Sale items discounted heavily in recognition of no-return restriction.
- Amazon support agents cannot override the Final Sale designation for non-defective items.`
  },
  {
    id: "consumer-protection-us",
    title: "US Consumer Protection Laws and E-commerce Rights",
    category: "returns_refunds",
    sourceUrl: "https://www.ftc.gov/business-guidance/resources/businesspersons-guide-federal-warranty-law",
    accessedDate: "2026-03-27",
    content: `US Consumer Protection for E-commerce

FTC MAIL / ONLINE ORDER RULE:
- Merchants must ship within the timeframe they promise, or within 30 days if not specified.
- If unable to ship on time, must notify customer and offer cancellation.
- Customer must be refunded within 7 business days if they cancel.

MAGNUSON-MOSS WARRANTY ACT:
- Products with written warranties must honor them.
- "Full" warranties: must repair or replace a defective product within a reasonable time.
- "Limited" warranties: may have conditions; must be clearly disclosed.
- Implied warranty of merchantability: items must work for their intended purpose.

CREDIT CARD CHARGEBACKS (FAIR CREDIT BILLING ACT):
- Cardholders can dispute charges for: billing errors, items not delivered, items significantly different from description.
- Must dispute within 60 days of the statement containing the charge.
- Card issuer must investigate within 30 days.
- Consumer not liable for disputed amount during investigation.

STATE LAWS:
- Some states have stronger consumer protections:
  - California: Implied warranties cannot be disclaimed for consumer goods.
  - New York: Strong lemon law protections for vehicles.
  - Many states: cooling-off periods for door-to-door sales.

WHAT MERCHANTS CANNOT DO:
- Cannot enforce a "no returns" policy for items that are defective.
- Cannot misrepresent return policies.
- Cannot bait-and-switch (advertise one item, deliver inferior item).
- Cannot refuse refunds for items significantly not as described.

DIGITAL GOODS:
- No specific federal law mandates refunds for digital goods once accessed.
- Platform terms of service govern most digital disputes.
- Chargebacks still available as consumer remedy.`
  }
];

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2);
}

const STOPWORDS = new Set([
  "the", "and", "for", "this", "that", "with", "from", "are", "not", "may",
  "can", "will", "have", "has", "been", "was", "were", "you", "your", "our",
  "all", "any", "but", "also", "more", "some", "than", "their", "they",
  "one", "two", "per", "its", "must", "should", "does", "did", "within",
  "after", "before", "order", "item", "items"
]);

function getKeywords(text: string): string[] {
  return tokenize(text).filter(w => !STOPWORDS.has(w));
}

function chunkDocument(doc: PolicyDocument): PolicyChunk[] {
  const chunks: PolicyChunk[] = [];
  const paragraphs = doc.content.split(/\n\n+/).filter(p => p.trim().length > 50);

  let currentSection = "General";
  let chunkIndex = 0;

  for (const para of paragraphs) {
    const lines = para.trim().split("\n");
    const firstLine = lines[0].trim();

    if (firstLine.match(/^[A-Z][A-Z\s\/\-()]+:?$/) && firstLine.length < 80) {
      currentSection = firstLine.replace(/:$/, "");
    }

    const text = para.trim();
    if (text.length < 50) continue;

    chunks.push({
      id: `${doc.id}-chunk-${chunkIndex}`,
      documentId: doc.id,
      title: doc.title,
      category: doc.category,
      section: currentSection,
      text,
      sourceUrl: doc.sourceUrl,
      accessedDate: doc.accessedDate,
      keywords: getKeywords(text),
    });
    chunkIndex++;
  }

  return chunks;
}

let _chunks: PolicyChunk[] | null = null;

export function getAllChunks(): PolicyChunk[] {
  if (_chunks) return _chunks;
  _chunks = POLICIES_RAW.flatMap(chunkDocument);
  return _chunks;
}

export function getAllDocuments(): PolicyDocument[] {
  return POLICIES_RAW;
}

export function retrieveRelevantChunks(query: string, topK: number = 5): PolicyChunk[] {
  const chunks = getAllChunks();
  const queryKeywords = getKeywords(query);

  const scores = chunks.map(chunk => {
    let score = 0;
    const chunkKeywordSet = new Set(chunk.keywords);

    for (const qw of queryKeywords) {
      if (chunkKeywordSet.has(qw)) {
        score += 2;
      }
      for (const cw of chunk.keywords) {
        if (cw.startsWith(qw) || qw.startsWith(cw)) {
          score += 1;
        }
      }
    }

    const queryLower = query.toLowerCase();
    if (chunk.text.toLowerCase().includes(queryLower.substring(0, 20))) {
      score += 3;
    }
    if (chunk.title.toLowerCase().includes(queryLower)) {
      score += 4;
    }

    return { chunk, score };
  });

  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk);
}

export function retrieveByCategory(category: string, query: string, topK: number = 5): PolicyChunk[] {
  const chunks = getAllChunks().filter(c => c.category === category);
  const queryKeywords = getKeywords(query);

  const scores = chunks.map(chunk => {
    let score = 0;
    const chunkKeywordSet = new Set(chunk.keywords);
    for (const qw of queryKeywords) {
      if (chunkKeywordSet.has(qw)) score += 2;
    }
    return { chunk, score };
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk);
}
