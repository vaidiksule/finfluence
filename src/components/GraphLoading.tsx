'use client';

export default function GraphLoading() {
  return (
    <div className="graph-canvas-surface relative flex h-full w-full items-center justify-center overflow-hidden text-zinc-300">
      <div className="graph-loader" aria-label="Preparing market graph" role="status">
        <div className="graph-loader-orbit graph-loader-orbit-one" />
        <div className="graph-loader-orbit graph-loader-orbit-two" />
        <span className="graph-loader-node graph-loader-node-one" />
        <span className="graph-loader-node graph-loader-node-two" />
        <span className="graph-loader-node graph-loader-node-three" />
        <div className="graph-loader-core" />
        <div className="mt-7 text-center">
          <p className="font-amaranth text-base tracking-wide text-white">Finfluence</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">Mapping market relationships</p>
        </div>
      </div>
    </div>
  );
}
