import React from 'react';
import { useTheme } from 'next-themes';
import './AnimatedToggle.css';

export const AnimatedToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className="toggle"
      aria-pressed={isDark}
      title="Toggle Dark Mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span className="toggle__content">
        <svg aria-hidden={true} className="toggle__backdrop" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 290 228">
          <g className="clouds">
            <path fill="#D9D9D9" d="M335 147.5c0 27.89-22.61 50.5-50.5 50.5a50.78 50.78 0 0 1-9.29-.853c-2.478 12.606-10.595 23.188-21.615 29.011C245.699 243.749 228.03 256 207.5 256a50.433 50.433 0 0 1-16.034-2.599A41.811 41.811 0 0 1 166 262a41.798 41.798 0 0 1-22.893-6.782A42.21 42.21 0 0 1 135 256a41.82 41.82 0 0 1-19.115-4.592A41.84 41.84 0 0 1 88 262c-1.827 0-3.626-.117-5.391-.343C74.911 270.448 63.604 276 51 276c-23.196 0-42-18.804-42-42s18.804-42 42-42c1.827 0 3.626.117" />
          </g>
        </svg>
        <span aria-hidden={true} className="pilot__container">
          <span className="pilot-bear">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1448 938">
              <path fill="#AF7128" d="M869.02 210.61c16.067-3.967 27.98-18.476 27.98-35.768C897 154.495 880.505 138 860.158 138c-14.337 0-26.761 8.19-32.85 20.146C815.313 151.674 801.586 148 787 148h-20c-14.52 0-28.19 3.641-40.146 10.059C720.749 146.15 708.351 138 694.048 138c-20.347 0-36.842 16.495-36.842 36.842 0 17.222 11.818 31.685 27.787 35.72A85.104 85.104 0 0 0 682 233v225c0 12.15 9.85 22 22 22h44c12.15 0 22-9.85 22-22v-28.69a41.072 41.072 0 0 0 14 .174V458" />
              <path fill="#000" d="M730.414 240a8.079 8.079 0 1 0 0 16.158 8.079 8.079 0 0 0 0-16.158ZM839 240a8.079 8.079 0 1 0 0 16.158 8.079 8.079 0 0 0 0-16.158Z" />
            </svg>
          </span>
        </span>
        <svg aria-hidden={true} className="toggle__backdrop" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 290 228">
          <g className="clouds">
            <path fill="#fff" d="M328 167.5c0 15.214-7.994 28.56-20.01 36.068.007.31.01.621.01.932 0 23.472-19.028 42.5-42.5 42.5-3.789 0-7.461-.496-10.957-1.426C249.671 263.676 233.141 277 213.5 277" />
          </g>
        </svg>
        <span className="toggle__indicator-wrapper">
          <span className="toggle__indicator">
            <span className="toggle__star">
              <span className="sun">
                <span className="moon">
                  <span className="moon__crater"></span>
                  <span className="moon__crater"></span>
                  <span className="moon__crater"></span>
                </span>
              </span>
            </span>
          </span>
        </span>
        <svg aria-hidden={true} className="toggle__backdrop" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 290 228">
          <g className="stars">
            <path fill="#fff" d="M61 11.5a.75.75 0 0 1 .721.544l.813 2.846" />
            <path fill="#fff" d="M62.5 45.219a.329.329 0 0 1 .315.238l.356 1.245" />
          </g>
        </svg>
      </span>
    </button>
  );
};
