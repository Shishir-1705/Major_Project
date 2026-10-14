import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { OBSERVATION_DATES } from '../../config/constants';
import { Calendar, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

export const TimelineSlider: React.FC = () => {
  const { selectedDate, setSelectedDate, backendConnected, addToast } = useAppStore();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const currentIndex = OBSERVATION_DATES.findIndex((d) => d.date === selectedDate);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    if (!backendConnected) {
      addToast({
        type: 'warning',
        title: 'Offline Date Selection',
        message: `Date updated to ${date}. Start FastAPI server for live satellite tiles & statistics.`,
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleSelectDate(OBSERVATION_DATES[currentIndex - 1].date);
    }
  };

  const handleNext = () => {
    if (currentIndex < OBSERVATION_DATES.length - 1) {
      handleSelectDate(OBSERVATION_DATES[currentIndex + 1].date);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && backendConnected) {
      interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % OBSERVATION_DATES.length;
        setSelectedDate(OBSERVATION_DATES[nextIndex].date);
      }, 2000);
    } else if (isPlaying && !backendConnected) {
      setIsPlaying(false);
      addToast({
        type: 'warning',
        title: 'Playback Paused',
        message: 'Timeline playback paused because analysis server is offline.',
      });
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, backendConnected, setSelectedDate, addToast]);

  // Format date display: e.g., '2023-04-01' -> '01 Apr'
  const formatDateLabel = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mIdx = parseInt(parts[1], 10) - 1;
    return `${parts[2]} ${monthNames[mIdx] || parts[1]}`;
  };

  return (
    <div className="bg-white/95 border border-slate-200/80 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-floating flex items-center space-x-2 sm:space-x-3 select-none">
      {/* Play / Pause Toggle */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center hover:bg-teal-100 transition-colors shadow-2xs"
        title={isPlaying ? 'Pause Timeline Playback' : 'Start Timeline Playback'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Step Left / Right */}
      <div className="flex items-center space-x-1">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          title="Previous Observation"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Current Date Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-900 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{selectedDate}</span>
          <span className="text-[10px] font-sans font-medium text-teal-800 px-1.5 py-0.2 rounded bg-teal-50 border border-teal-200/80 hidden sm:inline">
            {OBSERVATION_DATES[currentIndex]?.satellite}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === OBSERVATION_DATES.length - 1}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          title="Next Observation"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Discrete 8 Timeline Nodes */}
      <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 overflow-x-auto">
        {OBSERVATION_DATES.map((item) => {
          const isSelected = item.date === selectedDate;
          return (
            <button
              key={item.date}
              onClick={() => handleSelectDate(item.date)}
              className="group relative flex flex-col items-center py-0.5 transition-all shrink-0"
              title={`${item.date} (${item.satellite})`}
            >
              <div
                className={`w-3 h-3 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-teal-600 border-teal-200 scale-125 shadow-xs ring-2 ring-teal-500/20'
                    : 'bg-slate-300 border-slate-200 group-hover:bg-slate-400'
                }`}
              />
              <span className={`text-[9.5px] font-mono mt-1 ${isSelected ? 'text-teal-700 font-bold' : 'text-slate-500 group-hover:text-slate-800'}`}>
                {formatDateLabel(item.date)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
