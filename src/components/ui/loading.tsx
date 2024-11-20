import { Loader } from 'lucide-react';

const Loading = () => (
  <div className="w-full h-screen bg-gray-950">
    <Loader className="absolute top-1/2 left-1/2 animate-spin text-white" />
  </div>
);

export default Loading;
