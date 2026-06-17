"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PendoInitializer() {
  useEffect(() => {
    pendo.initialize({
      visitor: { id: "" },
    });

    const supabase = createClient();
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
        session?.user
      ) {
        pendo.identify({
          visitor: {
            id: session.user.id,
            email: session.user.email || "",
          },
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
