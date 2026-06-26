"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Globe2,
  Send,
  Leaf,
  LifeBuoy,
  Mail,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Waves,
  X,
} from "lucide-react";
import HeroWave from "./HeroWave";

const missions = [
  { icon: Trophy, number: "01", title: "COMPETITION", ja: "競技・大会運営", text: "公正で熱量のある大会を設計し、千葉から世界へ挑む選手を支えます。" },
  { icon: Users, number: "02", title: "NEXT GENERATION", ja: "選手育成・普及", text: "次世代が海と出会い、競技を続けられる育成環境を地域とつくります。" },
  { icon: Leaf, number: "03", title: "BLUE ACTION", ja: "環境保全", text: "ビーチクリーンを入口に、海を使う責任を行動へ変えていきます。" },
  { icon: ShieldCheck, number: "04", title: "SAFETY & RULES", ja: "安全・ルール啓発", text: "知識とマナーを広げ、誰もが海を尊重できる文化を育てます。" },
  { icon: Globe2, number: "05", title: "LOCAL IMPACT", ja: "地域・観光振興", text: "スポーツ、観光、環境をつなぎ、千葉の沿岸地域に新しい価値を生みます。" },
];

const events = [
  { date: "COMING SOON", tag: "COMPETITION", title: "県内大会情報", place: "CHIBA COAST", text: "大会日程、エントリー、ヒート表、結果を一か所で確認できる情報基盤へ。" },
  { date: "COMING SOON", tag: "COMMUNITY", title: "ビーチクリーン", place: "ALL CHIBA", text: "地域・企業・サーファーが参加できる環境アクションを順次公開します。" },
  { date: "COMING SOON", tag: "ACADEMY", title: "次世代プログラム", place: "ICHINOMIYA", text: "体験、教育、競技育成をつなぐプログラムの情報を掲載予定です。" },
];

const athletes = [
  { initials: "01", name: "ATHLETE PROFILE", category: "SHORTBOARD", caption: "県代表・強化指定選手の実績とストーリーを掲載" },
  { initials: "02", name: "ATHLETE PROFILE", category: "LONGBOARD", caption: "競技だけでなく地域への関わりも可視化" },
  { initials: "03", name: "NEXT GENERATION", category: "JUNIOR", caption: "これからの千葉を担う選手を継続的に発信" },
];

const faqs = [
  ["千葉県サーフィン連盟は何をする団体ですか？", "サーフィン競技の普及・選手育成、大会運営、環境保全、安全・ルール啓発、地域・観光振興などに取り組む団体です。"],
  ["大会情報はどこで確認できますか？", "本サイトのEVENTSに大会日程、会場、エントリー、結果を集約する設計です。公開前は運営側で情報登録フローを確定します。"],
  ["ビーチクリーンには誰でも参加できますか？", "原則として地域住民、サーファー、企業・団体など幅広い参加を想定しています。開催ごとの対象・持ち物・中止条件をご確認ください。"],
  ["協賛や連携の相談はできますか？", "可能です。大会、選手育成、環境活動、地域プロジェクトなど、目的に応じた連携メニューを個別に設計します。"],
];

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{index}</span><p>{children}</p></div>;
}

export default function SiteClient() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { y: 54, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });
      gsap.to(".hero-copy", {
        yPercent: 18,
        opacity: 0.28,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".marquee-track", {
        xPercent: -35,
        ease: "none",
        scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    }, root);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("sending");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("send failed");
      setFormState("sent");
      event.currentTarget.reset();
    } catch {
      setFormState("error");
    }
  };

  return (
    <div ref={root} className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="トップへ">
          <span className="brand-mark"><Waves size={19} /></span>
          <span>CHIBA<br />SURFING FEDERATION</span>
        </a>
        <nav className="desktop-nav" aria-label="メインナビゲーション">
          <a href="#about">ABOUT</a><a href="#mission">MISSION</a><a href="#events">EVENTS</a><a href="#athletes">ATHLETES</a>
        </nav>
        <a className="header-cta" href="#contact">CONTACT <ArrowDownRight size={16} /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="メニュー" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {menuOpen && (
        <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          {["about", "mission", "events", "athletes", "contact"].map((item) => (
            <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item.toUpperCase()}</a>
          ))}
        </motion.nav>
      )}

      <main>
        <section id="top" className="hero">
          <HeroWave />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow"><span /> EST. 2026 · CHIBA, JAPAN</p>
            <h1><span>THE OCEAN</span><span className="outline">MOVES US.</span></h1>
            <div className="hero-bottom">
              <p>海から、千葉の未来を動かす。<br />競技・地域・環境をひとつの波へ。</p>
              <a href="#about" className="round-link" aria-label="続きを読む"><ArrowDownRight /></a>
            </div>
          </div>
          <div className="hero-side-note">PACIFIC COAST · 35.6°N</div>
          <div className="scroll-note"><span /> SCROLL TO DIVE</div>
        </section>

        <section id="about" className="manifesto section-dark">
          <SectionLabel index="01">ABOUT THE FEDERATION</SectionLabel>
          <div className="manifesto-layout">
            <p className="manifesto-kicker" data-reveal>CHIBA IS NOT<br />JUST A PLACE.</p>
            <div>
              <h2 data-reveal>日本を代表する波がある。<br /><em>その価値を、未来へつなぐ。</em></h2>
              <div className="manifesto-body" data-reveal>
                <p>千葉県サーフィン連盟は、サーフィン競技の普及と選手育成、海の環境保全、安全・マナーの啓発、地域との共創を推進します。</p>
                <p>勝つためだけではない。海を尊重し、地域に還元し、次の世代へ文化を手渡す。千葉のサーフィンを、世界に誇れる社会資産へ。</p>
              </div>
              <a className="text-link" href="#mission">OUR MISSION <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true"><div className="marquee-track">WORLD-CLASS WAVES · LOCAL ROOTS · BLUE ACTION · NEXT GENERATION · </div></div>

        <section id="mission" className="mission section-light">
          <SectionLabel index="02">WHAT WE MOVE</SectionLabel>
          <div className="section-heading" data-reveal>
            <h2>ONE OCEAN.<br /><span>FIVE MISSIONS.</span></h2>
            <p>海を中心に、競技・人・環境・安全・地域を連動させる。単発の活動ではなく、持続可能な仕組みとして実装します。</p>
          </div>
          <div className="mission-grid">
            {missions.map((item) => {
              const Icon = item.icon;
              return (
                <article className="mission-card" key={item.number} data-reveal>
                  <div className="mission-top"><span>{item.number}</span><Icon size={25} strokeWidth={1.5} /></div>
                  <div><p className="mission-en">{item.title}</p><h3>{item.ja}</h3><p>{item.text}</p></div>
                  <ArrowDownRight className="card-arrow" size={21} />
                </article>
              );
            })}
          </div>
        </section>

        <section className="blue-action">
          <div className="blue-glow" />
          <div className="blue-content" data-reveal>
            <p className="eyebrow"><span /> BLUE ACTION</p>
            <h2>THE BEACH IS<br />OUR <em>HOME.</em></h2>
            <p>海を楽しむ人が、海を守る人になる。ビーチクリーンをイベントで終わらせず、教育・企業連携・地域活動につなげます。</p>
            <a href="#contact" className="pill-button">JOIN THE ACTION <ArrowRight size={17} /></a>
          </div>
          <div className="blue-orbit" aria-hidden="true"><span>KEEP THE OCEAN BLUE · KEEP THE CULTURE ALIVE · </span></div>
        </section>

        <section id="events" className="events section-dark">
          <SectionLabel index="03">UPCOMING EVENTS</SectionLabel>
          <div className="section-heading inverse" data-reveal>
            <h2>MEET US<br /><span>AT THE COAST.</span></h2>
            <p>公開前デモのため、確定日程は未掲載です。運営開始後は大会、環境活動、育成プログラムを一元管理します。</p>
          </div>
          <div className="events-list">
            {events.map((event, index) => (
              <article className="event-row" key={event.title} data-reveal>
                <span className="event-index">0{index + 1}</span>
                <div className="event-date"><CalendarDays size={17} /><span>{event.date}</span></div>
                <div className="event-title"><p>{event.tag}</p><h3>{event.title}</h3><span><MapPin size={14} /> {event.place}</span></div>
                <p className="event-text">{event.text}</p>
                <button aria-label={`${event.title}の詳細`}><ArrowDownRight /></button>
              </article>
            ))}
          </div>
        </section>

        <section id="athletes" className="athletes section-light">
          <SectionLabel index="04">ATHLETES</SectionLabel>
          <div className="section-heading" data-reveal>
            <h2>RIDERS OF<br /><span>THE NEXT WAVE.</span></h2>
            <p>実在選手の掲載は、本人許諾・公式プロフィール・写真利用権の確認後に差し替えます。現在は構造確認用のプレースホルダーです。</p>
          </div>
          <div className="athlete-grid">
            {athletes.map((athlete, index) => (
              <article className="athlete-card" key={athlete.initials} data-reveal>
                <div className={`athlete-art athlete-art-${index + 1}`}>
                  <span className="athlete-number">{athlete.initials}</span>
                  <div className="athlete-silhouette" />
                  <div className="athlete-lines" />
                </div>
                <div className="athlete-meta"><div><p>{athlete.category}</p><h3>{athlete.name}</h3></div><ArrowDownRight /></div>
                <p className="athlete-caption">{athlete.caption}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="statement">
          <div className="statement-lines" aria-hidden="true" />
          <div data-reveal>
            <Sparkles size={28} />
            <p>FROM CHIBA<br />TO THE WORLD</p>
            <h2>千葉が一番だと、<br /><em>体験で証明する。</em></h2>
          </div>
        </section>

        <section className="faq section-light">
          <SectionLabel index="05">FAQ</SectionLabel>
          <div className="faq-layout">
            <h2 data-reveal>QUESTIONS<br /><span>BEFORE THE SET.</span></h2>
            <div className="faq-list">
              {faqs.map(([question, answer], index) => (
                <article key={question} className={`faq-item ${openFaq === index ? "open" : ""}`} data-reveal>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                    <span>0{index + 1}</span><h3>{question}</h3><ChevronDown />
                  </button>
                  <div className="faq-answer"><p>{answer}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-dark">
          <div className="contact-copy" data-reveal>
            <p className="eyebrow"><span /> PARTNERSHIP / CONTACT</p>
            <h2>CREATE THE<br /><em>NEXT WAVE.</em></h2>
            <p>大会、選手育成、環境活動、地域連携、協賛についてのご相談はこちらから。</p>
            <div className="contact-points">
              <span><Check size={15} /> 協賛・パートナー連携</span>
              <span><Check size={15} /> 大会・イベント相談</span>
              <span><Check size={15} /> メディア・取材</span>
            </div>
          </div>
          <form className="contact-form" onSubmit={submit} data-reveal>
            <label><span>NAME / ORGANIZATION</span><input name="name" required placeholder="お名前・団体名" /></label>
            <label><span>EMAIL</span><input name="email" type="email" required placeholder="name@example.com" /></label>
            <label><span>SUBJECT</span><select name="subject" required defaultValue=""><option value="" disabled>お問い合わせ種別</option><option>協賛・連携</option><option>大会・イベント</option><option>選手・育成</option><option>取材・メディア</option><option>その他</option></select></label>
            <label><span>MESSAGE</span><textarea name="message" required rows={5} placeholder="お問い合わせ内容をご記入ください" /></label>
            <button className="submit-button" disabled={formState === "sending"}>{formState === "sending" ? "SENDING..." : "SEND MESSAGE"}<ArrowRight size={18} /></button>
            {formState === "sent" && <p className="form-note success">送信しました。</p>}
            {formState === "error" && <p className="form-note error">送信先が未設定です。READMEの手順でCONTACT_WEBHOOK_URLを設定してください。</p>}
          </form>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><span className="brand-mark"><Waves size={22} /></span><h2>CHIBA SURFING<br />FEDERATION</h2></div>
        <div className="footer-links"><a href="#about">ABOUT</a><a href="#events">EVENTS</a><a href="#athletes">ATHLETES</a><a href="#contact">CONTACT</a></div>
        <div className="footer-social"><a href="#" aria-label="Instagram"><Send /></a><a href="#contact" aria-label="メール"><Mail /></a><a href="#about" aria-label="活動"><LifeBuoy /></a></div>
        <div className="footer-bottom"><span>© 2026 CHIBA SURFING FEDERATION</span><span>CONCEPT LP / DEMO</span></div>
      </footer>
    </div>
  );
}
