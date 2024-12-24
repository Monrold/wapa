import { supabase } from "../../lib/supabase";
import type { APIRoute } from "astro";

// Función para validar si el valor es un UUID válido
function isValidUUID(uuid: string): boolean {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(uuid);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("Cuerpo de la solicitud recibido:", body);

    const { user_id, stage_id, sub_index_id, completed } = body;
    console.log("Datos desestructurados:", { user_id, stage_id, sub_index_id, completed });

    if (!user_id || !stage_id || !sub_index_id || completed === undefined) {
      return new Response(
        JSON.stringify({ error: "Faltan parámetros requeridos" }),
        { status: 400 }
      );
    }

    if (
      !isValidUUID(user_id) ||
      !isValidUUID(stage_id) ||
      !isValidUUID(sub_index_id)
    ) {
      return new Response(
        JSON.stringify({ error: "Algunos de los valores no son UUID válidos" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("progress")
      .upsert(
        {
          user_id, // ID del usuario
          stage_id, // ID de la etapa
          sub_index_id, // ID del subíndice
          completed, // Marcar como completado
        },
        { onConflict: "user_id,stage_id,sub_index_id" }
      );

    if (error) {
      console.error("Error al actualizar el progreso:", error.message);  // Log de error
      return new Response(
        JSON.stringify({ error: error.message }), // Devuelve el error exacto de Supabase
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Progreso actualizado correctamente" }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al procesar la solicitud:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
};
