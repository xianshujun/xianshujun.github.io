import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Theme, Button, DropdownMenu, Tooltip } from '@radix-ui/themes';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@radix-ui/themes/styles.css';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const LINKS = {
  site: 'https://xianshujun.github.io/awsome-go-study/',
  source: 'https://github.com/xianshujun/awsome-go-study',
  github: 'https://github.com/xianshujun',
  email: 'mailto:2776085452@qq.com',
};

const copy = {
  zh: {
    skip: '跳到主要内容', work: '作品', about: '关于', contact: '联系', menu: '打开导航',
    greeting: '你好，我是 xianshujun', title: ['把思考，', '写进代码。'],
    intro: '以 Go 为主，做后端、Agent 开发与交易服务相关的工作。',
    seeWork: '看看我的作品', heroNote: '开发 / 学习 / 开源', scroll: '向下，了解更多',
    selected: '精选作品', selectedSub: '从笔记，到真正可以动手的工具。',
    projectTitle: ['学 Go，', '也动手写 Go。'],
    projectBody: '一个离线的 Go 练习应用：43 道练习，改代码、在本地跑、看输出，卡住了可以接自己的模型问 AI。Windows / Android / Linux 都能装。',
    projectNote: '内容来自仓库里的 Go 笔记，做成了能动手的样子。',
    projectLink: '探索 GoStudy / 下载', source: '查看源码',
    exercises: '可动手的练习', offline: '本地运行', offlineValue: '离线', ai: '接入自己的模型', aiValue: 'AI 辅助',
    screenshotAlt: 'GoStudy 课程界面：左侧练习列表、右侧 Go 代码编辑器与运行输出',
    caption: '不是只读一遍，而是写一遍。', platform: 'Windows / Android / Linux',
    aboutTitle: ['在细节里深耕，', '在实践里学习。'],
    aboutLead: '我的日常，是写代码、理解系统，和把学到的东西做成可以使用的工具。',
    education: '教育', educationBody: '211 大学软件工程专业。',
    focus: '在写什么', focusBody: 'Go 为主，交易服务，B端/C端开发，Agent 开发相关。',
    now: '最近', nowBody: '在科大讯飞消费者 CBG 从事软件开发，此前在腾讯 TEG 做 Agent 开发相关。',
    contactTitle: ['好的交流，', '从一句你好开始。'],
    contactBody: '关于代码、开源项目，或一个有意思的想法，欢迎联系。',
    emailLabel: '发一封邮件', githubLabel: '在 GitHub 找到我',
    footer: '保持好奇，持续构建。持续学习，持续迭代。', backTop: '回到顶部',
    language: '选择语言', languageStatus: '已切换为中文',
    meta: 'xianshujun 的个人主页：Go 后端开发，做 Agent 开发与交易服务，开源项目 GoStudy。',
  },
  en: {
    skip: 'Skip to main content', work: 'Work', about: 'About', contact: 'Contact', menu: 'Open navigation',
    greeting: "Hello, I’m xianshujun", title: ['Thoughtfully', 'built in code.'],
    intro: 'I work mostly in Go on the backend — agent development and trading services.',
    seeWork: 'Explore my work', heroNote: 'DEVELOP / LEARN / OPEN SOURCE', scroll: 'SCROLL TO EXPLORE',
    selected: 'Selected work', selectedSub: 'From notes to something you can actually use.',
    projectTitle: ['Learn Go.', 'Write Go.'],
    projectBody: 'An offline Go practice app: 43 exercises. Edit the code, run it locally, read the output; hook up your own model when you get stuck. Ships for Windows, Android and Linux.',
    projectNote: 'Built from my Go notes in the repo, turned into something you can actually run.',
    projectLink: 'Explore GoStudy / Download', source: 'View source',
    exercises: 'Hands-on exercises', offline: 'Runs locally', offlineValue: 'Offline', ai: 'Bring your own model', aiValue: 'AI help',
    screenshotAlt: 'GoStudy lesson interface with exercise navigation, Go code editor and local execution output',
    caption: 'Go beyond reading. Start writing.', platform: 'Windows / Android / Linux',
    aboutTitle: ['Into the details.', 'Learning by doing.'],
    aboutLead: 'My everyday practice: writing code, understanding systems, and turning what I learn into useful tools.',
    education: 'Education', educationBody: 'Software Engineering at a 211 university.',
    focus: 'What I work on', focusBody: 'Mostly Go — trading services, B2B/B2C development, and agent development.',
    now: 'Now', nowBody: 'Software development at iFLYTEK Consumer BG; previously agent development at Tencent TEG.',
    contactTitle: ['A good conversation', 'starts with hello.'],
    contactBody: 'Code, open-source projects, or an interesting idea — feel free to get in touch.',
    emailLabel: 'Send an email', githubLabel: 'Find me on GitHub',
    footer: 'Stay curious. Keep building. Keep learning. Keep iterating.', backTop: 'Back to top',
    language: 'Choose language', languageStatus: 'Language changed to English',
    meta: 'xianshujun — Go backend developer working on agent development and trading services, and creator of the open-source GoStudy app.',
  },
};

function Arrow({ direction = 'diagonal', className = '' }) {
  return <svg className={`arrow ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {direction === 'down' ? <path d="M12 4v15m-6-6 6 6 6-6" /> : direction === 'up' ? <path d="M12 20V5m-6 6 6-6 6 6" /> : <path d="M5 19 19 5M5 5h14v14" />}
  </svg>;
}

function SpringLink({ children, className = '', href, ...props }) {
  const reduced = useReducedMotion();
  return <motion.a className={className} href={href} whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: 0.975 }} transition={{ type: 'spring', stiffness: 430, damping: 28 }} {...props}>{children}</motion.a>;
}

function MaskedHeading({ lines, className = '', as: Tag = 'h2', hero = false, id }) {
  return <Tag id={id} className={`masked-heading ${className}`}>
    {lines.map((line, index) => <span className="text-mask" key={index}><span data-mask={hero ? 'hero' : 'scroll'}>{line}</span></span>)}
  </Tag>;
}

function Monogram() {
  return <div className="monogram" aria-hidden="true">
    <div className="art-top micro"><span>FIG. 01</span><span>XS / STRUCTURE</span></div>
    <svg viewBox="0 0 440 440" fill="none" className="monogram-svg">
      <g className="art-guides" stroke="currentColor" strokeWidth="0.6">
        <path d="M56 44v352M384 44v352M44 56h352M44 384h352M220 44v352M44 220h352" />
        <circle cx="220" cy="220" r="164" />
        <path d="M50 50h12M56 44v12M378 50h12M384 44v12M50 390h12M56 384v12M378 390h12M384 384v12" />
      </g>
      <g className="art-strokes" stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter">
        <path data-draw d="M112 112 328 328M328 112 112 328" strokeWidth="2" />
        <path data-draw d="M262 112h66v66M178 328h-66v-66" strokeWidth="12" />
        <path data-draw d="M328 220H220V112M112 220h108v108" strokeWidth="1.2" />
        <circle cx="220" cy="220" r="46" strokeWidth="1" />
      </g>
      <circle cx="220" cy="220" r="5" fill="currentColor" />
    </svg>
    <div className="art-bottom micro"><span>LESS, BUT CONSIDERED.</span><span>01 — 03</span></div>
  </div>;
}

function App() {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('homepage-language') === 'en' ? 'en' : 'zh'; }
    catch { return 'zh'; }
  });
  const [liveStatus, setLiveStatus] = useState('');
  const root = useRef(null);
  const t = copy[language];

  function changeLanguage(next) {
    setLanguage(next);
    setLiveStatus(copy[next].languageStatus);
    try { localStorage.setItem('homepage-language', next); } catch { /* 无存储权限时仍可切换语言。 */ }
  }

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = language === 'zh' ? 'xianshujun — 开发与记录' : 'xianshujun — Thoughtfully built';
    document.querySelector('meta[name="description"]').setAttribute('content', t.meta);
  }, [language, t.meta]);

  useLayoutEffect(() => {
    // 默认样式保持可见，只有允许动效时才设置起点；切换语言或动效偏好时完整清理。
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const hero = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.12 });
        hero.from('[data-hero-intro]', { opacity: 0, y: 12, duration: 0.7 })
          .from('[data-mask="hero"]', { yPercent: 110, rotate: 2, duration: 1.05, stagger: 0.14 }, '-=0.45')
          .from('[data-hero-detail]', { opacity: 0, y: 18, duration: 0.8, stagger: 0.09 }, '-=0.55')
          .from('.monogram', { opacity: 0, duration: 0.9 }, '-=1.15');
        root.current.querySelectorAll('[data-draw]').forEach((path, index) => {
          const length = path.getTotalLength();
          hero.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, 0.45 + index * 0.14);
        });
        // 首屏内的箭头随滚动顺时针转一圈：转轴取标记自身的圆心 220 220，滚回顶部时原路退回。
        gsap.to('.art-strokes', {
          rotate: 360,
          svgOrigin: '220 220',
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4, invalidateOnRefresh: true },
        });
        // 作品：GoStudy 逐字从切口下升上来。裁切窗从下往上打开，与单字上浮同步，收尾清掉裁切。
        const charMasks = root.current.querySelectorAll('[data-char-mask]');
        if (charMasks.length) {
          gsap.timeline({ scrollTrigger: { trigger: '.project-heading', start: 'top 88%', once: true } })
            .fromTo(charMasks, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, ease: 'power4.out', stagger: 0.04, clearProps: 'clipPath' }, 0)
            .from('[data-char]', { yPercent: 118, duration: 0.95, ease: 'power4.out', stagger: 0.04 }, 0);
        }
        // 「43」从 0 数到 43：只在允许动效时跑，默认文案已经是 43。
        root.current.querySelectorAll('[data-count]').forEach((element) => {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: Number(element.dataset.count), duration: 1.15, ease: 'power2.out', snap: { value: 1 },
            onUpdate: () => { element.textContent = String(counter.value); },
            scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          });
        });
        // 作品截图随滚动从上往下擦出来，像图纸一点点印出来。
        gsap.timeline({ scrollTrigger: { trigger: '.project-figure', start: 'top 86%', end: 'center 62%', scrub: 0.6 } })
          .from('.screen-frame', { clipPath: 'inset(0% 0% 100% 0%)', ease: 'none' }, 0)
          .from('.screen-frame img', { scale: 1.035, transformOrigin: 'center top', ease: 'none' }, 0);
        // 关于：三行依次进入，两栏反向轻移做出层次，署名标记慢慢自转。
        gsap.from('.about-row', { y: 26, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.about-details', start: 'top 88%', once: true } });
        gsap.to('.about-intro', { y: -16, ease: 'none', scrollTrigger: { trigger: '.about-layout', start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
        gsap.to('.about-details', { y: 16, ease: 'none', scrollTrigger: { trigger: '.about-layout', start: 'top bottom', end: 'bottom top', scrub: 0.7 } });
        gsap.to('.signature-cross', { rotate: 360, duration: 24, repeat: -1, ease: 'none' });
        // 联系：链接逐条自右进入；页脚细线随滚动从中间向两侧铺开，收住整页。
        gsap.from('.contact-link', { x: 22, opacity: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.contact-links', start: 'top 88%', once: true } });
        gsap.from('[data-footer-rule]', { scaleX: 0, transformOrigin: 'center center', ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top 96%', end: 'bottom bottom', scrub: 0.6 } });
        root.current.querySelectorAll('[data-rule]').forEach((line) => {
          gsap.from(line, { scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: line, start: 'top 92%', once: true } });
        });
        root.current.querySelectorAll('[data-mask="scroll"]').forEach((line) => {
          gsap.from(line, { yPercent: 110, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: line.parentElement, start: 'top 92%', once: true } });
        });
        root.current.querySelectorAll('[data-reveal]').forEach((element) => {
          gsap.from(element, { y: 28, opacity: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
        });
        const refresh = () => ScrollTrigger.refresh();
        document.fonts.ready.then(refresh);
        window.addEventListener('load', refresh, { once: true });
        return () => window.removeEventListener('load', refresh);
      }, root);
      return () => {
        context.revert();
        // 计数写的是 textContent，context.revert 管不到；切语言时若正好数到一半，把它拨回终值。
        root.current?.querySelectorAll('[data-count]').forEach((element) => { element.textContent = element.dataset.count; });
      };
    });
    return () => media.revert();
  }, [language]);

  return <MotionConfig reducedMotion="user"><Theme appearance="light" accentColor="grass" grayColor="sand" radius="none" scaling="100%">
    <div ref={root} className={`site language-${language}`}>
      <a href="#main" className="skip-link">{t.skip}</a>
      <span className="sr-only" role="status" aria-live="polite">{liveStatus}</span>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="xianshujun"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="m5 5 18 18M23 5 5 23M17 5h6v6M5 17v6h6" /></svg><span>xianshujun<span className="brand-period">.</span></span></a>
        <nav className="desktop-nav" aria-label={language === 'zh' ? '主导航' : 'Main navigation'}>
          <a href="#projects"><span className="nav-index">01</span>{t.work}</a>
          <a href="#about"><span className="nav-index">02</span>{t.about}</a>
          <a href="#contact"><span className="nav-index">03</span>{t.contact}</a>
        </nav>
        <div className="header-tools">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button className="language-button" variant="ghost" aria-label={t.language}>{language === 'zh' ? '中 / EN' : 'EN / 中'}<DropdownMenu.TriggerIcon /></Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="site-dropdown">
              <DropdownMenu.RadioGroup value={language} onValueChange={changeLanguage}>
                <DropdownMenu.RadioItem value="zh">简体中文</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="en">English</DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger><Button variant="ghost" className="mobile-menu" aria-label={t.menu}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 8h16M4 16h16" stroke="currentColor" fill="none" /></svg></Button></DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" className="site-dropdown">
              {[['#projects', t.work], ['#about', t.about], ['#contact', t.contact]].map(([href, label]) => <DropdownMenu.Item asChild key={href}><a href={href}>{label}</a></DropdownMenu.Item>)}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section id="top" className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow micro" data-hero-intro><span className="status-dot" />{t.greeting}</p>
            <MaskedHeading id="hero-title" as="h1" lines={t.title} className="hero-title" hero />
            <p className="hero-description" data-hero-detail>{t.intro}</p>
            <div className="hero-actions" data-hero-detail>
              <Button asChild className="primary-link"><SpringLink href="#projects">{t.seeWork}<Arrow direction="down" /></SpringLink></Button>
              <Tooltip content={language === 'zh' ? '查看 GitHub 主页' : 'Visit my GitHub profile'}><SpringLink href={LINKS.github} className="text-link">GitHub<Arrow /></SpringLink></Tooltip>
            </div>
            <p className="hero-tech micro" data-hero-detail><span>GO</span><span>BACKEND</span><span>AGENT</span><span>TRADE</span></p>
          </div>
          <Monogram />
          <div className="hero-bottom micro" data-hero-detail><span>{t.heroNote}</span><a href="#projects">{t.scroll}<Arrow direction="down" /></a></div>
        </section>

        <section id="projects" className="projects section-shell" aria-labelledby="projects-title">
          <div className="section-rule" data-rule />
          <div className="section-heading" data-reveal><h2 id="projects-title"><span className="micro section-index">01 /</span>{t.selected}</h2><p>{t.selectedSub}</p></div>
          <article className="featured-project">
            <div className="project-heading" data-reveal><h3 aria-label="GoStudy">{[...'GoStudy'].map((char, index) => <span className="char-mask" data-char-mask key={index} aria-hidden="true"><span data-char>{char}</span></span>)}<span className="char-mask" data-char-mask aria-hidden="true"><span data-char className="project-dot">.</span></span></h3><span className="micro project-type">OPEN SOURCE / GO + REACT</span></div>
            <div className="project-story">
              <MaskedHeading as="p" lines={t.projectTitle} className="project-statement" />
              <div className="project-description" data-reveal><p>{t.projectBody}</p><p className="project-note">{t.projectNote}</p></div>
            </div>
            <div className="project-metrics" data-reveal>
              <div><strong><span data-count="43">43</span><span className="metric-dot">.</span></strong><span>{t.exercises}</span></div>
              <div><strong>{t.offlineValue}</strong><span>{t.offline}</span></div>
              <div><strong>{t.aiValue}</strong><span>{t.ai}</span></div>
              <div className="project-links"><Button asChild className="primary-link"><SpringLink href={LINKS.site}>{t.projectLink}<Arrow /></SpringLink></Button><SpringLink href={LINKS.source} className="text-link">{t.source}<Arrow /></SpringLink></div>
            </div>
            <figure className="project-figure" data-reveal>
              <div className="screen-frame"><div className="screen-toolbar micro"><span><i /><i /><i /></span><span>GOSTUDY — LOCAL WORKSPACE</span><span>GO</span></div><img src="/images/gostudy-lesson.png" width="1440" height="940" alt={t.screenshotAlt} loading="lazy" onLoad={() => ScrollTrigger.refresh()} /></div>
              <figcaption><span>{t.caption}</span><span className="micro">{t.platform}</span></figcaption>
            </figure>
          </article>
        </section>

        <section id="about" className="about section-shell" aria-labelledby="about-title">
          <div className="section-rule" data-rule />
          <div className="section-heading" data-reveal><h2 id="about-title"><span className="micro section-index">02 /</span>{t.about}</h2><span className="micro">A LITTLE CONTEXT</span></div>
          <div className="about-layout">
            <div className="about-intro"><MaskedHeading lines={t.aboutTitle} className="about-title" /><p data-reveal>{t.aboutLead}</p><div className="about-signature micro" data-reveal><span className="signature-cross">✳</span>GO / BACKEND / SYSTEMS</div></div>
            <dl className="about-details">
              {[[t.education, t.educationBody, 'EDUCATION'], [t.focus, t.focusBody, 'CRAFT'], [t.now, t.nowBody, 'CURRENTLY']].map(([title, body, label], index) => <div className="about-row" key={label}><dt><span className="micro">0{index + 1} / {label}</span><h3>{title}</h3></dt><dd>{body}</dd></div>)}
            </dl>
          </div>
        </section>

        <section id="contact" className="contact section-shell" aria-labelledby="contact-title">
          <div className="section-rule" data-rule />
          <div className="section-heading" data-reveal><h2 id="contact-title"><span className="micro section-index">03 /</span>{t.contact}</h2><span className="micro">LET’S CONNECT</span></div>
          <div className="contact-layout"><div><MaskedHeading lines={t.contactTitle} className="contact-title" /><p className="contact-description" data-reveal>{t.contactBody}</p></div><div className="contact-links">
            <SpringLink href={LINKS.email} className="contact-link"><span><span className="micro">{t.emailLabel}</span><span className="contact-value">2776085452@qq.com</span></span><span className="arrow-swap" aria-hidden="true"><Arrow /><Arrow /></span></SpringLink>
            <SpringLink href={LINKS.github} className="contact-link" target="_blank" rel="noopener noreferrer"><span><span className="micro">{t.githubLabel}</span><span className="contact-value">github.com/xianshujun</span></span><span className="arrow-swap" aria-hidden="true"><Arrow /><Arrow /></span></SpringLink>
          </div></div>
        </section>
      </main>

      <footer className="footer section-shell"><span className="footer-rule" data-footer-rule aria-hidden="true" /><span className="micro">© 2026 XIANSHUJUN</span><span className="footer-note">{t.footer}</span><SpringLink href="#top" className="micro footer-top">{t.backTop}<Arrow direction="up" /></SpringLink></footer>
    </div>
  </Theme></MotionConfig>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
