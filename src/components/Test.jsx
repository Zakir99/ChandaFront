// Example usage in your app
import React, { useState } from 'react';
import {
  TextSkeleton,
  CardSkeleton,
  Spinner,
  DotsLoader,
  LoadingButton,
  ContentLoader,
  ProgressBar,
  FullPageLoader,
  TableRowSkeleton,
  AvatarSkeleton,
  CircleSpinner,
  RotatingSpinner,
  RefreshSpinner,
  PageSkeleton
} from '../components/loading/Skeleton';

const YourComponent = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setLoading(true);
    setError(null);
    
    // Simulate loading with progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setLoading(false);
        setProgress(0);
      }
    }, 300);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Section 1: Skeleton Loaders */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skeleton Loaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <TextSkeleton />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <CardSkeleton />
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <AvatarSkeleton size="lg" />
          </div>
        </div>
      </section>

      {/* Section 2: Spinner Loaders */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Spinner Loaders</h2>
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Spinner />
          <CircleSpinner />
          <RotatingSpinner />
          <RefreshSpinner />
          <DotsLoader />
        </div>
      </section>

      {/* Section 3: Interactive Loaders */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Interactive Loaders</h2>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
          <div className="flex gap-2">
            <LoadingButton 
              isLoading={loading} 
              onClick={handleLoad}
              variant="primary"
            >
              Start Loading
            </LoadingButton>
            
            <LoadingButton 
              isLoading={false} 
              variant="outline"
            >
              Cancel
            </LoadingButton>
          </div>

          {loading && (
            <div className="space-y-2">
              <ProgressBar progress={progress} showPercentage />
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Content Loader with Error State */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content Loader</h2>
        <ContentLoader 
          loading={loading} 
          error={error}
          loader={<Spinner size={32} />}
        >
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              This content is only visible when not loading and no errors.
            </p>
          </div>
        </ContentLoader>
      </section>

      {/* Section 5: Table Row Skeleton */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Table Loading</h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-800 p-3">
            <div className="flex gap-4">
              <div className="flex-1 font-medium">Name</div>
              <div className="flex-1 font-medium">Email</div>
              <div className="flex-1 font-medium">Role</div>
              <div className="flex-1 font-medium">Status</div>
            </div>
          </div>
          {loading ? (
            <>
              <TableRowSkeleton columns={4} />
              <TableRowSkeleton columns={4} />
              <TableRowSkeleton columns={4} />
            </>
          ) : (
            <div className="p-4 text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>
      </section>

      {/* Page skeleton */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Page Skeleton</h2>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <PageSkeleton />
        </div>
      </section>

      {/* Full page loader demo */}
      {loading && <FullPageLoader text="Processing your request..." />}
    </div>
  );
};

export default YourComponent;