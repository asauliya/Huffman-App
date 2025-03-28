const ProgressBar = (props) => {

  return (
    <div className="w-full max-w-md mx-auto mt-10">
            {/* Dynamic Text */}
            <p className="text-center text-lg font-semibold mb-2">{props.statusText}</p>
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ width: `${props.progress}%` }}
        ></div>
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">{props.progress}%</p>
    </div>
  );
};

export default ProgressBar;
