import style from "./spinner.module.css";

type SpinnerProps = {
  isDark?: number;
  onClose?: () => void;
};

export const Spinner = ({ isDark = 0 }: SpinnerProps) => {
  const isDarkMode = Boolean(isDark);
  const containerClass = isDarkMode
    ? style.blockingOverlay
    : style.passiveOverlay;
  const bgColor = isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)";
  const mainColor = isDarkMode ? "#ffffff" : "#3498db";

  return (
    <div
      className={containerClass}
      style={{
        cursor: !isDarkMode ? "default" : "wait",
        backgroundColor: bgColor,
      }}
    >
      <svg
        className={style.spinner}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        width="27%"
      >
        <defs>
          <clipPath id="bubble-area">
            <rect x="0" y="0" width="120" height="80" />
          </clipPath>
        </defs>

        <g clipPath="url(#bubble-area)" fill={mainColor} opacity="0.6">
          <circle cx="40" cy="90" r="5">
            <animate
              attributeName="cy"
              from="90"
              to="-10"
              dur="2s"
              repeatCount="indefinite"
              begin="0s"
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="2s"
              repeatCount="indefinite"
              begin="0s"
            />
          </circle>
          <circle cx="60" cy="90" r="7">
            <animate
              attributeName="cy"
              from="90"
              to="-10"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>
          <circle cx="80" cy="90" r="4">
            <animate
              attributeName="cy"
              from="90"
              to="-10"
              dur="1.8s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="1.8s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
          <circle cx="50" cy="90" r="3">
            <animate
              attributeName="cy"
              from="90"
              to="-10"
              dur="2.2s"
              repeatCount="indefinite"
              begin="1.5s"
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="2.2s"
              repeatCount="indefinite"
              begin="1.5s"
            />
          </circle>
        </g>

        <text
          x="60"
          y="100"
          textAnchor="middle"
          fill={mainColor}
          style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}
        >
          loading
          <tspan>
            .
            <animate
              attributeName="opacity"
              values="0;1;1;1;0"
              keyTimes="0;0.25;0.5;0.75;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </tspan>
          <tspan>
            .
            <animate
              attributeName="opacity"
              values="0;0;1;1;0"
              keyTimes="0;0.25;0.5;0.75;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </tspan>
          <tspan>
            .
            <animate
              attributeName="opacity"
              values="0;0;0;1;0"
              keyTimes="0;0.25;0.5;0.75;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </tspan>
        </text>
      </svg>
    </div>
  );
};
