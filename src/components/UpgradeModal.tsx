import React, { useState } from "react";
import { activateSubscription, getUserProfile } from "../data/storage.ts";
import { UserProfile } from "../types.ts";
import {
  Sparkles,
  CheckCircle2,
  QrCode,
  Smartphone,
  ShieldAlert,
  X,
  CreditCard,
  Gift,
} from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegistration: () => void;
  onSubscriptionSuccess: (profile: UserProfile) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onOpenRegistration,
  onSubscriptionSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [showUpiDetails, setShowUpiDetails] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const profile = getUserProfile();
  const hasClaimedTrial = Boolean(profile?.registeredAt);

  const amount = selectedPlan === "monthly" ? 50 : 499;
  const planLabel = selectedPlan === "monthly" ? "₹50 / Month" : "₹499 / Academic Year";

  // Option 1 UPI Link format
  const upiId = "nathanvelmoses@upi"; // Bank UPI ID
  const upiPaymentUri = `upi://pay?pa=${upiId}&pn=AasaanStudio&am=${amount}&cu=INR&tn=AasaanProSub`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    upiPaymentUri
  )}`;

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const updated = activateSubscription(selectedPlan);
      setConfirmed(true);
      setTimeout(() => {
        onSubscriptionSuccess(updated);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Free trial callout if not yet registered */}
        {!hasClaimedTrial && (
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl shadow-md flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="font-bold text-xs">First Month Free Offer!</div>
                <div className="text-[11px] opacity-90">
                  Register your basic details and get 30 days of Pro completely free.
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenRegistration();
              }}
              className="px-3 py-1.5 bg-white text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-50 transition shadow-sm whitespace-nowrap"
            >
              Get Free Month
            </button>
          </div>
        )}

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[#d9ad57]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Teacher Pro Subscription</h3>
            <p className="text-xs text-slate-500">
              Save hours of prep every week for just ₹50/month
            </p>
          </div>
        </div>

        {/* Facilities Checklist */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-3 text-xs space-y-1.5">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1 text-slate-500">
            Included Premium Facilities:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Aasaan Master Analytical Engine (ஆசான்)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="font-bold text-purple-900">Board Exam Question Paper &amp; Blueprint</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="font-bold text-amber-900">Past 10 Years Board Bank (PYQ)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Classroom Explanation Script</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Printable Student Worksheets</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>3-Panel Blackboard Layout</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>All Indian Languages (Tamil, Kannada, etc.)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Export to Word (.DOC)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>&ldquo;My Lesson Vault&rdquo; Library</span>
            </div>
          </div>
        </div>

        {/* Pricing Selection */}
        <div className="grid grid-cols-2 gap-3 my-3">
          <button
            type="button"
            onClick={() => setSelectedPlan("monthly")}
            className={`p-3 rounded-xl border text-left transition ${
              selectedPlan === "monthly"
                ? "border-slate-900 bg-slate-900 text-white shadow-md"
                : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
            }`}
          >
            <div className="text-[11px] font-medium opacity-80">Monthly Pass</div>
            <div className="text-lg font-black mt-0.5">₹50<span className="text-xs font-normal"> / mo</span></div>
            <div className="text-[10px] mt-1 opacity-75">Pay every month</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPlan("yearly")}
            className={`p-3 rounded-xl border text-left transition relative ${
              selectedPlan === "yearly"
                ? "border-slate-900 bg-slate-900 text-white shadow-md"
                : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
            }`}
          >
            <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] font-extrabold rounded-full">
              SAVE 17%
            </span>
            <div className="text-[11px] font-medium opacity-80">Annual Academic Pass</div>
            <div className="text-lg font-black mt-0.5">₹499<span className="text-xs font-normal"> / yr</span></div>
            <div className="text-[10px] mt-1 opacity-75">Full school year (~₹41/mo)</div>
          </button>
        </div>

        {/* Option 1 Direct UPI Payment Details */}
        {!showUpiDetails ? (
          <div className="space-y-2 mt-4">
            <button
              type="button"
              onClick={() => setShowUpiDetails(true)}
              className="w-full py-3 px-4 bg-[#101827] hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-[#d9ad57]" />
              <span>Pay {planLabel} via UPI (GPay / PhonePe / QR)</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Transfers directly to bank account via UPI. Instant activation.
            </p>
          </div>
        ) : (
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-600" />
                Scan QR or Pay to UPI ID
              </span>
              <span className="text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                ₹{amount}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 mb-3">
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                className="w-32 h-32 rounded-lg border border-slate-100 shadow-sm"
              />
              <div className="text-xs space-y-1.5 text-center sm:text-left">
                <div className="text-slate-500 text-[11px]">Direct Bank UPI ID:</div>
                <div className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block select-all text-xs">
                  {upiId}
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Works with Google Pay, PhonePe, Paytm, BHIM, or any banking app.
                </div>
                <a
                  href={upiPaymentUri}
                  className="inline-block mt-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                >
                  Open UPI App (Mobile)
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  UPI Reference / UTR Number (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 412345678901 (from your GPay/PhonePe receipt)"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                />
              </div>

              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isVerifying || confirmed}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
              >
                {confirmed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment Confirmed! Pro Activated</span>
                  </>
                ) : isVerifying ? (
                  <span>Verifying Payment...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I have Paid ₹{amount} · Activate Pro Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
