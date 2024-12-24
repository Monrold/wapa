// Archivo: src/utils/progress.js
import { createClient } from "@supabase/supabase.ts";

// Configuración de Supabase
const supabase = createClient(
  import.meta.env.SUPABASE_URL, // Define en tu archivo .env
  import.meta.env.SUPABASE_KEY // Define en tu archivo .env
);

// Función para guardar el progreso
export async function saveProgress({ courseId, step }) {
  // Obtén la sesión del usuario
  const { data: session } = await supabase.auth.getSession();
  const user = session?.session?.user;

  if (!user) {
    console.error("Usuario no autenticado");
    return;
  }

  const USER_ID = user.id;

  // Guarda el progreso
  const { error } = await supabase
    .from("user_progress")
    .upsert({ user_id: USER_ID, course_id: courseId, step });

  if (error) {
    console.error("Error al guardar el progreso:", error);
  } else {
    console.log("Progreso guardado exitosamente");
  }
}
