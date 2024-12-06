// Con `output: 'hybrid'` configurado:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString();

  if (!email || !password || !fullName) {
    return new Response("Correo electrónico, contraseña y nombre completo son obligatorios", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,  // Envía el nombre completo como parte de los metadatos
      },
    },
  });

  if (error) {
    console.error("Error en signUp:", error);
    return new Response(error.message, { status: 500 });
  }

  return redirect("/signin");
};