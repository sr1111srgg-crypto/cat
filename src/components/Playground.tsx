import React, { useState, useEffect, useRef } from 'react';
import { ActiveCat, InteractableObject, CatConfig, PlayAction } from '../types';
import CatPreview from './CatPreview';
import { Play, Coffee, Sparkles, Trash2, Heart, Award, ArrowUpRight } from 'lucide-react';

interface PlaygroundProps {
  currentCat: CatConfig;
  savedCats: CatConfig[];
}

export default function Playground({ currentCat, savedCats }: PlaygroundProps) {
  const [activeCats, setActiveCats] = useState<ActiveCat[]>([]);
  const [objects, setObjects] = useState<InteractableObject[]>([]);
  const [laserActive, setLaserActive] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);

  // Initialize playground with the current customized cat
  useEffect(() => {
    // If no active cats, spawn the current configured cat at center
    if (activeCats.length === 0) {
      setActiveCats([
        {
          config: currentCat,
          x: 50,
          y: 65,
          action: 'idle',
          direction: 'right',
          hunger: 30,
          energy: 80,
          thoughtBubbleTime: 3,
          currentThought: '喵？这里是什么新大陆吗？',
        },
      ]);
    } else {
      // Keep existing active cats, but update the first one if currentCat config changes in customizer
      setActiveCats((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((ac, idx) => {
          if (idx === 0) {
            return {
              ...ac,
              config: currentCat,
            };
          }
          return ac;
        });
      });
    }
  }, [currentCat]);

  // Spawns a saved cat as a companion in the playground!
  const spawnCompanion = (cat: CatConfig) => {
    if (activeCats.length >= 6) {
      alert('游乐场猫猫太多啦！放不下啦，快送几只去休息吧 (Max 6 cats)');
      return;
    }
    // Random position
    const randX = 20 + Math.random() * 60;
    const randY = 55 + Math.random() * 25;
    const initialThoughts = [
      '嗨！兄弟们，我也来凑热闹了！',
      '听说这里有免费的小鱼干？',
      '是谁在呼唤本大爷？',
      '阳台睡饱了，跑个酷！',
      '这块地毯不错，我宣布它归我了。',
    ];
    const newCompanion: ActiveCat = {
      config: { ...cat, id: `companion_${Date.now()}` },
      x: randX,
      y: randY,
      action: 'idle',
      direction: Math.random() > 0.5 ? 'left' : 'right',
      hunger: 40 + Math.random() * 30,
      energy: 50 + Math.random() * 40,
      thoughtBubbleTime: 4,
      currentThought: initialThoughts[Math.floor(Math.random() * initialThoughts.length)],
    };
    setActiveCats((prev) => [...prev, newCompanion]);
  };

  // Clear companion cats, keeping only the primary customizer cat
  const clearCompanions = () => {
    setActiveCats((prev) => prev.slice(0, 1));
    setObjects([]);
    setLaserActive(false);
    setLaserPos(null);
  };

  // Click on playground: if laser active, place laser; otherwise place general interaction if button clicked
  const handlePlaygroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playgroundRef.current) return;
    const rect = playgroundRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain to playable area floor (y from 45% to 90%)
    if (clickY < 45 || clickY > 90) return;

    if (laserActive) {
      setLaserPos({ x: clickX, y: clickY });
    }
  };

  // Spawns toys/interactables
  const spawnObject = (type: 'food' | 'box' | 'toy_mouse') => {
    const newObj: InteractableObject = {
      id: `${type}_${Date.now()}`,
      type,
      x: 20 + Math.random() * 60,
      y: 60 + Math.random() * 25,
      state: type === 'food' ? 'full' : 'placed',
      pouncedCount: 0,
    };
    setObjects((prev) => [...prev, newObj]);

    // Alert nearest idle/walking cats
    setActiveCats((prev) =>
      prev.map((cat) => {
        if (cat.action === 'idle' || cat.action === 'walking' || cat.action === 'sleeping') {
          const thoughtsMap = {
            food: '天呐！开饭了！真香气！',
            box: '神圣的纸箱！我的猫生避难所！',
            toy_mouse: '那是……一等战利品！',
          };
          return {
            ...cat,
            action: 'walking' as PlayAction,
            targetX: newObj.x,
            targetY: newObj.y,
            currentThought: thoughtsMap[type],
            thoughtBubbleTime: 4,
          };
        }
        return cat;
      })
    );
  };

  // Core Game Loop / Simulation Tick (Runs every 100ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCats((prevCats) => {
        return prevCats.map((cat) => {
          let { x, y, targetX, targetY, action, direction, hunger, energy, thoughtBubbleTime, currentThought, insideBoxId } = cat;

          // 1. Decay stats slightly
          hunger = Math.min(100, hunger + 0.15);
          energy = Math.max(0, energy - 0.1);

          // 2. Reduce thought bubble timer
          if (thoughtBubbleTime > 0) {
            thoughtBubbleTime -= 0.1;
          } else {
            currentThought = undefined;
          }

          // 3. LASER POINTER CHASE (Highest Priority!)
          if (laserActive && laserPos) {
            targetX = laserPos.x;
            targetY = laserPos.y;
            action = 'running';
            insideBoxId = undefined; // Jump out of box immediately
          }

          // 4. If hunger is high and food exists, seek food (unless laser active)
          if (hunger > 60 && !laserActive && action !== 'eating' && objects.length > 0) {
            const foodObj = objects.find((o) => o.type === 'food' && o.state === 'full');
            if (foodObj) {
              targetX = foodObj.x;
              targetY = foodObj.y;
              action = 'walking';
              insideBoxId = undefined;
              if (!currentThought) {
                currentThought = '肚子咕噜噜……开饭开饭！';
                thoughtBubbleTime = 3;
              }
            }
          }

          // 5. If box exists and cat is idle, seek box (highly likely!)
          if (action === 'idle' && !laserActive && Math.random() < 0.05 && objects.length > 0) {
            const boxObj = objects.find((o) => o.type === 'box');
            if (boxObj && !prevCats.some((c) => c.insideBoxId === boxObj.id)) {
              targetX = boxObj.x;
              targetY = boxObj.y;
              action = 'walking';
              if (!currentThought) {
                currentThought = '哼，愚蠢的人类放了一个纸箱，正合我意。';
                thoughtBubbleTime = 3.5;
              }
            }
          }

          // 6. RANDOM ROAMING (When no target exists)
          if (!targetX || !targetY) {
            if (action === 'walking' || action === 'running') {
              action = 'idle';
            }

            // High energy cats do random parkour (zoomies)
            if (action === 'idle' && energy > 70 && Math.random() < 0.04) {
              targetX = 15 + Math.random() * 70;
              targetY = 55 + Math.random() * 30;
              action = Math.random() > 0.5 ? 'running' : 'walking';
              const zoomieThoughts = ['铲屎的！看我的极速漂移！', '啊啊啊有隐形的怪兽在追我！', '突然嗨起来了！乌拉！'];
              currentThought = zoomieThoughts[Math.floor(Math.random() * zoomieThoughts.length)];
              thoughtBubbleTime = 3;
            }
            // Standard roaming
            else if (action === 'idle' && Math.random() < 0.02) {
              targetX = 15 + Math.random() * 70;
              targetY = 55 + Math.random() * 30;
              action = 'walking';
            }
            // Sleep when energy is low
            else if (action === 'idle' && energy < 25 && Math.random() < 0.05) {
              action = 'sleeping';
              currentThought = '呼噜噜……电量耗尽，休眠中。';
              thoughtBubbleTime = 5;
            }
            // Wake up from sleeping randomly
            else if (action === 'sleeping' && energy > 65 && Math.random() < 0.01) {
              action = 'idle';
              currentThought = '哈欠——睡了一觉神清气爽！';
              thoughtBubbleTime = 3.5;
            }
            // Idle sitting or cleaning
            else if (action === 'idle' && Math.random() < 0.01) {
              const idleThoughts = [
                '在？给个罐罐？',
                '盯着那个角落，其实那里什么都没有（吓死你）。',
                '在思考宇宙的终极奥秘，比如为什么我的尾巴不听话。',
                '今天天气真好，适合发呆。',
                '我的肉垫软绵绵的，你要摸摸吗？',
              ];
              currentThought = idleThoughts[Math.floor(Math.random() * idleThoughts.length)];
              thoughtBubbleTime = 4;
            }
          }

          // 7. MOVEMENT PHYSICS (Incrementally move cat to target)
          if (targetX !== undefined && targetY !== undefined) {
            const dx = targetX - x;
            const dy = targetY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 2) {
              // Set speed based on action
              const speed = action === 'running' ? 1.8 : 0.8;
              x += (dx / distance) * speed;
              y += (dy / distance) * speed;

              // Update direction
              direction = dx > 0 ? 'right' : 'left';
            } else {
              // Target Reached! Resolve Action
              const reachedX = targetX;
              const reachedY = targetY;
              targetX = undefined;
              targetY = undefined;

              // Check if we reached a laser pointer
              if (laserActive && laserPos && Math.abs(reachedX - laserPos.x) < 4) {
                action = 'pouncing';
                currentThought = '抓到了！看我的飞扑大咬！';
                thoughtBubbleTime = 3;
                energy = Math.max(0, energy - 10);
                setTimeout(() => {
                  setLaserPos(null); // Clear laser
                }, 1000);
              }
              // Check if we reached a food bowl
              else {
                const closeFood = objects.find(
                  (o) => o.type === 'food' && o.state === 'full' && Math.abs(o.x - reachedX) < 6 && Math.abs(o.y - reachedY) < 6
                );
                if (closeFood) {
                  action = 'eating';
                  currentThought = '嚼吧嚼吧……太美味了叭！';
                  thoughtBubbleTime = 4;
                  // Eat food sequence
                  setTimeout(() => {
                    setObjects((prevObjs) =>
                      prevObjs.map((o) => (o.id === closeFood.id ? { ...o, state: 'empty' } : o))
                    );
                    setActiveCats((cats) =>
                      cats.map((c) =>
                        c.config.id === cat.config.id
                          ? { ...c, hunger: 0, energy: Math.min(100, c.energy + 20), action: 'idle', currentThought: '吃饱饱，肚皮圆滚滚！', thoughtBubbleTime: 4 }
                          : c
                      )
                    );
                  }, 2000);
                } else {
                  // Check if we reached a box
                  const closeBox = objects.find(
                    (o) => o.type === 'box' && Math.abs(o.x - reachedX) < 6 && Math.abs(o.y - reachedY) < 6
                  );
                  if (closeBox) {
                    action = 'in_box';
                    insideBoxId = closeBox.id;
                    currentThought = '完美贴合！这个盒子就是我的本命！';
                    thoughtBubbleTime = 4.5;
                  } else {
                    // Just standard roaming target reached
                    action = 'idle';
                  }
                }
              }
            }
          }

          // If sleeping, regain energy
          if (action === 'sleeping') {
            energy = Math.min(100, energy + 0.8);
          }

          return {
            ...cat,
            x,
            y,
            targetX,
            targetY,
            action,
            direction,
            hunger,
            energy,
            thoughtBubbleTime,
            currentThought,
            insideBoxId,
          };
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, [laserActive, laserPos, objects]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Playground Header / Controller */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono">
            喵喵游乐场 & 互动沙盒
          </h2>
        </div>

        {/* Dynamic toys dispenser */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={() => setLaserActive(!laserActive)}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium transition-all ${
              laserActive
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            红点激光笔 {laserActive ? 'ON (点击地面)' : 'OFF'}
          </button>

          <button
            onClick={() => spawnObject('food')}
            className="px-3 py-1.5 rounded-full bg-slate-850 border border-slate-750 text-slate-200 hover:bg-slate-750 transition-all flex items-center gap-1"
          >
            罐罐饲料 🥣
          </button>

          <button
            onClick={() => spawnObject('box')}
            className="px-3 py-1.5 rounded-full bg-slate-850 border border-slate-750 text-slate-200 hover:bg-slate-750 transition-all flex items-center gap-1"
          >
            万能纸箱 📦
          </button>

          <button
            onClick={() => spawnObject('toy_mouse')}
            className="px-3 py-1.5 rounded-full bg-slate-850 border border-slate-750 text-slate-200 hover:bg-slate-750 transition-all flex items-center gap-1"
          >
            发条假鼠 🐭
          </button>

          {activeCats.length > 1 && (
            <button
              onClick={clearCompanions}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-red-900/50 hover:text-red-400 text-slate-400 transition-all ml-1"
              title="清空伴侣猫和道具"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Cozy Living Room Stage */}
      <div
        ref={playgroundRef}
        onClick={handlePlaygroundClick}
        className={`flex-1 relative overflow-hidden transition-all ${
          laserActive ? 'cursor-crosshair' : 'cursor-default'
        }`}
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
        }}
      >
        {/* Background Illustrative Accents (Cozy room vibes) */}
        {/* Modern Wallpaper Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Window with moon & stars */}
        <div className="absolute top-10 left-12 w-32 h-44 rounded-t-full border-4 border-slate-800 bg-slate-950/60 overflow-hidden shadow-inner flex flex-col items-center justify-center pointer-events-none">
          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-100/90 shadow-[0_0_15px_rgba(253,230,138,0.3)]" />
          <div className="w-full h-1 bg-slate-800 mt-16" />
          <div className="w-1 h-full bg-slate-800" />
        </div>

        {/* Potted Plant */}
        <div className="absolute bottom-28 left-4 w-12 h-20 opacity-40 pointer-events-none flex flex-col items-center justify-end">
          <div className="w-8 h-10 bg-emerald-600 rounded-t-full transform rotate-12 origin-bottom" />
          <div className="w-7 h-11 bg-emerald-500 rounded-t-full transform -rotate-12 origin-bottom -mt-8" />
          <div className="w-10 h-6 bg-slate-700 rounded-b-lg" />
        </div>

        {/* Cozy Rug (Where cats hang out) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-36 bg-slate-800/45 rounded-[100px] border border-slate-700/30 blur-[1px] pointer-events-none shadow-inner" />

        {/* 1. RENDER INTERACTABLE TOYS */}
        {objects.map((obj) => (
          <div
            key={obj.id}
            style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300"
          >
            {obj.type === 'food' && (
              <div className="flex flex-col items-center">
                {obj.state === 'full' ? (
                  <div className="relative">
                    {/* Munching sparkles */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs">🍲</div>
                    <div className="w-8 h-5 bg-amber-500 rounded-b-full border border-amber-600 shadow flex items-center justify-center text-[8px] font-bold text-white uppercase">
                      Kibble
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-3 bg-slate-700 rounded-b-full border border-slate-600 shadow flex items-center justify-center text-[6px] text-slate-400">
                    EMPTY
                  </div>
                )}
              </div>
            )}

            {obj.type === 'box' && (
              <div className="relative w-16 h-10 bg-amber-800/90 rounded border-b-4 border-amber-950 shadow-lg flex items-center justify-center">
                {/* Flaps */}
                <div className="absolute -top-3 left-0 w-8 h-4 bg-amber-700 rounded transform -rotate-12 origin-bottom-left border border-amber-800" />
                <div className="absolute -top-3 right-0 w-8 h-4 bg-amber-700 rounded transform rotate-12 origin-bottom-right border border-amber-800" />
                <span className="text-[10px] font-mono font-bold text-amber-950/70 tracking-widest uppercase">Amazon</span>
              </div>
            )}

            {obj.type === 'toy_mouse' && (
              <div className="relative text-lg transform hover:scale-125 transition-transform duration-200">
                🐭
              </div>
            )}
          </div>
        ))}

        {/* 2. RENDER ACTIVE CATS WITH STATE LOGIC */}
        {activeCats.map((cat, idx) => {
          const isWalking = cat.action === 'walking' || cat.action === 'running';
          const isSleeping = cat.action === 'sleeping';
          const isInBox = cat.action === 'in_box';

          return (
            <div
              key={cat.config.id}
              style={{
                left: `${cat.x}%`,
                top: `${cat.y}%`,
                zIndex: Math.floor(cat.y),
              }}
              className="absolute -translate-x-1/2 -translate-y-[85%] transition-all duration-100 ease-out flex flex-col items-center"
            >
              {/* Dynamic Thought Bubble above the cat */}
              {cat.currentThought && (
                <div className="absolute bottom-[110%] w-36 px-2.5 py-1.5 bg-white text-slate-800 text-[10px] leading-snug rounded-xl shadow-xl border border-slate-100 z-50 text-center animate-fade-in pointer-events-none">
                  {cat.currentThought}
                  {/* Little thought tail */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-2 h-2 bg-white rotate-45 border-r border-b border-slate-100" />
                </div>
              )}

              {/* Status Mini-Badge for Companions/Active Cat */}
              <div className="absolute -top-6 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-full text-[8px] font-mono text-slate-400">
                <span className="text-slate-200 truncate max-w-[50px]">{cat.config.name || '喵喵'}</span>
                {isSleeping && <span className="text-indigo-400 animate-pulse">💤</span>}
                {cat.action === 'eating' && <span className="text-yellow-400">😋</span>}
                {cat.action === 'running' && <span className="text-red-400">🔥</span>}
              </div>

              {/* Box Cover Overlay (If inside Box) */}
              {isInBox ? (
                <div className="relative flex flex-col items-center">
                  {/* Cat Peeking Head */}
                  <div className="w-20 h-16 overflow-hidden flex items-end justify-center -mb-2">
                    <CatPreview
                      config={cat.config}
                      className="w-20 h-20 transform scale-75 origin-bottom"
                      isAnimated={true}
                    />
                  </div>
                  {/* Box foreground */}
                  <div className="w-16 h-9 bg-amber-800 border-t border-amber-700/50 rounded-b shadow-md flex items-center justify-center z-30">
                    <span className="text-[7px] text-amber-950/50 font-bold tracking-widest uppercase">My Nest</span>
                  </div>
                </div>
              ) : (
                /* Standard Cat Rendering */
                <div
                  className={`transition-transform duration-200 ${
                    cat.direction === 'left' ? 'scale-x-[-1]' : 'scale-x-[1]'
                  } ${
                    isWalking ? 'animate-bounce' : ''
                  }`}
                  style={{
                    animationDuration: cat.action === 'running' ? '0.4s' : '0.8s',
                  }}
                >
                  <CatPreview
                    config={cat.config}
                    className={`${idx === 0 ? 'w-24 h-24' : 'w-20 h-20'} drop-shadow-md`}
                    isAnimated={!isSleeping}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* 3. RED LASER DOT IMPACT VISUAL */}
        {laserActive && laserPos && (
          <div
            style={{ left: `${laserPos.x}%`, top: `${laserPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
          >
            {/* Pulsing Red Dot */}
            <div className="w-4 h-4 bg-red-600 rounded-full animate-ping opacity-75 absolute -left-1 -top-1" />
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#f87171] ring-2 ring-red-300" />
          </div>
        )}
      </div>

      {/* Spawn Companion Cat Footer Panel */}
      {savedCats.length > 0 && (
        <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-3 overflow-x-auto min-h-[64px] scrollbar-thin scrollbar-thumb-slate-800">
          <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
            <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
            猫猫同伴栏:
          </span>
          <div className="flex items-center gap-2">
            {savedCats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => spawnCompanion(cat)}
                className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-850 hover:border-slate-600 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
              >
                <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-850 flex items-center justify-center">
                  <div className="transform scale-150">
                    <CatPreview config={cat} className="w-5 h-5" isAnimated={false} />
                  </div>
                </div>
                <span>{cat.name || '无名喵'}</span>
                <ArrowUpRight className="w-2.5 h-2.5 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
