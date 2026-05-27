import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  useEffect(() => {
    supabase
      .from("profiles")
      .select("count")
      .then((result) => {
        console.log("Supabase reachable:", result);
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Collectiv</Text>
    </View>
  );
}
