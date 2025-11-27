import useClient from "@/app/hooks/useClient";

export function useUpdateDescription() {
  const client = useClient();

  return async (visionId: number, newDescription: string) => {
    await client
      .from("visions")
      .update({ description: newDescription })
      .eq("id", visionId)
      .single()
      .throwOnError();
  };
}
