export const ResultBox = ({ results }) => {
  return (
    <div class="h-3/4 w-3/4 rounded-lg border-2 border-gray-400 bg-gray-700 px-4 py-2">
      <p class="text-4xl text-white">
        {results
          ? results.map((result, idx) => (
              <span class="text-xl">
                {result}
                {idx < results.length - 1 ? ", " : ""}
              </span>
            ))
          : "No results yet"}
      </p>
    </div>
  );
};
