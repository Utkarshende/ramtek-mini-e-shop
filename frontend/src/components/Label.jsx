import React from "react";

function Label({text}){
    return(
        <label className="block text-sm font-semibold text-slate-300 mb-2">
            {text}
        </label>
    );
}