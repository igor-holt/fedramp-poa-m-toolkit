// Copy this file to billing-config.js (same directory as index.html) and fill in
// your Stripe Payment Links. billing-config.js is loaded by index.html and is
// gitignored so live payment links are not committed.
//
// Create Payment Links in the Stripe Dashboard:
//   Products -> Add product -> "FedRAMP Toolkit Pro" -> $49/mo recurring -> "Create payment link"
//   Products -> Add product -> "FedRAMP Toolkit Enterprise" -> $299/mo recurring -> "Create payment link"
window.FEDRAMP_BILLING = {
  proPaymentLink: "https://buy.stripe.com/YOUR_PRO_LINK",
  enterprisePaymentLink: "https://buy.stripe.com/YOUR_ENTERPRISE_LINK",
};
