import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { api } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

const PROPERTY_TYPES = ["Apartment", "Villa", "Flat", "House", "Estate", "Plot"];

const initialState = {
  title: "", location: "", address: "", type: "",
  price: "", bedrooms: "", bathrooms: "", area_sqft: "", description: "",
};

function Field({ label, children, span = false }) {
  return (
    <label className={`block ${span ? "sm:col-span-2" : ""}`}>
      <span className="block text-xs font-mono uppercase tracking-wide text-ink/60 dark:text-paper/60 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "w-full bg-transparent border border-ink/20 dark:border-chalk/30 px-3 py-2.5 text-sm font-body focus:border-brass transition-colors";

export default function AddPropertyForm({ onCreated, token }) {
  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

  function handleFiles(e) {
    const picked = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...picked].slice(0, 8));
  }

  function removeFile(index) { setFiles((prev) => prev.filter((_, i) => i !== index)); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.location || !form.type || !form.price || !form.description) {
      addToast("Please fill in title, location, type, price, and description.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      files.forEach((file) => data.append("images", file));
      await api.createProperty(data, token);
      addToast("Property listed successfully.", "success");
      setForm(initialState);
      setFiles([]);
      onCreated?.();
    } catch (err) {
      addToast(err.message || "Could not save this property.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="border border-ink/15 dark:border-chalk/20 p-5 sm:p-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Title" span>
          <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. 2BHK Apartment near Marina Beach" className={inputClass} required />
        </Field>
        <Field label="City">
          <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Chennai" className={inputClass} required />
        </Field>
        <Field label="Address (optional)">
          <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)}
            placeholder="e.g. Besant Nagar" className={inputClass} />
        </Field>
        <Field label="Property type">
          <select value={form.type} onChange={(e) => update("type", e.target.value)} className={inputClass} required>
            <option value="" disabled>Choose a type…</option>
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Price (₹)">
          <input type="number" min="1" value={form.price} onChange={(e) => update("price", e.target.value)}
            placeholder="e.g. 6500000" className={`${inputClass} font-mono`} required />
        </Field>
        <Field label="Bedrooms">
          <input type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)}
            className={`${inputClass} font-mono`} />
        </Field>
        <Field label="Bathrooms">
          <input type="number" min="0" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)}
            className={`${inputClass} font-mono`} />
        </Field>
        <Field label="Area (sqft)" span>
          <input type="number" min="0" value={form.area_sqft} onChange={(e) => update("area_sqft", e.target.value)}
            className={`${inputClass} font-mono`} />
        </Field>
        <Field label="Description" span>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
            rows={4} placeholder="What makes this place worth a visit?" className={inputClass} required />
        </Field>
        <Field label="Photos (up to 8)" span>
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-ink/25 dark:border-chalk/30 px-4 py-6 cursor-pointer hover:border-brass transition-colors">
            <UploadCloud size={20} className="text-ink/50 dark:text-paper/50" />
            <span className="text-sm text-ink/60 dark:text-paper/60">Click to choose images</span>
            <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
          </label>
          {files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {files.map((file, i) => (
                <div key={`${file.name}-${i}`} className="relative w-20 h-20">
                  <img src={URL.createObjectURL(file)} alt={file.name}
                    className="w-full h-full object-cover border border-ink/15 dark:border-chalk/20" />
                  <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${file.name}`}
                    className="absolute -top-2 -right-2 bg-navy-deep text-paper rounded-full p-0.5">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>
      </div>

      <button type="submit" disabled={submitting}
        className="mt-6 inline-flex items-center gap-2 bg-brass hover:bg-brass-light disabled:opacity-60 text-navy-deep font-body font-medium px-6 py-2.5 transition-colors">
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? "Saving…" : "List this property"}
      </button>
    </motion.form>
  );
}
