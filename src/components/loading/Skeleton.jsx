// LoadingComponents.jsx
import React from "react";
import {
  Loader2,
  Circle,
  RotateCw,
  RefreshCw,
  Activity,
  AlertCircle,
} from "lucide-react";

// Skeleton Loaders
export const TextSkeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-5/6"></div>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="flex h-screen animate-pulse">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col gap-4">
        {/* Logo area */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-sm w-3/4 mb-6"></div>

        {/* Navigation items */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-32"></div>
          </div>
        ))}

        {/* Bottom section */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm w-20 mb-2"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-sm w-16"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-sm w-40"></div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Main body */}
        <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page title */}
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-sm w-64 mb-6"></div>

            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
                >
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/2"></div>
                </div>
              ))}
            </div>

            {/* Table skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mt-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-sm w-48 mb-4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-sm w-1/2"></div>
        </div>
      </div>
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <div className="animate-pulse flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
      {Array(columns)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded-sm flex-1"
          ></div>
        ))}
    </div>
  );
};

export const AvatarSkeleton = ({ size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={`${sizes[size]} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse`}
    ></div>
  );
};

// Spinner Loaders
export const Spinner = ({ size = 24, color = "text-blue-500" }) => {
  return (
    <Loader2
      className={`animate-spin ${color} dark:text-blue-400`}
      size={size}
    />
  );
};

export const CircleSpinner = ({ size = 24 }) => {
  return (
    <Circle
      className="animate-spin text-green-500 dark:text-green-400"
      size={size}
    />
  );
};

export const RotatingSpinner = ({ size = 24 }) => {
  return (
    <RotateCw
      className="animate-spin text-purple-500 dark:text-purple-400"
      size={size}
    />
  );
};

export const RefreshSpinner = ({ size = 24 }) => {
  return (
    <RefreshCw
      className="animate-spin text-orange-500 dark:text-orange-400"
      size={size}
    />
  );
};

// Dot Loaders
export const DotsLoader = ({ color = "bg-blue-500" }) => {
  return (
    <div className="flex gap-1">
      <div
        className={`w-2 h-2 ${color} dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]`}
      ></div>
      <div
        className={`w-2 h-2 ${color} dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]`}
      ></div>
      <div
        className={`w-2 h-2 ${color} dark:bg-blue-400 rounded-full animate-bounce`}
      ></div>
    </div>
  );
};

export const PulseDots = () => {
  return (
    <div className="flex gap-2">
      <div className="w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  );
};

// Bar Loaders
export const ProgressBar = ({ progress = 0, showPercentage = false }) => {
  return (
    <div className="w-full">
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {showPercentage && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {progress}%
        </p>
      )}
    </div>
  );
};

export const IndeterminateBar = () => {
  return (
    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <div className="h-full w-1/3 bg-blue-500 dark:bg-blue-400 animate-[slide_1s_ease-in-out_infinite]"></div>
    </div>
  );
};

// Component with loading state
export const LoadingButton = ({
  isLoading = false,
  onClick,
  children,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const variants = {
    primary:
      "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white",
    secondary:
      "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white",
    outline:
      "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800",
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative px-4 py-2 rounded-lg transition-colors 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" size={18} />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Full page loader
export const FullPageLoader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2
          className="animate-spin text-blue-500 dark:text-blue-400 mx-auto mb-4"
          size={48}
        />
        <p className="text-gray-600 dark:text-gray-300">{text}</p>
      </div>
    </div>
  );
};

// Overlay loader
export const OverlayLoader = ({ text = "Loading..." }) => {
  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xs flex items-center justify-center z-40 rounded-lg">
      <div className="text-center">
        <RefreshCw
          className="animate-spin text-purple-500 dark:text-purple-400 mx-auto mb-2"
          size={32}
        />
        <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
      </div>
    </div>
  );
};

// Content loader with error state
export const ContentLoader = ({
  loading = false,
  error = null,
  children,
  loader = <Spinner />,
  errorIcon = <AlertCircle className="text-red-500" size={32} />,
}) => {
  if (loading) {
    return <div className="flex items-center justify-center p-8">{loader}</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        {errorIcon}
        <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
      </div>
    );
  }

  return children;
};

// Infinite scroll loader
export const InfiniteScrollLoader = ({ hasMore = true }) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center p-4">
      <div className="flex items-center gap-2">
        <Activity
          className="animate-spin text-blue-500 dark:text-blue-400"
          size={20}
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Loading more...
        </span>
      </div>
    </div>
  );
};

// Export all loaders as a single object for easy imports
const Loaders = {
  TextSkeleton,
  CardSkeleton,
  TableRowSkeleton,
  AvatarSkeleton,
  Spinner,
  CircleSpinner,
  RotatingSpinner,
  RefreshSpinner,
  DotsLoader,
  PulseDots,
  ProgressBar,
  IndeterminateBar,
  LoadingButton,
  FullPageLoader,
  OverlayLoader,
  ContentLoader,
  InfiniteScrollLoader,
};

export default Loaders;
