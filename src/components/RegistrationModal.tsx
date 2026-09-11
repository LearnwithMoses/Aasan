import React, { useState } from "react";
import { registerFreeTrial } from "../data/storage.ts";
import { UserProfile } from "../types.ts";
import { Sparkles, ShieldCheck, Heart, School, Phone, User, MapPin, X } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Please provide your Name and Phone / WhatsApp number.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Register on server safely
      await fetch("/api/register-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, school, phone, bloodGroup, address }),
      }).catch(() => null);

      // Register in local client state for 30 days
      const profile = registerFreeTrial({ name, school, phone, bloodGroup, address });
      onSuccess(profile);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to register trial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5 text-[#d9ad57]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Activate 1 Month Free Pro Pass</h3>
            <p className="text-xs text-slate-500">
              Enjoy all premium facilities free for your first 30 days!
            </p>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 my-3 text-xs text-emerald-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>30 Days Full Access Unlocked:</strong> Aasaan Master Analytical Engine (ஆசான் மேதை), 1-Click Printable Student Worksheets, 3-Column Blackboard Organizer, Board Question Paper Generator, and Word (.DOC) Export!
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-lg mb-3 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mrs. Priya Sharma / Mr. Rajesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101827]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <School className="w-3 h-3 text-slate-400" />
                School / Institution Name
              </label>
              <input
                type="text"
                placeholder="e.g. Kendriya Vidyalaya / St. Marys"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101827]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                Phone / WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101827]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" />
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101827] bg-white font-medium"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Chennai, Tamil Nadu"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#101827]"
              />
            </div>
          </div>

          {/* User Requested Mandatory Disclaimer */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-[11.5px] text-amber-950 leading-relaxed">
            <strong className="block text-amber-900 font-semibold mb-0.5">Disclaimer:</strong>
            The details collected are strictly used to keep you in touch in the future for further updates and pedagogical resources.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-[#101827] hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Activating Pass...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#d9ad57]" />
                <span>Activate 1 Month Free Pro Pass</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
