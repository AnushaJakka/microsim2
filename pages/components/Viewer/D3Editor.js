export default function D3Editor({ running, result }) {
  const generateSrcDoc = (script) => `
   ${script}`;

  if (!running) {
    return (
      <div className="w-full min-h-[500px] bg-gray-100 rounded text-sm text-gray-400 flex justify-center items-center">
        No sketches running
      </div>
    );
  }

  return (
    <div className="w-full min-h-[500px] border border-gray-300 rounded">
      <iframe
        width="100%"
        height="500"
        srcDoc={generateSrcDoc(result)}
        sandbox="allow-scripts"
      />
    </div>
  );
}
