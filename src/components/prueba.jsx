import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Asegúrate de importar el cliente de Supabase

function CheckBox() {
    const [isChecked, setIsChecked] = useState(false);
    const userId = "user-id"; // Aquí deberías poner el ID del usuario autenticado

    // Cargar el estado del checkbox desde Supabase cuando el componente se monta
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("profile")
                .select("is_checked")
                .eq("id", userId)
                .single(); // Trae solo un registro

            if (error) {
                console.error('Error al obtener el estado:', error);
                return;
            }

            // Si se encontró el estado, actualizamos el estado local
            setIsChecked(data?.is_checked || false);
        };

        fetchData();
    }, [userId]);

    // Función para manejar el cambio del checkbox
    const handleChange = async (event) => {
        const newCheckedState = event.target.checked;
        setIsChecked(newCheckedState);

        // Actualizar el estado en Supabase
        const { error } = await supabase
            .from("profile")
            .upsert([
                {
                    id: userId,  // Asegúrate de que el `id` coincida con el usuario autenticado
                    is_checked: newCheckedState,
                }
            ]);

        if (error) {
            console.error('Error al actualizar el estado:', error);
        } else {
            console.log('Estado actualizado en Supabase');
        }
    };

    return (
        <div className="p-4">
            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleChange}
                    className="w-5 h-5"
                />
                <span>{isChecked ? 'Activado' : 'Desactivado'}</span>
            </label>
        </div>
    );
}

export default CheckBox;
