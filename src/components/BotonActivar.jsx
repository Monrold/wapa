import React from "react";

function BotonActivar({ onActivate, isDisabled }) {
    return (
        <button
            onClick={onActivate}  // Llama a la función pasada como prop cuando se hace clic
            disabled={isDisabled} // Deshabilita el botón si isDisabled es true
            className={`px-4 py-2 bg-blue-500 text-white rounded-md 
                        hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed 
                        transition-all duration-300`}
        >
            {isDisabled ? "Activado" : "Activar"}
        </button>
    );
}

export default BotonActivar;
