/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Logo from "@/components/logo";
import { Sparkles, PlusCircle, Users, ArrowLeft } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface AdminData {
  fullName: string;
  email: string;
  role?: string;
}

const retentionData = [
  { day: "सोम", students: 120 }, { day: "मंगल", students: 145 },
  { day: "बुध", students: 132 }, { day: "गुरु", students: 180 },
  { day: "शुक्र", students: 210 }, { day: "शनि", students: 250 },
  { day: "रवि", students: 285 },
];

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        window.location.replace("/");
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, "students", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as AdminData;
          
          // 🔥 STRICT ADMIN CHECK: अगर Admin नहीं है, तो Student Dashboard पर भेज दो
          if (data.role?.trim().toLowerCase() !== "admin") {
            window.location.replace("/dashboard");
            return;
          }
          setAdminData(data);
        } else {
          window.location.replace("/");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        window.location.replace("/");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🛡️</span>
            </div>
          </div>
          <p className="text-slate-600 font-medium animate-pulse">Admin Panel लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!adminData) return null;

  return (
    <div className="min-h-[100dvh] bg-slate-50 relative font-sans w-full overflow-x-hidden">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Student View">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <Logo size="medium" showText={true} />
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{adminData.fullName}</p>
                  <p className="text-xs text-indigo-600 font-semibold">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {adminData.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100">
                लॉगआउट
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section className="mb-12 bg-white border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-3 border border-indigo-100">
                <Sparkles className="w-4 h-4" /> क्रिएटर मोड (Admin)
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">एडमिन डैशबोर्ड</h2>
              <p className="text-slate-500 text-sm mt-1">वापसी पर स्वागत है, {adminData.fullName}। यहाँ आपका प्लेटफ़ॉर्म अवलोकन है।</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95">
              <PlusCircle className="w-5 h-5" /> नई पोस्ट / क्लास बनाएं
            </button>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                छात्र प्रतिधारण और दैनिक सक्रिय उपयोगकर्ता
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retentionData}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#fff'}} />
                    <Area type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-2"><Users className="w-4 h-4"/> कुल नामांकित छात्र</p>
                <p className="text-3xl sm:text-4xl font-extrabold">12,450+</p>
                <p className="text-blue-200 text-xs mt-2 flex items-center gap-1">↑ पिछले महीने से 12%</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-slate-500 text-sm font-medium mb-1">सक्रिय कोर्सेस</p>
                <p className="text-3xl font-extrabold text-slate-900">8</p>
                <p className="text-slate-400 text-xs mt-2">मैट्रिक और इंटर बैच</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}