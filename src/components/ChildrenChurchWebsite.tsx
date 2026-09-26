import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Smile,
  Baby,
  Star,
  Award,
  ChevronRight,
  ChevronDown,
  PhoneCall,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  Lightbulb,
  Music,
  Compass,
  ArrowRight,
  Building2,
  Lock,
} from 'lucide-react';
import { BranchTenant, DepartmentConfig, ServiceConfig, ActiveTab } from '../types';
import { ChurchLogo } from './ChurchLogo';

interface ChildrenChurchWebsiteProps {
  currentBranch: BranchTenant;
  branches: BranchTenant[];
  departments: DepartmentConfig[];
  services: ServiceConfig[];
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectBranch: (branchId: string) => void;
  checkedInCount: number;
}

export const ChildrenChurchWebsite: React.FC<ChildrenChurchWebsiteProps> = ({
  currentBranch,
  branches,
  departments,
  services,
  onNavigateTab,
  onSelectBranch,
  checkedInCount,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedClassTab, setSelectedClassTab] = useState<string>('all');

  const faqs = [
    {
      q: 'How does the Sunday morning check-in and security process work?',
      a: 'When you arrive at the Children Church desk, our ushers will check in your child via our digital system. A personalized name tag is printed for your child, and a matching Parent Security Claim Slip with a unique security code (e.g. TCN-4892) is issued to you. At pickup, your claim slip is verified before your child can be released.',
    },
    {
      q: 'Can parents come into the classrooms during the service?',
      a: 'To maintain the highest security and child protection standards, only screened, background-checked church teachers and volunteers are permitted inside the learning areas. If your child needs you at any point, our team will immediately alert you via SMS or a desk notice.',
    },
    {
      q: 'What if my child has food allergies or medical considerations?',
      a: 'Our digital registry records all allergy and medical alerts. When your child is checked in, their medical warning is prominently flagged on their desk slip and classroom roster so teachers ensure complete care and safety.',
    },
    {
      q: 'What should my child bring on Sunday morning?',
      a: 'Just a willing heart! We encourage children in Faith Explorers and Kingdom Builders to bring their personal Bibles and notebooks. For infants in Creche, please pack a labeled diaper bag with extra diapers, wipes, and a clearly labeled feeding bottle.',
    },
    {
      q: 'What happens if I lose my Parent Claim Slip?',
      a: 'Safety is our absolute priority. If a claim slip is misplaced, you will need to present an official government photo ID and your identity will be verified against the registered emergency parent contact in our database before checkout is approved.',
    },
  ];

  const corePillars = [
    {
      icon: <BookOpen className="w-6 h-6 text-amber-500" />,
      title: 'Word & Spirit Foundation',
      desc: 'Grounding every boy and girl in the unshakeable Word of God through scripture memorization, Bible character studies, and Holy Spirit guidance.',
      color: 'border-amber-500/30 bg-amber-500/5',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: 'Uncompromising Child Safety',
      desc: 'Digital check-in slips with matching security verification codes, sanitized age-appropriate classrooms, and thoroughly vetted teachers.',
      color: 'border-emerald-500/30 bg-emerald-500/5',
    },
    {
      icon: <Music className="w-6 h-6 text-indigo-500" />,
      title: 'Joyful & Creative Worship',
      desc: 'High-energy praise, worship expressions, Bible drama, and interactive arts that make church an exhilarating experience children love.',
      color: 'border-indigo-500/30 bg-indigo-500/5',
    },
    {
      icon: <Award className="w-6 h-6 text-rose-500" />,
      title: 'Character & Godly Leadership',
      desc: 'Equipping young minds with biblical ethics, kindness, integrity, courage, and excellence to excel at school, at home, and in society.',
      color: 'border-rose-500/30 bg-rose-500/5',
    },
  ];

  const classDescriptions = [
    {
      id: 'creche',
      badge: 'Ages 0 - 2 Years',
      name: 'Kingdom Sprouts (Creche)',
      target: 'Infants & Toddlers',
      summary: 'A peaceful, loving sanctuary with dedicated nursing pods, sterilized sensory play, and soothing praise lullabies.',
      highlights: ['1:2 Caregiver to infant ratio', 'Clean sanitized environment', 'Safe crawl mats & soft toys'],
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 border-amber-200',
    },
    {
      id: 'prek',
      badge: 'Ages 3 - 5 Years',
      name: 'Little Champions',
      target: 'Nursery & Pre-Schoolers',
      summary: 'Enthusiastic discovery through interactive Bible parables, cheerful songs, motor-skill games, and creative coloring.',
      highlights: ['Illustrated Bible storytelling', 'Action praise songs', 'Healthy snack breaks'],
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'juniors',
      badge: 'Ages 6 - 9 Years',
      name: 'Faith Explorers',
      target: 'Primary & Junior Grades',
      summary: 'Hands-on scripture study, memory verse competitions, prayer circles, and understanding faith in daily school life.',
      highlights: ['Sword drills (Bible lookups)', 'Small-group prayer time', 'Character building challenges'],
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 border-emerald-200',
    },
    {
      id: 'preteens',
      badge: 'Ages 10 - 12+ Years',
      name: 'Kingdom Builders',
      target: 'Pre-Teens & Tweens',
      summary: 'Equipping pre-teens with solid biblical worldview, moral compass, godly friendships, and transition to youth church.',
      highlights: ['Relevant real-world Q&A', 'Leadership responsibilities', 'Teens ministry mentorship'],
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 animate-in fade-in">
      
      {/* 1. HERO SHOWCASE SECTION */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-gradient-to-br from-[#0c121e] via-[#141d30] to-[#1c1815] text-white p-6 sm:p-10 lg:p-14 border border-amber-500/20 shadow-2xl">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>THE COVENANT NATION CHILDREN'S CHURCH</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Parish: {currentBranch.churchName}</span>
            </span>
            {checkedInCount > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                <UserCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>{checkedInCount} Children Currently in Class</span>
              </span>
            )}
          </div>

          {/* Hero Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Raising Champions in Christ,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                Guarding Every Step.
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Welcome to the vibrant, Christ-centered, and secure children’s ministry of{' '}
              <strong className="text-white font-semibold">{currentBranch.churchName}</strong>. 
              We partner with parents to nurture joyful faith, sharp intellect, and moral excellence in every child.
            </p>
          </div>

          {/* Scripture Anchor Quote */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-2xl">
            <p className="italic text-xs sm:text-sm text-slate-200">
              "Train up a child in the way he should go, and when he is old he will not depart from it."
            </p>
            <span className="block mt-1 text-xs font-bold text-amber-400">— Proverbs 22:6</span>
          </div>

          {/* Quick Action Navigation CTAs for Staff */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab('check-in')}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>Open Sunday Check-In Desk</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('check-out')}
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Parent Pickup & Check-Out</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('children')}
              className="px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Children Registry ({departments.length} Classes)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS & AT-A-GLANCE METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{departments.length || 4}</div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Age Departments</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Creche to Pre-Teens</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Child Safety Tag</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Matching Parent Claim Code</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{services.length || 2}</div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Weekly Services</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{currentBranch.schedules[0]?.time || '8:00 AM & 10:30 AM'}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{branches.length}</div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Church Parishes</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Unified Safeguarding Portal</div>
          </div>
        </div>
      </section>

      {/* 3. SENIOR PASTOR MESSAGE & MINISTRY HEART */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/10 p-2 border-2 border-amber-400/40 flex items-center justify-center shrink-0 shadow-lg">
            <ChurchLogo className="w-full h-full object-contain" />
          </div>
          <div className="space-y-3 flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              <span>MINISTRY VISION FROM LEADERSHIP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              "We Don't Just Babysit — We Build Destiny."
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
              At The Covenant Nation, we believe children are not the church of tomorrow; they are the church of today. 
              Our classrooms are dynamic centers of spiritual revelation, joyful fellowship, and character formation. 
              Under the leadership of <strong className="text-white">Pastor Poju Oyemade</strong> and <strong className="text-white">Pastor Toyin Poju-Oyemade</strong>, 
              we invest wholeheartedly into safe spaces where your children encounter God’s love early in life.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-amber-300 font-semibold">
              <span>Senior Pastor: {currentBranch.pastorInCharge || 'Pastor Poju Oyemade'}</span>
              <span>•</span>
              <span>Children Ministry: {currentBranch.childrenPastor || 'Children Ministry Coordinator'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR 4 CORE MINISTRY PILLARS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Why Parents Trust Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Our 4 Pillars of Excellence
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Every program, curriculum, and Sunday lesson is intentionally engineered upon these biblical standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {corePillars.map((pillar, i) => (
            <div
              key={i}
              className={`p-5 sm:p-6 rounded-2xl border ${pillar.color} bg-white shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-2xs">
                  {pillar.icon}
                </div>
                <h3 className="font-extrabold text-base text-slate-900">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active in all classes</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AGE EXPERIENCES & CLASSROOMS */}
      <section className="space-y-6 bg-slate-100/70 p-6 sm:p-10 rounded-3xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Tailored by Development Age
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Classrooms & Age Experiences
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Each child is placed into an age-appropriate environment designed specifically for their emotional, social, and spiritual stage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('children')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-xs sm:text-sm font-bold text-slate-800 shadow-xs flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
          >
            <span>Manage Classes & Rosters</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {classDescriptions.map((cls) => (
            <div
              key={cls.id}
              className={`rounded-2xl border p-5 sm:p-6 bg-white shadow-xs space-y-4 hover:border-amber-300 transition`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-900 text-white">
                  {cls.badge}
                </span>
                <span className="text-xs font-bold text-slate-500">{cls.target}</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{cls.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {cls.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Class Highlights:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs text-slate-700">
                  {cls.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="text-[11px] font-medium truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CHILD SAFEGUARDING PROTOCOL (THE 4-STEP SAFETY PROMISE) */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Child Protection Policy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Our 4-Step Safety & Security Standard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Parents enjoy Sunday service with complete peace of mind knowing their precious children are safe, supervised, and strictly guarded.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
              1
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Digital Check-In</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every child is checked in through our secure system. Medical notes, allergies, and emergency parent contacts are confirmed on the spot.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
              2
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Parent Claim Slip</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A printed security slip with an encrypted pickup code is issued exclusively to the parent. The child wears a corresponding badge.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
              3
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Vetted Ministry Team</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Only trained, church-verified volunteers with active background clearances are permitted to interact with children in classes.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
              4
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Matching Code Checkout</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No child is released under any circumstance without verifying the matching security slip code with the attendance desk supervisor.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SUNDAY CURRICULUM & FAMILY DEVOTIONAL CARD */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/40 rounded-3xl p-6 sm:p-10 border border-amber-300/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-3 py-0.5 rounded-full">
              This Month's Bible Theme
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950">
              "Walking in Divine Wisdom, Favor & Courage"
            </h3>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 text-xs font-bold text-amber-900 shadow-2xs self-start md:self-auto">
            Weekly Memory Verse: Proverbs 3:5-6
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-xs space-y-4">
          <div className="border-l-4 border-amber-500 pl-4 space-y-1">
            <p className="text-sm sm:text-base font-medium text-slate-800 italic">
              "Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths."
            </p>
            <span className="text-xs font-bold text-amber-700 not-italic block">— Proverbs 3:5-6 (NKJV)</span>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Parent Car-Ride Discussion Question:</span>
              </span>
              <p className="text-slate-600">
                Ask your child: "Can you share one time this past week you prayed to Jesus when you were feeling unsure or afraid?"
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Weekly Family Action Step:</span>
              </span>
              <p className="text-slate-600">
                Read Daniel chapter 1 together this Tuesday evening and celebrate choosing wisdom and integrity over peer pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SUNDAY SERVICE SCHEDULE & PARISH LOCATIONS */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Service Times & Venues</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              When & Where We Gather
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Multi-Tenant Network: <strong className="text-slate-800 font-bold">{branches.length} Active Parishes</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-2xl border transition space-y-3 cursor-pointer ${
                b.id === currentBranch.id
                  ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              onClick={() => onSelectBranch(b.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  {b.city}
                </span>
                {b.id === currentBranch.id && (
                  <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Current Desk</span>
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{b.name}</h4>
                <p className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{b.branchVenue}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                <span className="font-semibold text-slate-700">Sunday Schedule:</span>
                <div className="flex flex-wrap gap-1.5">
                  {b.schedules.map((sc, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-medium text-slate-700"
                    >
                      {sc.label}: {sc.time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. PARENT FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about preparing your child for Sunday morning at The Covenant Nation.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 font-bold text-sm sm:text-base text-slate-900 hover:text-amber-600 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                    activeFaq === index ? 'rotate-180 text-amber-500' : ''
                  }`}
                />
              </button>
              {activeFaq === index && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. BOTTOM ATTENDANCE SYSTEM LAUNCHER */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-blue-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>STAFF & TEACHERS WORKBENCH</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready for Sunday Morning Attendance?
          </h3>
          <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
            Switch directly to the live check-in desk, print parent claim slips, look up students in the registry, or view real-time class attendance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('check-in')}
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-slate-950" />
            <span>Launch Check-In Desk</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Attendance Reports</span>
          </button>
        </div>
      </section>

    </div>
  );
};
