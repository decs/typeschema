export default function Hero(): JSX.Element {
  return (
    <div className="text-center my-12">
      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-3 text-[#3d4a44]">
        Universal adapter{' '}
        <span className="whitespace-nowrap">for schema validation.</span>
      </h1>
      <p className="mx-auto max-w-lg text-sm md:text-md lg:text-lg font-medium text-[#748a8b]">
        Experience the flexibility of writing{' '}
        <span className="text-[#3178c6]">TypeScript</span> code that works with
        any runtime type check library.
      </p>
      <div className="mx-auto w-fit flex flex-row mt-6">
        <a
          href="https://github.com/decs/typeschema"
          target="_blank"
          rel="noopener"
          className="inline-block mx-2 inline-grid appearance-none grid-flow-col items-center justify-center gap-1 rounded-md px-2 py-1.5 text-sm font-bold tracking-normal no-underline shadow-xl shadow-[#95e16844] transition-all duration-300 hover:no-underline sm:gap-1.5 sm:px-4 sm:py-2 sm:text-base bg-gradient-to-r from-[#95e16899] to-[#03c77299] text-[#3d4a44] hover:text-[#459265] lg:text-lg"
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="3"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="18"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Star
          <span className="w-full overflow-hidden whitespace-nowrap max-w-[100px] opacity-100">
            142
          </span>
        </a>
        <a
          className="inline-block mx-2 inline-grid appearance-none grid-flow-col items-center justify-center gap-1 rounded-md px-2 py-1.5 text-sm font-bold tracking-normal no-underline shadow-xl shadow-[#57686944] transition-all duration-300 hover:no-underline sm:gap-1.5 sm:px-4 sm:py-2 sm:text-base bg-[#3d4a44] text-white hover:bg-[#576869] lg:text-lg"
          rel=""
          href="/docs/quickstart"
        >
          Quickstart
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="3"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </div>
  );
}
