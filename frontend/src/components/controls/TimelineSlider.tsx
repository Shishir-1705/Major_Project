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
    <div className="bg-[#080D18]/95 border border-[#26354A] backdrop-blur-md rounded-2xl p-1.5 sm:p-2.5 shadow-floating flex items-center space-x-1.5 sm:space-x-3 select-none max-w-full">
      {/* Play / Pause Toggle */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#111C2E] text-[#19D3C5] border border-[#26354A] flex items-center justify-center hover:bg-[#162238] focus-visible:ring-2 focus-visible:ring-[#19D3C5] focus-visible:outline-hidden transition-colors shadow-2xs shrink-0 cursor-pointer"
        title={isPlaying ? 'Pause Timeline Playback' : 'Start Timeline Playback'}
        aria-label={isPlaying ? 'Pause Timeline Playback' : 'Start Timeline Playback'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />}
      </button>

      {/* Step Left / Right */}
      <div className="flex items-center space-x-0.5 sm:space-x-1 shrink-0">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1 rounded-lg text-[#8291A8] hover:text-[#F5F7FB] focus-visible:ring-2 focus-visible:ring-[#19D3C5] focus-visible:outline-hidden disabled:opacity-30 disabled:hover:text-[#8291A8] transition-colors cursor-pointer"
          title="Previous Observation"
          aria-label="Previous Observation"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Current Date Badge */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 px-2 py-1 rounded-lg bg-[#0D1525] border border-[#26354A] font-mono text-[11px] sm:text-xs font-bold text-[#F5F7FB] shadow-2xs shrink-0">
          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8291A8]" />
          <span>{selectedDate}</span>
          <span className="text-[10px] font-sans font-medium text-[#19D3C5] px-1.5 py-0.2 rounded bg-[#111C2E] border border-[#26354A] hidden sm:inline">
            {OBSERVATION_DATES[currentIndex]?.satellite}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === OBSERVATION_DATES.length - 1}
          className="p-1 rounded-lg text-[#8291A8] hover:text-[#F5F7FB] focus-visible:ring-2 focus-visible:ring-[#19D3C5] focus-visible:outline-hidden disabled:opacity-30 disabled:hover:text-[#8291A8] transition-colors cursor-pointer"
          title="Next Observation"
          aria-label="Next Observation"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Discrete 8 Timeline Nodes */}
      <div className="flex items-center space-x-2 pl-1.5 sm:pl-2 border-l border-[#26354A] overflow-x-auto min-w-0" role="group" aria-label="Timeline dates">
        {OBSERVATION_DATES.map((item) => {
          const isSelected = item.date === selectedDate;
          return (
            <button
              key={item.date}
              onClick={() => handleSelectDate(item.date)}
              className="group relative flex flex-col items-center py-0.5 focus-visible:ring-2 focus-visible:ring-[#19D3C5] focus-visible:outline-hidden rounded-md transition-all shrink-0 cursor-pointer"
              title={`${item.date} (${item.satellite})`}
              aria-label={`Select observation date ${item.date}`}
              aria-pressed={isSelected}
            >
              <div
                className={`w-3 h-3 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-[#19D3C5] border-[#19D3C5] scale-125 shadow-xs ring-2 ring-[#19D3C5]/30'
                    : 'bg-[#162238] border-[#26354A] group-hover:bg-[#374b66]'
                }`}
              />
              <span className={`text-[9.5px] font-mono mt-1 ${isSelected ? 'text-[#19D3C5] font-bold' : 'text-[#8291A8] group-hover:text-[#A8B5C9]'}`}>
                {formatDateLabel(item.date)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
