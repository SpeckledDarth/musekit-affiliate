"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useRealtimeTable(tableName: string, onUpdate: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, onUpdate]);
}
