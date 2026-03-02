import React from "react";

function Label({text,htmlFor}){
    return(
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-300 mb-2">
            {text}
        </label>
    );
}