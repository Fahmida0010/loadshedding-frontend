'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Zap,
  ShieldCheck,
} from 'lucide-react';


export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields (Name, Email, Message)!',
      });
      return;
    }

    setLoading(true);

    // Simulate form submission delay
    setTimeout(() => {
      setLoading(false);
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Thank you for reaching out. Our support team will get back to you soon.',
        timer: 3000,
        showConfirmButton: false,
      });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <section className="relative mb-10 overflow-hidden rounded-3xl bg-slate-950 shadow-xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2000&auto=format&fit=crop"
              alt="Electric power transmission"
              className="h-full w-full object-cover object-center"
            />

            {/* Dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/45" />

            {/* Green/blue glow */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          </div>

          {/* Header Content */}
          <div className="relative z-10 px-6 py-16 text-center md:px-12 md:py-20">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 backdrop-blur-md">
              <Zap className="h-7 w-7 text-emerald-400" />
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Power Support Center
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Get in Touch with Us
              <span className="ml-2 text-emerald-400">⚡</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
              Have questions regarding load-shedding schedules, power outages,
              or billing issues? Send us a message and our support team will
              assist you.
            </p>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* ================= CONTACT INFO ================= */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:col-span-1 md:p-8">
            {/* Decorative glow */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100 blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Zap className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Contact Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    We are here to help
                  </p>
                </div>
              </div>

              <p className="mb-7 text-sm leading-6 text-slate-600">
                Reach out to us through any of these channels or visit our
                regional office.
              </p>

              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Office
                    </p>
                    <p className="text-sm leading-6 text-slate-700">
                      Power Grid Building, 12/A, Central Road, Dhaka,
                      Bangladesh
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    <Phone className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      +880 9612-345678
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                    <Mail className="h-5 w-5 text-violet-600" />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </p>
                    <p className="break-all text-sm font-medium text-slate-700">
                      support@loadshedding.gov.bd
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Working Hours
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      Sat - Thu: 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Box */}
              <div className="mt-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-blue-50 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />

                  <span className="text-sm font-bold text-slate-800">
                    24/7 Emergency Support
                  </span>
                </div>

                <p className="text-xs leading-5 text-slate-600">
                  Emergency Hotline available 24/7 for unexpected grid failure
                  reports.
                </p>
              </div>
            </div>
          </div>

          {/* ================= CONTACT FORM ================= */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:col-span-2 md:p-9">
            {/* Form Header */}
            <div className="mb-8">
              <div className="mb-2 inline-flex rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                CONTACT SUPPORT
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                Send Us a Message
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                We typically reply within 24 business hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Your Name *
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Email Address *
                  </label>

                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    required
                  />
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    placeholder="+8801XXXXXXXXX"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Subject
                  </label>

                  <input
                    type="text"
                    placeholder="e.g., Billing Issue or Schedule Inquiry"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Message *
                </label>

                <textarea
                  rows={5}
                  placeholder="Write your message or query in detail..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:from-blue-700 hover:to-emerald-600 hover:shadow-xl hover:shadow-blue-500/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  'Sending Message...'
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}