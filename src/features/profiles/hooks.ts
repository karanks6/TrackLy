import { useQuery } from "@tanstack/react-query"
import { getProfiles } from "./api"

export const profilesKeys = {
  all: ["profiles"] as const,
}

export function useProfiles() {
  return useQuery({
    queryKey: profilesKeys.all,
    queryFn: getProfiles,
  })
}
