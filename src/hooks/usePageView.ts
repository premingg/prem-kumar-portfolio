import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

function getVisitorId(): string {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
}

export function usePageView(page: string = "/") {
  useEffect(() => {
    const visitorId = getVisitorId();
    supabase
      .from("page_views")
      .insert({
        page,
        visitor_id: visitorId,
        user_agent: navigator.userAgent,
      })
      .then();
  }, [page]);
}
