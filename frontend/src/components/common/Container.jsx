import React from "react";

function Container({children}) {
  return (
    <div className="min-h-creen bg-slate-950 text-white px-6">
      {children}
    </div>
  )
}

export default Container
