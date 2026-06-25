import React, { useState, useEffect } from 'react';
import { CatConfig, CatBreed, CatPattern, EyeType, MouthExpression } from './types';
import CatPreview from './components/CatPreview';
import Playground from './components/Playground';
import { 
  Sparkles, 
  Trash2, 
  Heart, 
  Award, 
  RefreshCw, 
  Plus, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Dices,
  Smile,
  Compass,
  Briefcase,
  HelpCircle,
  Copy,
  CheckCheck,
  ChevronRight
} from 'lucide-react';

// Predefined fun color palettes
const PALETTES = [
  { name: '经典橘色 (Orange)', primary: '#F97316', secondary: '#FFEDD5', stripes: '#C2410C', eyes: '#10B981' },
  { name: '暹罗煤球 (Siamese)', primary: '#F5E6D3', secondary: '#374151', stripes: undefined, eyes: '#06B6D4' },
  { name: '帅气奶牛 (Tuxedo)', primary: '#1F2937', secondary: '#FFFFFF', stripes: undefined, eyes: '#F59E0B' },
  { name: '三花混沌 (Calico)', primary: '#FFFFFF', secondary: '#F59E0B', stripes: undefined, eyes: '#84CC16' },
  { name: '高冷纯黑 (Black)', primary: '#111827', secondary: '#111827', stripes: undefined, eyes: '#EAB308' },
  { name: '软萌纯白 (White)', primary: '#FFFFFF', secondary: '#FFFFFF', stripes: undefined, eyes: '#3B82F6' },
  { name: '狸花条纹 (Tabby)', primary: '#A1A1AA', secondary: '#F4F4F5', stripes: '#52525B', eyes: '#10B981' },
  { name: '波斯金毛 (Persian)', primary: '#FEF3C7', secondary: '#FEF3C7', stripes: undefined, eyes: '#3B82F6' },
];

const BREED_LABELS: Record<CatBreed, string> = {
  tabby: '狸花猫 (Tabby)',
  tuxedo: '奶牛猫 (Tuxedo)',
  siamese: '暹罗猫 (Siamese)',
  calico: '三花猫 (Calico)',
  orange: '大橘猫 (Orange)',
  white: '大白猫 (White)',
  black: '小黑猫 (Black)',
  persian: '波斯猫 (Persian)',
};

const EYE_LABELS: Record<EyeType, { label: string; icon: string }> = {
  cute: { label: '水汪汪闪亮', icon: '🥺' },
  sparkling: { label: '星星眼', icon: '🤩' },
  derp: { label: '沙雕智慧', icon: '🤪' },
  sleepy: { label: '看淡红尘', icon: '😑' },
  angry: { label: '暗中观察', icon: '😒' },
  funny: { label: '震撼全家', icon: '😳' },
};

const MOUTH_LABELS: Record<MouthExpression, { label: string; icon: string }> = {
  smile: { label: '礼貌微笑', icon: '🙂' },
  meh: { label: '无欲无求', icon: '😐' },
  pout: { label: '略带嫌弃', icon: '🙁' },
  shocked: { label: '吃惊哈气', icon: '😮' },
  smug: { label: '不屑歪嘴', icon: '😏' },
  tongue: { label: '略略略', icon: '😛' },
};

const ACCESSORIES_LIST = [
  { id: 'sunglasses', label: '社会墨镜', icon: '🕶️', desc: '戴上它，整条街最靓的仔' },
  { id: 'crown', label: '尊贵皇冠', icon: '👑', desc: '臣服吧，愚蠢的铲屎官' },
  { id: 'party_hat', label: '派对帽', icon: '🥳', desc: '随时准备开始蹦迪' },
  { id: 'detective_hat', label: '侦探礼帽', icon: '🕵️', desc: '在调查小鱼干失踪之谜' },
  { id: 'clown_nose', label: '小丑红鼻', icon: '🔴', desc: '偶尔客串猫界马戏团' },
  { id: 'business_tie', label: '精英领带', icon: '👔', desc: '月入百万猫罐罐的高管' },
  { id: 'toast_collar', label: '搞笑吐司圈', icon: '🍞', desc: '经典猫咪套头迷惑行为' },
  { id: 'angel_wings', label: '天使翅膀', icon: '👼', desc: '虽然我拆家，但我知道我是天使' },
];

const HABITS_LIST = [
  '凌晨三点蹦迪高歌',
  '坚决不睡五百块的猫窝',
  '极速漂移撞到柜子',
  '盯着空白墙壁发出哈气声',
  '喜欢把桌上的杯子推下去',
  '露出肚子吸引你摸，然后咬你',
  '暗中观察，眼神鄙视',
  '对塑料袋有极度狂热',
  '虚空打拳，大战隐形怪兽'
];

// Fun static cat presets to load quickly
const CAT_PRESETS: CatConfig[] = [
  {
    id: 'preset_orange',
    name: '沈阳大橘-金枪鱼战神',
    breed: 'orange',
    pattern: 'stripes',
    colors: { primary: '#F97316', secondary: '#FFEDD5', stripes: '#C2410C', eyes: '#10B981' },
    eyeType: 'derp',
    expression: 'tongue',
    accessories: ['toast_collar'],
    personalityTraits: ['凌晨三点蹦迪高歌', '坚决不睡五百块的猫窝'],
    funnyName: '金枪鱼面包片',
    title: '首席吐司质量检查官',
    secretBackground: '由于对吐司套头有狂热癖好，它在小区的流浪猫圈里被尊称为“吐司狂魔”。曾为了一个纸箱打败过五只萨摩耶。',
    traits: ['能够准确预判铲屎官何时打算入睡并立刻跑酷', '把高档猫窝踩扁，然后睡在旁边的旧报纸上', '擅长将各种液体饮料推倒在刚写好的作业上'],
    thoughts: ['这个大黄饼味道有点不对……', '我的尾巴好像有它自己的想法！', '为什么那个人类一直用小发光板拍我？', '今天的罐头怎么少了一克？', '我要去偷吃拖鞋了！']
  },
  {
    id: 'preset_siamese',
    name: '煤球总监-阿福',
    breed: 'siamese',
    pattern: 'points',
    colors: { primary: '#F5E6D3', secondary: '#374151', eyes: '#06B6D4' },
    eyeType: 'angry',
    expression: 'smug',
    accessories: ['business_tie'],
    personalityTraits: ['暗中观察，眼神鄙视', '极速漂移撞到柜子'],
    funnyName: '阿福（挖煤大佬）',
    title: '摸鱼组高级猫薄荷顾问',
    secretBackground: '白天的他是辛勤工作的商业猫猫，晚上则混迹于各个垃圾桶旁。暗地里掌握了铲屎官银行卡密码但无法打字。',
    traits: ['开会时用极其鄙夷的眼神让对方自惭形秽', '在干净的地毯上展示三百六十度无死角倒立滚粗', '一听到开罐头的声音，能以光速在客厅表演漂移'],
    thoughts: ['这届人类真的不好带。', '那个PPT写得像一团猫草。', '我想去阳台晒太阳，懂？', '这个领带有点勒肚子了。', '红点点，这次你休想逃走！']
  },
  {
    id: 'preset_calico',
    name: '三花公主-花椒',
    breed: 'calico',
    pattern: 'spots',
    colors: { primary: '#FFFFFF', secondary: '#D97706', eyes: '#84CC16' },
    eyeType: 'sparkling',
    expression: 'smile',
    accessories: ['crown', 'angel_wings'],
    personalityTraits: ['露出肚子吸引你摸，然后咬你', '喜欢把桌上的杯子推下去'],
    funnyName: '花椒殿下',
    title: '全宇宙第一霸道甜心',
    secretBackground: '背地里拥有一支由十五只鸽子组成的情报部队，通过咕咕声传递关于隔壁德牧的最新动态。',
    traits: ['把肚皮完全敞开，诱骗愚蠢人类上前抚摸并瞬间启动利爪陷阱', '将桌上的口红、水杯一律视作地球重力测试仪并推落', '自带高贵光环，拒绝被拥抱超过三秒钟'],
    thoughts: ['摸我！……对，就是这。咬死你！', '今天的朕依旧美得不可方物。', '水杯：卒于重力测试。', '这顶王冠有点重，但很配我。', '空气里有金枪鱼的香气！']
  }
];

export default function App() {
  // Current editing configuration
  const [catName, setCatName] = useState<string>('肉垫大魔王');
  const [selectedBreed, setSelectedBreed] = useState<CatBreed>('orange');
  const [selectedPattern, setSelectedPattern] = useState<CatPattern>('stripes');
  
  // Custom hex colors
  const [primaryColor, setPrimaryColor] = useState<string>('#F97316');
  const [secondaryColor, setSecondaryColor] = useState<string>('#FFEDD5');
  const [eyeColor, setEyeColor] = useState<string>('#10B981');
  const [stripesColor, setStripesColor] = useState<string>('#C2410C');

  const [selectedEye, setSelectedEye] = useState<EyeType>('cute');
  const [selectedExpression, setSelectedExpression] = useState<MouthExpression>('smile');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['凌晨三点蹦迪高歌']);

  // Saved Custom Cats
  const [savedCats, setSavedCats] = useState<CatConfig[]>(() => {
    const local = localStorage.getItem('cat_lab_saved');
    return local ? JSON.parse(local) : CAT_PRESETS;
  });

  // AI Generated Identity state
  const [generatedProfile, setGeneratedProfile] = useState<{
    funnyName: string;
    title: string;
    secretBackground: string;
    traits: string[];
    thoughts: string[];
  } | null>({
    funnyName: '肉垫大魔王',
    title: '深夜蹦迪大联盟盟主',
    secretBackground: '白日假装乖巧软萌，深夜带领整栋楼的猫咪开展疯狂的跑酷狂欢。曾因将铲屎官的蓝牙耳机埋进猫砂盆而荣获猫界“恶作剧金奖”。',
    traits: [
      '对猫砂盆里的沙子进行地毯式挖掘，直至掘地三尺。',
      '在极度安静的深夜，突然发出悲壮的长嚎，宛如正在演歌。',
      '以超乎寻常的平衡力在超薄电视机顶端漫步。'
    ],
    thoughts: [
      '我刚刚挖出了一个新黑洞！',
      '那个人类在偷偷吃什么？',
      '红点点是宇宙的终极敌人。',
      '其实我听得懂人话，但我就不理你。',
      '喵呜，好想抓沙发……'
    ]
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync state with selected color preset when breed / preset color is clicked
  const handlePaletteSelect = (palette: any) => {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    setEyeColor(palette.eyes);
    if (palette.stripes) {
      setStripesColor(palette.stripes);
    }
  };

  // Toggle accessories selection
  const handleAccessoryToggle = (id: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle personality traits selection (Max 3)
  const handleTraitToggle = (trait: string) => {
    setSelectedTraits((prev) => {
      if (prev.includes(trait)) {
        return prev.filter((t) => t !== trait);
      }
      if (prev.length >= 3) {
        alert('抱歉，喵喵的脑容量有限，最多只能选择3个搞笑习惯哦！(Max 3 habits)');
        return prev;
      }
      return [...prev, trait];
    });
  };

  // Create current config object
  const currentCatConfig: CatConfig = {
    id: 'current_custom',
    name: catName,
    breed: selectedBreed,
    pattern: selectedPattern,
    colors: {
      primary: primaryColor,
      secondary: secondaryColor,
      eyes: eyeColor,
      stripes: stripesColor,
    },
    eyeType: selectedEye,
    expression: selectedExpression,
    accessories: selectedAccessories,
    personalityTraits: selectedTraits,
    funnyName: generatedProfile?.funnyName,
    title: generatedProfile?.title,
    secretBackground: generatedProfile?.secretBackground,
    traits: generatedProfile?.traits,
    thoughts: generatedProfile?.thoughts,
  };

  // Randomize all configurations ("Surprise Me!")
  const handleRandomize = () => {
    const breeds: CatBreed[] = ['tabby', 'tuxedo', 'siamese', 'calico', 'orange', 'white', 'black', 'persian'];
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    setSelectedBreed(randomBreed);

    // Pick a random preset palette or randomized hex
    const randomPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    setPrimaryColor(randomPalette.primary);
    setSecondaryColor(randomPalette.secondary);
    setEyeColor(randomPalette.eyes);
    if (randomPalette.stripes) {
      setStripesColor(randomPalette.stripes);
    }

    const randomEyes: EyeType[] = ['cute', 'sparkling', 'derp', 'sleepy', 'angry', 'funny'];
    setSelectedEye(randomEyes[Math.floor(Math.random() * randomEyes.length)]);

    const randomExpressions: MouthExpression[] = ['smile', 'meh', 'pout', 'shocked', 'smug', 'tongue'];
    setSelectedExpression(randomExpressions[Math.floor(Math.random() * randomExpressions.length)]);

    // Randomize accessory (0 to 2)
    const shuffledAccs = [...ACCESSORIES_LIST].sort(() => 0.5 - Math.random());
    const accCount = Math.floor(Math.random() * 3);
    setSelectedAccessories(shuffledAccs.slice(0, accCount).map(a => a.id));

    // Randomize 1 to 2 habits
    const shuffledHabits = [...HABITS_LIST].sort(() => 0.5 - Math.random());
    const habitCount = 1 + Math.floor(Math.random() * 2);
    setSelectedTraits(shuffledHabits.slice(0, habitCount));

    // Random funny name
    const adjectives = ['超频', '横行', '失控', '无辜', '疯狂', '高贵', '尊贵', '叛逆'];
    const nouns = ['纸箱狂魔', '小鱼干终结者', '沙发大理石师', '拖鞋盗贼', '凌晨歌神', '重力测试家'];
    setCatName(`${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`);
  };

  // Save customized cat config to Local List
  const handleSaveCat = () => {
    if (!catName.trim()) {
      alert('请给你的喵喵起一个响亮的名字！');
      return;
    }
    const newSavedCat: CatConfig = {
      ...currentCatConfig,
      id: `custom_${Date.now()}`,
    };

    const updated = [newSavedCat, ...savedCats.filter(c => c.id !== 'current_custom')];
    setSavedCats(updated);
    localStorage.setItem('cat_lab_saved', JSON.stringify(updated));
    alert(`成功将【${catName}】封印进猫猫档案库！现在你可以把它作为伴侣放进游乐场啦。`);
  };

  // Delete saved cat from archival list
  const handleDeleteCat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedCats.filter((c) => c.id !== id);
    setSavedCats(updated);
    localStorage.setItem('cat_lab_saved', JSON.stringify(updated));
  };

  // Load saved cat configuration back into edit canvas
  const handleLoadCat = (cat: CatConfig) => {
    setCatName(cat.name);
    setSelectedBreed(cat.breed);
    setSelectedPattern(cat.pattern);
    setPrimaryColor(cat.colors.primary);
    setSecondaryColor(cat.colors.secondary);
    setEyeColor(cat.colors.eyes);
    if (cat.colors.stripes) {
      setStripesColor(cat.colors.stripes);
    }
    setSelectedEye(cat.eyeType);
    setSelectedExpression(cat.expression);
    setSelectedAccessories(cat.accessories);
    setSelectedTraits(cat.personalityTraits);
    
    if (cat.funnyName) {
      setGeneratedProfile({
        funnyName: cat.funnyName,
        title: cat.title || '特邀纸箱质检专家',
        secretBackground: cat.secretBackground || '',
        traits: cat.traits || [],
        thoughts: cat.thoughts || []
      });
    }
  };

  // Generate identity profile using our server API (Gemini model 3.5 flash)
  const handleGenerateAIProfile = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch('/api/gemini/cat-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: catName,
          breed: BREED_LABELS[selectedBreed],
          colors: {
            primary: primaryColor,
            secondary: secondaryColor,
          },
          eyeType: EYE_LABELS[selectedEye].label,
          expression: MOUTH_LABELS[selectedExpression].label,
          accessories: selectedAccessories.map(id => ACCESSORIES_LIST.find(a => a.id === id)?.label),
          personalityTraits: selectedTraits,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      setGeneratedProfile({
        funnyName: data.funnyName || catName,
        title: data.title || '无业散猫',
        secretBackground: data.secretBackground || '无背景，每天除了吃小鱼干就是睡觉。',
        traits: data.traits || [],
        thoughts: data.thoughts || [],
      });
    } catch (err: any) {
      console.error(err);
      setGenerationError('Gemini 智能体解析失败，已为您启用量子谐振智能备用身份方案。');
    } finally {
      setIsGenerating(false);
    }
  };

  // Share link trigger
  const handleShare = () => {
    const serialized = encodeURIComponent(JSON.stringify({
      name: catName,
      breed: selectedBreed,
      primaryColor,
      secondaryColor,
      eyeColor,
      eyeType: selectedEye,
      expression: selectedExpression,
      accs: selectedAccessories
    }));
    navigator.clipboard.writeText(`${window.location.origin}?cat=${serialized}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // On page load, read share parameter if exists
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(catParam));
        if (decoded.name) setCatName(decoded.name);
        if (decoded.breed) setSelectedBreed(decoded.breed);
        if (decoded.primaryColor) setPrimaryColor(decoded.primaryColor);
        if (decoded.secondaryColor) setSecondaryColor(decoded.secondaryColor);
        if (decoded.eyeColor) setEyeColor(decoded.eyeColor);
        if (decoded.eyeType) setSelectedEye(decoded.eyeType);
        if (decoded.expression) setSelectedExpression(decoded.expression);
        if (decoded.accs) setSelectedAccessories(decoded.accs);
      } catch (e) {
        console.error('Failed to parse shared cat parameter', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans flex flex-col antialiased selection:bg-[#FFD166] selection:text-black">
      
      {/* 1. Header with Brutalist bold design */}
      <header className="h-20 border-b-4 border-black flex items-center justify-between px-6 sm:px-10 bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD166] border-3 border-black rounded-full flex items-center justify-center font-black text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            🐱
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase flex items-center gap-1.5 leading-none">
              Cat-Lab <span className="text-xs font-bold px-1.5 py-0.5 bg-black text-[#FFD166] rounded uppercase">v1.0</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              猫咪定制基因工程实验室
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRandomize}
            className="hidden sm:flex px-4 py-2 border-2 border-black bg-white hover:bg-[#FFD166] text-xs font-black uppercase tracking-wider transition-all items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            <Dices className="w-4 h-4" />
            随机捏猫
          </button>
          
          <button
            onClick={handleShare}
            className="px-3 sm:px-4 py-2 border-2 border-black bg-[#A8DADC] hover:bg-[#457B9D] hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {copiedLink ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedLink ? '链接已复制' : '分享喵喵'}
          </button>

          <button
            onClick={handleSaveCat}
            className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-[#FF4D00] text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            保存基因
          </button>
        </div>
      </header>

      {/* 2. Main content container */}
      <main className="flex-1 lg:grid lg:grid-cols-12 min-h-0">
        
        {/* LEFT COLUMN: Controls Panel (Col-span 5) */}
        <aside className="lg:col-span-5 border-r-0 lg:border-r-4 border-black bg-[#F3F3F3] p-5 sm:p-8 flex flex-col gap-8 overflow-y-auto max-h-none lg:max-h-[calc(100vh-80px-48px)]">
          
          {/* Identity Name Input */}
          <section className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xs font-black uppercase tracking-widest mb-2 text-[#FF4D00] flex items-center gap-1">
              <span>01. 设定猫咪编号/名称</span>
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="给小猫起个响亮名字..."
                className="flex-1 px-3 py-2 border-2 border-black font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                maxLength={20}
              />
              <button 
                onClick={() => {
                  const arr = ['肉垫大魔王', '芝麻糊总监', '黄金烤吐司', '香煎三文鱼', '暗夜玫瑰', '机智小面包', '纸箱终结者', '无情干罐器'];
                  setCatName(arr[Math.floor(Math.random() * arr.length)]);
                }}
                className="px-3 border-2 border-black bg-slate-200 hover:bg-slate-300 font-bold text-xs"
                title="随机起名"
              >
                🎲
              </button>
            </div>
          </section>

          {/* Breed Selection */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-3 opacity-60">02. 挑选猫咪品种</h2>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(BREED_LABELS) as CatBreed[]).map((breed) => {
                const active = selectedBreed === breed;
                return (
                  <button
                    key={breed}
                    onClick={() => {
                      setSelectedBreed(breed);
                      // Auto apply standard colors for breed to help users
                      const standard = PALETTES.find(p => p.name.includes(breed === 'tabby' ? '狸花' : breed === 'orange' ? '经典橘' : breed === 'siamese' ? '暹罗' : breed === 'tuxedo' ? '奶牛' : breed === 'calico' ? '三花' : breed === 'black' ? '纯黑' : breed === 'white' ? '纯白' : '波斯'));
                      if (standard) handlePaletteSelect(standard);
                    }}
                    className={`p-2.5 text-xs font-black uppercase border-2 border-black text-left flex items-center justify-between transition-all ${
                      active
                        ? 'bg-[#FFD166] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span>{BREED_LABELS[breed]}</span>
                    {active && <Check className="w-3.5 h-3.5 text-black" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Palette Suggestions & Detailed Colors */}
          <section className="bg-white border-2 border-black p-4">
            <h2 className="text-xs font-black uppercase tracking-widest mb-3 opacity-60">03. 快速配色 & 自定义色彩</h2>
            
            {/* Quick Presets */}
            <div className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">品种快速涂装:</p>
              <div className="flex flex-wrap gap-2">
                {PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => handlePaletteSelect(palette)}
                    className="px-2 py-1 text-[10px] font-bold border-2 border-black bg-white hover:bg-slate-100 flex items-center gap-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                  >
                    <span 
                      className="w-3 h-3 rounded-full border border-black inline-block" 
                      style={{ backgroundColor: palette.primary }}
                    />
                    <span>{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom HEX Colors */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-3 text-xs font-bold">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">主毛色</label>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 border border-black cursor-pointer rounded-sm"
                  />
                  <span className="font-mono text-[9px] uppercase">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1">斑纹/副色</label>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-7 h-7 border border-black cursor-pointer rounded-sm"
                  />
                  <span className="font-mono text-[9px] uppercase">{secondaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1">瞳色</label>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={eyeColor}
                    onChange={(e) => setEyeColor(e.target.value)}
                    className="w-7 h-7 border border-black cursor-pointer rounded-sm"
                  />
                  <span className="font-mono text-[9px] uppercase">{eyeColor}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Eye Style & Facial Expression */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">04. 眼神状态</h2>
              <div className="space-y-1.5">
                {(Object.keys(EYE_LABELS) as EyeType[]).map((eye) => {
                  const active = selectedEye === eye;
                  return (
                    <button
                      key={eye}
                      onClick={() => setSelectedEye(eye)}
                      className={`w-full p-2 border-2 border-black text-xs font-bold flex items-center justify-between transition-all ${
                        active ? 'bg-[#FFD166]' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">{EYE_LABELS[eye].icon}</span>
                        <span>{EYE_LABELS[eye].label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">05. 嘴部表情</h2>
              <div className="space-y-1.5">
                {(Object.keys(MOUTH_LABELS) as MouthExpression[]).map((expr) => {
                  const active = selectedExpression === expr;
                  return (
                    <button
                      key={expr}
                      onClick={() => setSelectedExpression(expr)}
                      className={`w-full p-2 border-2 border-black text-xs font-bold flex items-center justify-between transition-all ${
                        active ? 'bg-[#FFD166]' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">{MOUTH_LABELS[expr].icon}</span>
                        <span>{MOUTH_LABELS[expr].label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Fancy Accessories Selection */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-3 opacity-60">06. 搞笑潮流配饰 (多选)</h2>
            <div className="grid grid-cols-2 gap-2">
              {ACCESSORIES_LIST.map((acc) => {
                const active = selectedAccessories.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleAccessoryToggle(acc.id)}
                    className={`p-2.5 border-2 border-black text-left flex flex-col justify-between transition-all ${
                      active ? 'bg-[#FFD166] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full font-black text-xs">
                      <span className="flex items-center gap-1.5">
                        <span>{acc.icon}</span>
                        <span>{acc.label}</span>
                      </span>
                      {active && <Check className="w-3 h-3 text-black stroke-[3px]" />}
                    </div>
                    <span className="text-[9px] text-slate-500 font-medium leading-tight mt-1">{acc.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Interactive Core Habits (Selected traits display on bubble) */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">
              07. 核心行为特征 (最多选3个)
            </h2>
            <p className="text-[10px] font-bold text-slate-400 mb-2">这些将影响AI小猫在游乐场里漫游时的胡思乱想！</p>
            <div className="flex flex-wrap gap-1.5">
              {HABITS_LIST.map((trait) => {
                const active = selectedTraits.includes(trait);
                return (
                  <button
                    key={trait}
                    onClick={() => handleTraitToggle(trait)}
                    className={`px-2 py-1.5 text-[10px] font-bold border-2 border-black transition-all ${
                      active ? 'bg-black text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{trait}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Surplus Section - Brutalist Surprise button */}
          <div className="mt-2 pt-4 border-t-2 border-black">
            <button
              onClick={handleRandomize}
              className="w-full p-4 bg-[#FF4D00] text-white border-3 border-black font-black uppercase text-center italic tracking-widest hover:bg-[#ff5d1c] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-sm"
            >
              🎉 SURPRISE ME! 随机扭蛋
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: Stage & SandBox Playground (Col-span 7) */}
        <div className="lg:col-span-7 bg-[#E9E9E9] p-5 sm:p-8 flex flex-col gap-6 overflow-y-auto max-h-none lg:max-h-[calc(100vh-80px-48px)]">
          
          {/* Section 1: Main Custom Preview Stage */}
          <div className="grid md:grid-cols-12 gap-6 items-center">
            
            {/* The Live Cat SPECIMEN Display (7 columns) */}
            <div className="md:col-span-7 bg-white border-4 border-black p-6 rounded-2xl relative flex flex-col items-center justify-center min-h-[300px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {/* Retro background dot grid pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 0)', backgroundSize: '20px 20px' }} />

              {/* Display Header */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black text-[#FFD166] px-2 py-0.5 text-[9px] font-mono rounded uppercase tracking-widest z-10">
                <span>SPECIMEN: #{catName.length * 13 + 101}</span>
              </div>

              {/* Fun rotate label stamp */}
              <div className="absolute bottom-4 left-4 bg-[#FFD166] border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase tracking-tight -rotate-6 z-10">
                100% 蠢萌认证 🧸
              </div>

              <div className="absolute top-4 right-4 bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 text-[9px] font-mono rounded uppercase tracking-wider z-10 flex items-center gap-1 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block" />
                基因重组中...
              </div>

              {/* Vector Cat SVG Preview Component */}
              <CatPreview config={currentCatConfig} className="w-48 h-48 sm:w-56 sm:h-56 relative z-10" isAnimated={true} />
            </div>

            {/* Specimen Info & Stats Panel (5 columns) */}
            <div className="md:col-span-5 flex flex-col gap-3.5 h-full justify-between">
              
              {/* Interactive Info Board */}
              <div className="bg-white border-2 border-black p-4 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">基因档案报告</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500">外观品种:</span> <strong className="text-black font-extrabold">{BREED_LABELS[selectedBreed]}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">穿戴配件:</span> <strong className="text-black font-extrabold">
                      {selectedAccessories.length > 0 
                        ? selectedAccessories.map(id => ACCESSORIES_LIST.find(a => a.id === id)?.label).join(', ')
                        : '身无分文裸体中'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">性格原罪:</span> <strong className="text-red-600 font-extrabold">{selectedTraits.join(' / ') || '目前表现得像个正常猫'}</strong>
                  </div>
                </div>
              </div>

              {/* Brutalist Brain Cells & Purr Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border-2 border-black p-3.5 relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">🧠 剩余脑细胞</p>
                  <p className="text-2xl font-black text-[#FF4D00] mt-1 font-mono">
                    {selectedBreed === 'orange' ? '0.1' : selectedEye === 'derp' ? '0.05' : '0.5'}
                  </p>
                  <span className="text-[8px] font-bold text-slate-400 absolute bottom-1 right-2">随时短路</span>
                </div>

                <div className="bg-white border-2 border-black p-3.5 relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">🔊 呼噜呼噜声</p>
                  <p className="text-2xl font-black text-green-600 mt-1 font-mono">MAX</p>
                  <span className="text-[8px] font-bold text-slate-400 absolute bottom-1 right-2">震耳欲聋</span>
                </div>
              </div>
            </div>

          </div>

          {/* Section 2: AI Identity Persona Generator */}
          <div className="bg-[#FFFDF5] border-3 border-black p-5 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-[#FF4D00] fill-[#FF4D00]" />
                  <span>AI 喵喵人格诊断 & 戏剧剧本</span>
                </h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  基于你捏出的配饰及习惯，让 Gemini 大脑分析并撰写小猫的“双重猫生”和搞笑行为学！
                </p>
              </div>
              
              <button
                onClick={handleGenerateAIProfile}
                disabled={isGenerating}
                className="px-4 py-2 bg-black hover:bg-[#FFD166] hover:text-black text-white text-xs font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-1"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : '🧠 智能诊断'}
              </button>
            </div>

            {isGenerating ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-600 animate-pulse font-mono">正在破译喵星电波中...</p>
              </div>
            ) : generationError ? (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{generationError}</span>
              </div>
            ) : generatedProfile ? (
              <div className="space-y-3.5 animate-fade-in text-xs">
                
                {/* Generated Identity Info Row */}
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white px-3 py-2 border border-black rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">喵星马甲 (Alias)</span>
                    <strong className="text-sm text-[#FF4D00] font-black">{generatedProfile.funnyName}</strong>
                  </div>
                  <div className="bg-white px-3 py-2 border border-black rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">社会头衔 (Title)</span>
                    <strong className="text-sm text-slate-800 font-black">{generatedProfile.title}</strong>
                  </div>
                </div>

                {/* Secret Backstory */}
                <div className="bg-[#FAF9F6] p-3 border border-dashed border-slate-300 rounded-lg">
                  <span className="text-[10px] text-[#FF4D00] font-black uppercase tracking-wider block mb-1">🎭 绝密双重猫生背景</span>
                  <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
                    {generatedProfile.secretBackground}
                  </p>
                </div>

                {/* Weird Traits */}
                {generatedProfile.traits && generatedProfile.traits.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">🧐 奇怪行为大赏:</span>
                    <ul className="space-y-1">
                      {generatedProfile.traits.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700 font-medium text-[11px]">
                          <span className="text-amber-500 font-mono text-[10px] bg-amber-50 px-1 py-0.2 border border-amber-200 rounded shrink-0">{idx + 1}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            ) : null}
          </div>

          {/* Section 3: Interactive Sandbox Playground (The Core Action simulation) */}
          <div className="flex-1 min-h-[420px]">
            <Playground currentCat={currentCatConfig} savedCats={savedCats} />
          </div>

        </div>

      </main>

      {/* 3. Bottom scrolling marquee with comical cat guidelines */}
      <footer className="h-12 border-t-4 border-black bg-[#1A1A1A] text-[#FAF9F6] flex items-center overflow-hidden z-20">
        <div className="whitespace-nowrap flex gap-12 font-mono text-[11px] uppercase tracking-[0.2em] animate-pulse">
          <span>🚨 猫咪行为守则:</span>
          <span>*</span>
          <span className="text-[#FFD166]">罐罐才是正义 🥫</span>
          <span>*</span>
          <span>红点是无法战胜的幽灵 🔴</span>
          <span>*</span>
          <span className="text-[#A8DADC]">纸箱大过天 📦</span>
          <span>*</span>
          <span>不准摸肚子，否则咬你 😾</span>
          <span>*</span>
          <span>凌晨跑酷是本能，不接受投诉 🏃‍♂️</span>
          <span>*</span>
          <span>脑容量只有0.5g，不要指望听懂名字 🧠</span>
          <span>*</span>
          <span className="text-[#FFD166]">喵呜。</span>
        </div>
      </footer>

    </div>
  );
}
