function Display({ expression, result }) {
  const displayValue = result || expression || '0';

  return (
    <div className="flex flex-col items-end justify-end px-6 py-5 bg-black/20 rounded-xl min-h-[120px] mb-4 overflow-hidden border border-[#2F293A]/50">
      <div className="text-gray-500 text-lg sm:text-xl font-mono truncate max-w-full min-h-[1.5rem]">
        {expression || '\u00A0'}
      </div>
      <div className="text-white text-3xl sm:text-4xl md:text-5xl font-light truncate max-w-full transition-all duration-200">
        {displayValue}
      </div>
    </div>
  );
}

export default Display;
